require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const webpush = require('web-push');
const fs = require('fs');
const cron = require('node-cron');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/* -------------------- CORS -------------------- */
const allowedOrigins = [
  'https://oguzemrecakil.com.tr',
  'http://localhost:5001',
  'http://localhost:5000'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json());
app.use('/uploads', express.static('uploads'));

/* -------------------- ENV -------------------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_garden';
const JWT_SECRET =
  process.env.JWT_SECRET ||
  'a0dfee049e99a9fc02103dcfdaa7c1c9314bd16728518450e6f7705464f78693';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || EMAIL_USER;

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

const MONTH_NAMES = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık'
];

/* -------------------- Nodemailer -------------------- */
const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

mailTransporter.verify((error) => {
  if (error) {
    console.error('Mail transporter doğrulama hatası:', error);
  } else {
    console.log('Mail transporter hazır, email gönderebilir.');
  }
});

/* -------------------- Web Push -------------------- */
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${EMAIL_USER || 'example@example.com'}`,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} else {
  console.warn(
    'VAPID anahtarları tanımlı değil. Push bildirimleri çalışmayacak.'
  );
}


/* -------------------- Multer (Resim Upload) -------------------- */
const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, 'uploads/');
  },
  filename: function (_, file, cb) {
    cb(
      null,
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    );
  }
});

// Maksimum 1 MB ve sadece resim formatları
const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1 MB
  },
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error(
          'Sadece JPEG, PNG veya WEBP formatında resim yükleyebilirsin.'
        )
      );
    }
    cb(null, true);
  }
});


/* -------------------- Mongoose Modelleri -------------------- */

const maintenanceSchema = new mongoose.Schema({
  month: { type: Number, min: 1, max: 12, required: true },
  tasks: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const treeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    count: { type: Number, default: 1 },
    notes: String,
    imageUrl: { type: String, default: '/uploads/noimage.jpg' },

    // 🆕 KATEGORİ
    category: { type: String, default: 'genel' },

    // 🗺️ GPS KONUM (Multi-Location Support)
    locations: [{
      lat: Number,
      lng: Number,
      accuracy: Number,
      setAt: Date,
      count: { type: Number, default: 1 }
    }],

    // Legacy Location (Backward Compatibility)
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      accuracy: { type: Number, default: null },
      setAt: { type: Date, default: null }
    },

    maintenance: [maintenanceSchema]
  },
  { timestamps: true }
);

const vegetableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    count: { type: Number, default: 1 },
    notes: String,
    imageUrl: { type: String, default: '/uploads/noimage.png' },

    // 🆕 KATEGORİ
    category: { type: String, default: 'genel' },

    // 🗺️ GPS KONUM (Multi-Location Support)
    locations: [{
      lat: Number,
      lng: Number,
      accuracy: Number,
      setAt: Date,
      count: { type: Number, default: 1 }
    }],

    // Legacy Location
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      accuracy: { type: Number, default: null },
      setAt: { type: Date, default: null }
    },

    maintenance: [maintenanceSchema]
  },
  { timestamps: true }
);


const customLabelSchema = new mongoose.Schema({
  text: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String, default: '' },

  // AYARLAR - Tüm kullanıcı ayarları burada saklanır
  settings: {
    // Bildirim & Hatırlatma Ayarları
    notifications: {
      emailEnabled: { type: Boolean, default: true },
      pushEnabled: { type: Boolean, default: true },
      reminderTime: { type: String, default: '08:00' },
      weeklyDigest: { type: Boolean, default: false },
      criticalTaskAlerts: { type: Boolean, default: true }
    },

    // Görünüm & Tema Ayarları
    appearance: {
      theme: { type: String, default: 'light' }, // light, dark, auto
      colorScheme: { type: String, default: 'green' }, // green, blue, brown, purple
      fontSize: { type: String, default: 'medium' }, // small, medium, large
      viewMode: { type: String, default: 'card' }, // card, list
      chartsDefaultOpen: { type: Boolean, default: true }
    },

    // Hatırlatma Tercihleri
    reminders: {
      treeOnlyImportantDefault: { type: Boolean, default: false },
      vegOnlyImportantDefault: { type: Boolean, default: false },
      autoOpenSuggestions: { type: Boolean, default: true }
    },

    // Hava Durumu Ayarları
    weather: {
      city: { type: String, default: 'Elazig' },
      unit: { type: String, default: 'metric' }, // metric, imperial
      updateFrequency: { type: Number, default: 30 }, // dakika
      rainAlerts: { type: Boolean, default: true },
      heatAlerts: { type: Boolean, default: true },
      heatThreshold: { type: Number, default: 30 }, // Celsius
      frostAlerts: { type: Boolean, default: true }
    },

    // Bakım Planlama Ayarları
    maintenance: {
      defaultWateringFrequency: { type: Number, default: 7 }, // gün
      defaultFertilizingPeriod: { type: Number, default: 30 }, // gün
      autoTaskCreation: { type: Boolean, default: true },
      harvestReminders: { type: Boolean, default: true },
      wateringSeasonStart: { type: Number, default: 3 }, // Mart
      wateringSeasonEnd: { type: Number, default: 10 }, // Ekim
      fertilizingSeasonStart: { type: Number, default: 3 }, // Mart
      fertilizingSeasonEnd: { type: Number, default: 9 } // Eylül
    },

    // Tarih & Saat Formatları
    ui: {
      dateFormat: { type: String, default: 'dd.MM.yyyy' },
      timeFormat: { type: String, default: 'HH:mm' }
    },

    // Profil & Kişiselleştirme
    profile: {
      gardenName: { type: String, default: '' },
      gardenSize: { type: Number, default: 0 }, // m²
      experienceLevel: { type: String, default: 'beginner' }, // beginner, intermediate, advanced
      location: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
      }
    }
  }
}, { timestamps: true });

const pushSubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  subscription: { type: Object, required: true },
  browser: { type: String, default: 'unknown' }, // chrome, firefox, safari, edge, opera, unknown
  userAgent: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const dailyReminderLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD formatında
  sentAt: { type: Date, default: Date.now }
});
dailyReminderLogSchema.index({ user: 1, date: 1 }, { unique: true });

const gardenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, default: 'Bahçem' },
  boundaries: [{
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }], // Polygon coordinates
  center: {
    lat: { type: Number, default: 38.787308 },
    lng: { type: Number, default: 39.149078 }
  },
  zoom: { type: Number, default: 19 },
  area: { type: Number, default: 2370 }, // m² cinsinden alan
  notes: String
}, { timestamps: true });

const Tree = mongoose.model('Tree', treeSchema);
const Vegetable = mongoose.model('Vegetable', vegetableSchema);
const Admin = mongoose.model('Admin', adminSchema);
const PushSubscription = mongoose.model('PushSubscription', pushSubscriptionSchema);
const DailyReminderLog = mongoose.model('DailyReminderLog', dailyReminderLogSchema);
const Garden = mongoose.model('Garden', gardenSchema);
const CustomLabel = mongoose.model('CustomLabel', customLabelSchema);

/* -------------------- Auth Middleware -------------------- */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Token yok, tekrar giriş yapın.' });
  }

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token formatı hatalı.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, username }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş.' });
  }
}

/* -------------------- SETTINGS API -------------------- */

// Kullanıcının ayarlarını getir
app.get('/api/settings', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Eğer settings yoksa varsayılan değerleri döndür
    if (!admin.settings) {
      const defaultSettings = {
        notifications: {
          emailEnabled: true,
          pushEnabled: true,
          reminderTime: '08:00',
          weeklyDigest: false,
          criticalTaskAlerts: true
        },
        appearance: {
          theme: 'light',
          colorScheme: 'green',
          fontSize: 'medium',
          viewMode: 'card',
          chartsDefaultOpen: true
        },
        reminders: {
          treeOnlyImportantDefault: false,
          vegOnlyImportantDefault: false,
          autoOpenSuggestions: true
        },
        weather: {
          city: 'Elazig',
          unit: 'metric',
          updateFrequency: 30,
          rainAlerts: true,
          heatAlerts: true,
          heatThreshold: 30,
          frostAlerts: true
        },
        maintenance: {
          defaultWateringFrequency: 7,
          defaultFertilizingPeriod: 30,
          autoTaskCreation: true,
          harvestReminders: true,
          wateringSeasonStart: 3,
          wateringSeasonEnd: 10,
          fertilizingSeasonStart: 3,
          fertilizingSeasonEnd: 9
        },
        ui: {
          dateFormat: 'dd.MM.yyyy',
          timeFormat: 'HH:mm'
        },
        profile: {
          gardenName: '',
          gardenSize: 0,
          experienceLevel: 'beginner',
          location: { lat: 0, lng: 0 }
        }
      };

      // Varsayılan ayarları kaydet
      admin.settings = defaultSettings;
      await admin.save();
      return res.json(defaultSettings);
    }

    res.json(admin.settings);
  } catch (err) {
    console.error('Ayarlar getirme hatası:', err);
    res.status(500).json({ message: 'Ayarlar alınamadı' });
  }
});

// Ayarların tamamını güncelle (tüm settings objesi)
app.put('/api/settings', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    admin.settings = req.body;
    await admin.save();

    res.json({
      message: 'Ayarlar başarıyla güncellendi',
      settings: admin.settings
    });
  } catch (err) {
    console.error('Ayarlar güncelleme hatası:', err);
    res.status(500).json({ message: 'Ayarlar güncellenemedi' });
  }
});

// Tek bir ayarı güncelle (partial update)
app.patch('/api/settings', authMiddleware, async (req, res) => {
  try {
    const { path, value } = req.body;

    if (!path) {
      return res.status(400).json({ message: 'path parametresi gerekli' });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Mongoose dot notation ile güncelleme
    const updateObj = {};
    updateObj[`settings.${path}`] = value;

    await Admin.findByIdAndUpdate(req.user.id, updateObj, { new: true });

    // Güncel ayarları getir
    const updatedAdmin = await Admin.findById(req.user.id);

    res.json({
      message: 'Ayar başarıyla güncellendi',
      settings: updatedAdmin.settings
    });
  } catch (err) {
    console.error('Ayar güncelleme hatası:', err);
    res.status(500).json({ message: 'Ayar güncellenemedi' });
  }
});

// Email güncelleme endpoint'i
app.patch('/api/settings/email', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Geçerli bir email adresi girin' });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    admin.email = email;
    await admin.save();

    res.json({
      message: 'Email başarıyla güncellendi',
      email: admin.email
    });
  } catch (err) {
    console.error('Email güncelleme hatası:', err);
    res.status(500).json({ message: 'Email güncellenemedi' });
  }
});

/* -------------------- Geçmiş Bakım Raporu -------------------- */

/* -------------------- Geçmiş Bakım Raporu -------------------- */

app.get('/api/reports/history', authMiddleware, async (req, res) => {
  try {
    const [trees, vegetables] = await Promise.all([
      Tree.find({}),
      Vegetable.find({})
    ]);

    const result = [];

    const pushItem = (kind, name, m) => {
      if (!m || !m.completed) return; // sadece tamamlanmış kayıtlar
      result.push({
        kind,                      // 'Ağaç' | 'Sebze'
        name,
        month: m.month,
        completedAt: m.completedAt || null,
        task: m.tasks || '',
        notes: m.notes || '',
        type:
          m.tasks?.toLowerCase().includes('budama') ? 'Budama' :
            m.tasks?.toLowerCase().includes('ilaç') ? 'İlaçlama' :
              m.tasks?.toLowerCase().includes('gübre') ? 'Gübreleme' :
                m.tasks?.toLowerCase().includes('sula') ? 'Sulama' :
                  'Genel Bakım'
      });
    };

    trees.forEach(tree =>
      (tree.maintenance || []).forEach(m => pushItem('Ağaç', tree.name, m))
    );

    vegetables.forEach(veg =>
      (veg.maintenance || []).forEach(m => pushItem('Sebze', veg.name, m))
    );

    // Geçmişleri tarihe göre tersten sırala (son yapılan en üstte)
    result.sort((a, b) => {
      const da = a.completedAt ? new Date(a.completedAt) : 0;
      const db = b.completedAt ? new Date(b.completedAt) : 0;
      return db - da;
    });

    return res.json({
      count: result.length,
      items: result
    });
  } catch (err) {
    console.error('Geçmiş raporu hatası:', err);
    return res.status(500).json({ message: 'Rapor oluşturulamadı.' });
  }
});


// -------------------- Aylık Özet Raporu --------------------
app.get('/api/reports/monthly', authMiddleware, async (req, res) => {
  try {
    const month = Number(req.query.month);

    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ message: 'Ay 1-12 arasında olmalı.' });
    }

    const [trees, vegetables] = await Promise.all([
      Tree.find().lean(),
      Vegetable.find().lean()
    ]);

    let treeTotal = 0;
    let treeDone = 0;
    let vegTotal = 0;
    let vegDone = 0;

    // Ağaç
    trees.forEach((t) => {
      (t.maintenance || []).forEach((m) => {
        if (m.month === month) {
          treeTotal++;
          if (m.completed) treeDone++;
        }
      });
    });

    // Sebze
    vegetables.forEach((v) => {
      (v.maintenance || []).forEach((m) => {
        if (m.month === month) {
          vegTotal++;
          if (m.completed) vegDone++;
        }
      });
    });

    const response = {
      month,
      tree: {
        total: treeTotal,
        done: treeDone,
        remaining: treeTotal - treeDone,
        percent: treeTotal ? Math.round((treeDone / treeTotal) * 100) : 0
      },
      veg: {
        total: vegTotal,
        done: vegDone,
        remaining: vegTotal - vegDone,
        percent: vegTotal ? Math.round((vegDone / vegTotal) * 100) : 0
      },
      total: {
        total: treeTotal + vegTotal,
        done: treeDone + vegDone,
        remaining: treeTotal + vegTotal - (treeDone + vegDone),
        percent:
          treeTotal + vegTotal
            ? Math.round(((treeDone + vegDone) / (treeTotal + vegTotal)) * 100)
            : 0
      }
    };

    return res.json(response);
  } catch (err) {
    console.error('Aylık rapor hatası:', err);
    return res.status(500).json({ message: 'Rapor oluşturulamadı.' });
  }
});

/* -------------------- Otomatik Bakım Öneri Sistemi -------------------- */

/* -------------------- Otomatik Bakım Öneri Sistemi -------------------- */

function isImportantTask(text = '') {
  const t = text.toLowerCase();
  return /budama|ilaç|ilac|gübre|sulama|gubre/.test(t);
}

function classifyTask(text = '') {
  const t = text.toLowerCase();
  if (t.includes('budama')) return 'Budama';
  if (t.includes('ilaç') || t.includes('ilac')) return 'İlaçlama';
  if (t.includes('gübre') || t.includes('gubre')) return 'Gübreleme';
  if (t.includes('sula') || t.includes('su ver') || t.includes('sulama')) return 'Sulama';
  if (t.includes('hasat') || t.includes('topla')) return 'Hasat';
  return 'Genel Bakım';
}

app.get('/api/recommendations', authMiddleware, async (req, res) => {
  try {
    const monthParam = Number(req.query.month);
    const currentMonth =
      Number.isInteger(monthParam) && monthParam >= 1 && monthParam <= 12
        ? monthParam
        : new Date().getMonth() + 1;

    const [trees, vegetables] = await Promise.all([
      Tree.find({}).lean(),
      Vegetable.find({}).lean()
    ]);

    const items = [];

    // kind: 'tree' | 'vegetable'
    const pushItem = (kind, owner, m) => {
      const text = m.tasks || '';
      const important = isImportantTask(text);
      const taskType = classifyTask(text);

      // Ay farkına göre kategori
      let category = 'bu-ay';
      const diff = m.month - currentMonth;
      if (diff < 0) category = 'geçmiş';
      else if (diff > 0) category = 'gelecek';

      const base = {
        id: `${kind}-${owner._id}-${m.month}-${m._id || Math.random().toString(36).slice(2)
          }`,
        kind, // 'tree' | 'vegetable'
        name: owner.name,
        month: m.month,
        task: text,
        important,
        taskType,
        category,
        maintenanceId: m._id
      };

      if (kind === 'tree') {
        base.treeId = owner._id;
      } else {
        base.vegetableId = owner._id;
      }

      items.push(base);
    };

    trees.forEach((tree) => {
      (tree.maintenance || []).forEach((m) => {
        if (!m) return;
        if (!m.month || m.month < 1 || m.month > 12) return;
        if (m.completed) return; // tamamlanmışları önermeyelim
        pushItem('tree', tree, m);
      });
    });

    vegetables.forEach((veg) => {
      (veg.maintenance || []).forEach((m) => {
        if (!m) return;
        if (!m.month || m.month < 1 || m.month > 12) return;
        if (m.completed) return;
        pushItem('vegetable', veg, m);
      });
    });

    // Önemli ve bu-ay olanları öne al
    items.sort((a, b) => {
      const categoryOrder = { 'geçmiş': 0, 'bu-ay': 1, 'gelecek': 2 };
      if (categoryOrder[a.category] !== categoryOrder[b.category]) {
        return categoryOrder[a.category] - categoryOrder[b.category];
      }
      if (a.important !== b.important) {
        return a.important ? -1 : 1;
      }
      return a.month - b.month;
    });

    return res.json({
      month: currentMonth,
      generatedAt: new Date().toISOString(),
      count: items.length,
      items
    });
  } catch (err) {
    console.error('Öneri üretim hatası:', err);
    return res
      .status(500)
      .json({ message: 'Bakım önerileri üretilemedi.' });
  }
});




/* -------------------- Routes: Genel -------------------- */

app.get('/', (req, res) => {
  res.json({ message: 'Smart Garden API çalışıyor.' });
});

/* -------------------- Auth: Admin Login -------------------- */

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res
        .status(401)
        .json({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error('Login hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

/* -------------------- Hava Durumu (Elazığ sabit) -------------------- */
/* -------------------- Hava Durumu (Geniş Panel) -------------------- */
/* -------------------- Hava Durumu (Geniş Panel) -------------------- */
app.get('/api/weather/extended', authMiddleware, async (req, res) => {
  if (!WEATHER_API_KEY) {
    return res
      .status(500)
      .json({ message: 'WEATHER_API_KEY tanımlı değil (.env kontrol et).' });
  }

  try {
    const cityParam = (req.query.city || '').trim();
    const city = cityParam || 'Elazig';

    // 1) Şehrin anlık durumu + koordinatlar
    const currentResp = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'tr'
        }
      }
    );

    const current = currentResp.data;
    const coord = current.coord || {};
    const lat = coord.lat;
    const lon = coord.lon;

    if (typeof lat !== 'number' || typeof lon !== 'number') {
      console.error('[EXTENDED] lat/lon bulunamadı:', coord);
      return res
        .status(500)
        .json({ message: 'Konum bilgisi alınamadı (lat/lon yok).' });
    }

    // 2) One Call (varsa dolduracağız), yoksa forecast fallback kullanacağız
    let oneCall = null;
    try {
      // Önce 3.0 One Call dene
      const oc3 = await axios.get(
        'https://api.openweathermap.org/data/3.0/onecall',
        {
          params: {
            lat,
            lon,
            appid: WEATHER_API_KEY,
            units: 'metric',
            lang: 'tr',
            exclude: 'minutely,alerts'
          }
        }
      );
      if (!(oc3.data?.cod && Number(oc3.data.cod) !== 200)) {
        oneCall = oc3.data;
      } else {
        console.error('[EXTENDED] onecall v3.0 error body:', oc3.data);
      }
    } catch (err) {
      console.error(
        '[EXTENDED] onecall v3.0 error:',
        err.response?.data || err.message
      );
      // 3.0 çalışmazsa 2.5 dene
      try {
        const oc25 = await axios.get(
          'https://api.openweathermap.org/data/2.5/onecall',
          {
            params: {
              lat,
              lon,
              appid: WEATHER_API_KEY,
              units: 'metric',
              lang: 'tr',
              exclude: 'minutely,alerts'
            }
          }
        );
        if (!(oc25.data?.cod && Number(oc25.data.cod) !== 200)) {
          oneCall = oc25.data;
        } else {
          console.error('[EXTENDED] onecall v2.5 error body:', oc25.data);
        }
      } catch (err2) {
        console.error(
          '[EXTENDED] onecall v2.5 error:',
          err2.response?.data || err2.message
        );
      }
    }

    // 3) Forecast (5 günlük / 3 saatlik) – OneCall yoksa buradan saatlik/günlük üreteceğiz
    let forecast = null;
    try {
      const forecastResp = await axios.get(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            q: city,
            appid: WEATHER_API_KEY,
            units: 'metric',
            lang: 'tr'
          }
        }
      );
      forecast = forecastResp.data;
    } catch (err) {
      console.error(
        '[EXTENDED] forecast error:',
        err.response?.data || err.message
      );
    }

    // 4) Hava kalitesi (AQI)
    let airCurrent = null;
    try {
      const airResp = await axios.get(
        'https://api.openweathermap.org/data/2.5/air_pollution',
        {
          params: { lat, lon, appid: WEATHER_API_KEY }
        }
      );
      const list = airResp.data?.list || [];
      airCurrent = list[0] || null;
    } catch (err) {
      console.error(
        '[EXTENDED] air quality error:',
        err.response?.data || err.message
      );
    }

    // 5) Sunrise / sunset / UV
    const sunrise =
      (oneCall?.current && oneCall.current.sunrise) || current.sys?.sunrise;
    const sunset =
      (oneCall?.current && oneCall.current.sunset) || current.sys?.sunset;
    const uvi = oneCall?.current?.uvi; // OneCall yoksa undefined kalacak

    // 6) Saatlik tahmin
    let hourly = [];

    if (oneCall && Array.isArray(oneCall.hourly)) {
      // OneCall varsa gerçek saatlik tahmin
      hourly = oneCall.hourly.slice(0, 24).map((h) => ({
        dt: h.dt,
        temp: h.temp,
        feels_like: h.feels_like,
        uvi: h.uvi,
        pop: h.pop,
        wind_speed: h.wind_speed,
        wind_deg: h.wind_deg
      }));
    } else if (forecast && Array.isArray(forecast.list)) {
      // OneCall yok → forecast’in ilk 12 kaydını (3 saatlik) "saatlik" gibi kullan
      hourly = forecast.list.slice(0, 12).map((item) => ({
        dt: item.dt,
        temp: item.main?.temp,
        feels_like: item.main?.feels_like,
        // forecast’te UV yok → uvi: undefined kalacak
        uvi: undefined,
        pop: item.pop,
        wind_speed: item.wind?.speed,
        wind_deg: item.wind?.deg
      }));
    }

    // 7) Günlük tahmin (7 güne kadar)
    let daily = [];

    if (oneCall && Array.isArray(oneCall.daily)) {
      daily = oneCall.daily.slice(0, 7).map((d) => ({
        dt: d.dt,
        temp_min: d.temp?.min,
        temp_max: d.temp?.max,
        description: d.weather?.[0]?.description,
        icon: d.weather?.[0]?.icon,
        pop: d.pop,
        uvi: d.uvi
      }));
    } else if (forecast && Array.isArray(forecast.list)) {
      // Forecast’ten günlere göre grupla (en fazla 5 gün)
      const groups = new Map(); // key: 'YYYY-MM-DD' → {min, max, pop, desc, icon, dt}
      for (const item of forecast.list) {
        const dt = item.dt;
        const date = new Date(dt * 1000);
        const key = date.toISOString().slice(0, 10); // YYYY-MM-DD

        const temp = item.main?.temp;
        const pop = item.pop;
        const desc = item.weather?.[0]?.description;
        const icon = item.weather?.[0]?.icon;

        if (!groups.has(key)) {
          groups.set(key, {
            dt,
            temp_min: temp,
            temp_max: temp,
            pop,
            description: desc,
            icon
          });
        } else {
          const g = groups.get(key);
          g.temp_min =
            typeof temp === 'number'
              ? Math.min(g.temp_min, temp)
              : g.temp_min;
          g.temp_max =
            typeof temp === 'number'
              ? Math.max(g.temp_max, temp)
              : g.temp_max;
          if (typeof pop === 'number') {
            g.pop = Math.max(g.pop ?? 0, pop);
          }
          // description/icon aynı kalsın (ilk gelen)
        }
      }

      daily = Array.from(groups.entries())
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .slice(0, 7)
        .map(([_, g]) => ({
          dt: g.dt,
          temp_min: g.temp_min,
          temp_max: g.temp_max,
          description: g.description,
          icon: g.icon,
          pop: g.pop,
          uvi: undefined // Forecast’ten UV çıkmıyor
        }));
    }

    return res.json({
      city: current.name,
      current: {
        temp: current.main?.temp,
        feels_like: current.main?.feels_like,
        humidity: current.main?.humidity,
        wind_speed: current.wind?.speed,
        wind_deg: current.wind?.deg,
        pressure: current.main?.pressure,
        description: current.weather?.[0]?.description,
        icon: current.weather?.[0]?.icon,
        sunrise,
        sunset,
        uvi,
        clouds: current.clouds?.all
      },
      hourly,
      daily,
      air: airCurrent
        ? {
          aqi: airCurrent.main?.aqi,
          ...airCurrent.components
        }
        : null
    });
  } catch (err) {
    console.error(
      '[EXTENDED] Hava durumu hatası (üst seviye):',
      err.response?.status,
      err.response?.data || err.message
    );

    let status = err.response?.status || 500;
    if (status === 401 || status === 403) {
      status = 500;
    }

    return res.status(status).json({
      message: 'Geniş hava durumu alınırken hata oluştu.',
      detail: err.response?.data || err.message
    });
  }
});




/* -------------------- Hava Durumu -------------------- */
app.get('/api/weather', authMiddleware, async (req, res) => {
  if (!WEATHER_API_KEY) {
    return res
      .status(500)
      .json({ message: 'WEATHER_API_KEY tanımlı değil (.env kontrol et).' });
  }

  try {
    const cityParam = (req.query.city || '').trim();
    const city = cityParam || 'Elazig';

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'tr'
        }
      }
    );

    const data = response.data;
    res.json({
      city: data.name,
      temp: data.main?.temp,
      feels_like: data.main?.feels_like,
      humidity: data.main?.humidity,
      wind_speed: data.wind?.speed
    });
  } catch (err) {
    console.error('Hava durumu hatası:', err.response?.data || err.message);
    res.status(500).json({ message: 'Hava durumu alınırken hata oluştu.' });
  }
});


/* -------------------- Resim Upload -------------------- */

app.post(
  '/api/upload',
  authMiddleware,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res
            .status(400)
            .json({ message: 'Resim boyutu en fazla 1 MB olmalı.' });
        }
        return res
          .status(400)
          .json({ message: err.message || 'Resim yüklenemedi.' });
      }
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Resim bulunamadı.' });
    }
    return res.json({
      url: `/uploads/${req.file.filename}`
    });
  }
);


/* -------------------- Ağaç Endpoints -------------------- */

// Listele
app.get('/api/trees', authMiddleware, async (req, res) => {
  try {
    const trees = await Tree.find().sort({ name: 1 });
    res.json(trees);
  } catch (err) {
    console.error('Ağaç listeleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Ekle
// Ekle
app.post('/api/trees', authMiddleware, async (req, res) => {
  const { name, count, notes, imageUrl, maintenance, category } = req.body;

  try {
    // Kullanıcının ayarlarını al
    const admin = await Admin.findById(req.user.id);
    const settings = admin?.settings;

    // Maintenance array'i hazırla
    let maintenanceArray = Array.isArray(maintenance) ? maintenance : [];

    // Otomatik görev oluşturma aktifse ve maintenance boşsa
    if (settings?.maintenance?.autoTaskCreation && maintenanceArray.length === 0) {
      const defaultWateringFreq = settings.maintenance.defaultWateringFrequency || 7;
      const defaultFertilizingPeriod = settings.maintenance.defaultFertilizingPeriod || 30;
      const wateringSeasonStart = settings.maintenance.wateringSeasonStart || 3;
      const wateringSeasonEnd = settings.maintenance.wateringSeasonEnd || 10;

      // Sulama sezonu için görevler oluştur
      for (let month = wateringSeasonStart; month <= wateringSeasonEnd; month++) {
        maintenanceArray.push({
          month: month,
          tasks: `${defaultWateringFreq} günde bir sulama`,
          completed: false
        });
      }

      // Gübreleme görevi (yıllık)
      maintenanceArray.push({
        month: 4, // Nisan
        tasks: `${defaultFertilizingPeriod} günde bir gübreleme`,
        completed: false
      });

      console.log(`✓ ${name} için otomatik bakım görevleri oluşturuldu`);
    }

    const tree = new Tree({
      name,
      count,
      notes,
      imageUrl: imageUrl || undefined,
      maintenance: maintenanceArray,
      category: category || 'genel'
    });

    await tree.save();
    res.status(201).json(tree);
  } catch (err) {
    console.error('Ağaç ekleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});


// Güncelle
// Güncelle
app.put('/api/trees/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, count, notes, imageUrl, maintenance, category } = req.body;

  try {
    const updateData = {
      name,
      count,
      notes,
      maintenance: Array.isArray(maintenance) ? maintenance : []
    };

    if (typeof imageUrl !== 'undefined') {
      updateData.imageUrl = imageUrl || '/uploads/noimage.jpg';
    }

    // 🆕 kategori alanını da güncelle
    if (typeof category !== 'undefined') {
      updateData.category = category || 'genel';
    }

    const tree = await Tree.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!tree) {
      return res.status(404).json({ message: 'Ağaç bulunamadı.' });
    }

    res.json(tree);
  } catch (err) {
    console.error('Ağaç güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});


// Sil
app.delete('/api/trees/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const tree = await Tree.findByIdAndDelete(id);
    if (!tree) {
      return res.status(404).json({ message: 'Ağaç bulunamadı.' });
    }
    res.json({ message: 'Ağaç silindi.' });
  } catch (err) {
    console.error('Ağaç silme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});
// Sebze resmi sil

app.delete('/api/vegetables/:id/image', authMiddleware, async (req, res) => {
  try {
    const veg = await Vegetable.findById(req.params.id);
    if (!veg) {
      return res.status(404).json({ message: 'Sebze bulunamadı.' });
    }

    if (!veg.imageUrl) {
      veg.imageUrl = '/uploads/noimage.png';
      await veg.save();
      return res.json({ message: 'Varsayılan resim ayarlandı.', vegetable: veg });
    }

    const fileName = path.basename(veg.imageUrl);

    // Noimage ise direkt varsayılan bırak
    if (fileName === 'noimage.jpg' || fileName === 'noimage.png') {
      veg.imageUrl = '/uploads/noimage.png';
      await veg.save();
      return res.json({ message: 'Varsayılan resim ayarlandı.', vegetable: veg });
    }

    // Normal resimi sil
    const filePath = path.join(__dirname, 'uploads', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Değişiklik: Artık boş string değil, doğrudan varsayılan
    veg.imageUrl = '/uploads/noimage.png';
    await veg.save();

    return res.json({ message: 'Resim silindi, varsayılan resim ayarlandı.', vegetable: veg });

  } catch (err) {
    console.error('Sebze resim silme hatası:', err);
    return res.status(500).json({ message: 'Sebze resmi silinemedi.' });
  }
});


// Ağaç resmi sil
app.delete('/api/trees/:id/image', authMiddleware, async (req, res) => {
  try {
    const tree = await Tree.findById(req.params.id);
    if (!tree) {
      return res.status(404).json({ message: 'Ağaç bulunamadı.' });
    }

    if (!tree.imageUrl) {
      return res.json({ message: 'Resim zaten yok.', tree });
    }

    const fileName = path.basename(tree.imageUrl);
    if (fileName === 'noimage.jpg') {
      tree.imageUrl = '';
      await tree.save();
      return res.json({ message: 'Varsayılan resim korunuyor.', tree });
    }

    const filePath = path.join(__dirname, 'uploads', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    tree.imageUrl = '';
    await tree.save();

    return res.json({ message: 'Resim silindi.', tree });
  } catch (err) {
    console.error('Resim silme hatası:', err);
    return res.status(500).json({ message: 'Resim silinemedi.' });
  }
});

// Ağaç bakım tamamla / geri al (ilgili ayın tüm kayıtları)
app.patch('/api/trees/:id/maintenance/:month/toggle', authMiddleware, async (req, res) => {
  try {
    const { id, month } = req.params;
    const monthNumber = Number(month);

    const tree = await Tree.findById(id);
    if (!tree) {
      return res.status(404).json({ message: 'Ağaç bulunamadı.' });
    }

    const items = tree.maintenance.filter((m) => m.month === monthNumber);
    if (!items.length) {
      return res.status(404).json({ message: 'Bu aya ait bakım kaydı yok.' });
    }

    const currentlyCompleted = items.every((m) => m.completed);
    const newValue = !currentlyCompleted;
    items.forEach((m) => {
      m.completed = newValue;
    });

    await tree.save();

    res.json({ message: 'Bakım durumu güncellendi.', tree });
  } catch (err) {
    console.error('Bakım tamamlandı toggle hatası:', err);
    res.status(500).json({ message: 'Bakım durumu güncellenemedi.' });
  }
});

/* -------------------- Sebze Endpoints -------------------- */

// Listele
app.get('/api/vegetables', authMiddleware, async (req, res) => {
  try {
    const vegetables = await Vegetable.find().sort({ name: 1 });
    res.json(vegetables);
  } catch (err) {
    console.error('Sebze listeleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Ekle
// Ekle
app.post('/api/vegetables', authMiddleware, async (req, res) => {
  const { name, count, notes, imageUrl, maintenance, category } = req.body;

  try {
    // Kullanıcının ayarlarını al
    const admin = await Admin.findById(req.user.id);
    const settings = admin?.settings;

    // Maintenance array'i hazırla
    let maintenanceArray = Array.isArray(maintenance) ? maintenance : [];

    // Otomatik görev oluşturma aktifse ve maintenance boşsa
    if (settings?.maintenance?.autoTaskCreation && maintenanceArray.length === 0) {
      const defaultWateringFreq = settings.maintenance.defaultWateringFrequency || 7;
      const defaultFertilizingPeriod = settings.maintenance.defaultFertilizingPeriod || 30;
      const wateringSeasonStart = settings.maintenance.wateringSeasonStart || 3;
      const wateringSeasonEnd = settings.maintenance.wateringSeasonEnd || 10;

      // Sulama sezonu için görevler oluştur
      for (let month = wateringSeasonStart; month <= wateringSeasonEnd; month++) {
        maintenanceArray.push({
          month: month,
          tasks: `${defaultWateringFreq} günde bir sulama`,
          completed: false
        });
      }

      // Gübreleme görevi (yıllık)
      maintenanceArray.push({
        month: 5, // Mayıs
        tasks: `${defaultFertilizingPeriod} günde bir gübreleme`,
        completed: false
      });

      // Hasat hatırlatması aktifse ve sebze isminde hasat görevleri için ipucu varsa
      if (settings?.maintenance?.harvestReminders) {
        const harvestMonths = [6, 7, 8, 9]; // Haziran-Eylül arası hasat sezonu
        harvestMonths.forEach(month => {
          maintenanceArray.push({
            month: month,
            tasks: 'Hasat kontrolü (olgunlaşma durumu)',
            completed: false
          });
        });
      }

      console.log(`✓ ${name} için otomatik bakım görevleri oluşturuldu`);
    }

    const veg = new Vegetable({
      name,
      count,
      notes,
      imageUrl: imageUrl || undefined,
      maintenance: maintenanceArray,
      category: category || 'genel'
    });

    await veg.save();
    res.status(201).json(veg);
  } catch (err) {
    console.error('Sebze ekleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});


// Güncelle
// Güncelle
app.put('/api/vegetables/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, count, notes, imageUrl, maintenance, category } = req.body;

  try {
    const updateData = {
      name,
      count,
      notes,
      maintenance: Array.isArray(maintenance) ? maintenance : []
    };

    if (typeof imageUrl !== 'undefined') {
      updateData.imageUrl = imageUrl || '/uploads/noimage.jpg';
    }

    // 🆕 kategori alanı
    if (typeof category !== 'undefined') {
      updateData.category = category || 'genel';
    }

    const veg = await Vegetable.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!veg) {
      return res.status(404).json({ message: 'Sebze bulunamadı.' });
    }

    res.json(veg);
  } catch (err) {
    console.error('Sebze güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});


// Sil
app.delete('/api/vegetables/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const veg = await Vegetable.findByIdAndDelete(id);
    if (!veg) {
      return res.status(404).json({ message: 'Sebze bulunamadı.' });
    }
    res.json({ message: 'Sebze silindi.' });
  } catch (err) {
    console.error('Sebze silme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Sebze bakım tamamla / geri al
app.patch(
  '/api/vegetables/:id/maintenance/:month/toggle',
  authMiddleware,
  async (req, res) => {
    try {
      const { id, month } = req.params;
      const monthNumber = Number(month);

      const veg = await Vegetable.findById(id);
      if (!veg) {
        return res.status(404).json({ message: 'Sebze bulunamadı.' });
      }

      const items = veg.maintenance.filter((m) => m.month === monthNumber);
      if (!items.length) {
        return res.status(404).json({ message: 'Bu aya ait bakım kaydı yok.' });
      }

      const currentlyCompleted = items.every((m) => m.completed);
      const newValue = !currentlyCompleted;
      items.forEach((m) => {
        m.completed = newValue;
      });

      await veg.save();

      res.json({ message: 'Sebze bakım durumu güncellendi.', vegetable: veg });
    } catch (err) {
      console.error('Sebze bakım tamamlandı toggle hatası:', err);
      res.status(500).json({ message: 'Sebze bakım durumu güncellenemedi.' });
    }
  }
);
function isImportantTask(taskText) {
  return /budama|ilaç|sulama|gübre/i.test(taskText || '');
}

/* -------------------- Hatırlatmalar -------------------- */

// Ağaç hatırlatmaları
// Ağaç hatırlatmaları (SADECE TAMAMLANMAMIŞ GÖREVLER)
app.get('/api/reminders/:month', authMiddleware, async (req, res) => {
  const month = parseInt(req.params.month, 10);

  if (Number.isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Ay 1 ile 12 arasında olmalı.' });
  }

  try {
    // Bu ay için EN AZ 1 tane tamamlanmamış görevi olan ağaçları bul
    const trees = await Tree.find({
      maintenance: { $elemMatch: { month, completed: false } }
    });

    // Sadece tamamlanmamış görevleri listele
    const reminders = trees
      .map((tree) => {
        const tasksForMonth = (tree.maintenance || [])
          .filter((m) => m.month === month && !m.completed) // ✅ sadece completed:false
          .map((m) => m.tasks);

        // Bu ağaçta bu ay için tamamlanmamış görev kalmadıysa kart üretme
        if (!tasksForMonth.length) return null;

        return {
          treeId: tree._id,
          name: tree.name,
          count: tree.count,
          tasks: tasksForMonth
        };
      })
      .filter(Boolean); // null olanları at

    res.json({ month, reminders });
  } catch (err) {
    console.error('Hatırlatma hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});


// Sebze hatırlatmaları
// Sebze hatırlatmaları (SADECE TAMAMLANMAMIŞ GÖREVLER)
app.get('/api/veg-reminders/:month', authMiddleware, async (req, res) => {
  const month = parseInt(req.params.month, 10);

  if (Number.isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Ay 1 ile 12 arasında olmalı.' });
  }

  try {
    // Önce bu ay için EN AZ 1 tane tamamlanmamış görevi olan sebzeleri bul
    const vegetables = await Vegetable.find({
      maintenance: { $elemMatch: { month, completed: false } }
    });

    // Sadece tamamlanmamış görevleri listele
    const reminders = vegetables
      .map((veg) => {
        const tasksForMonth = (veg.maintenance || [])
          .filter((m) => m.month === month && !m.completed) // ✅ sadece completed:false
          .map((m) => m.tasks);

        // Eğer bu sebzenin bu ay için hiç tamamlanmamış görevi kalmadıysa kart oluşturma
        if (!tasksForMonth.length) return null;

        return {
          vegetableId: veg._id,
          name: veg.name,
          count: veg.count,
          tasks: tasksForMonth
        };
      })
      .filter(Boolean); // null olanları at

    res.json({ month, reminders });
  } catch (err) {
    console.error('Sebze hatırlatma hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});


/* -------------------- E-posta Hatırlatma -------------------- */

// Ağaç
// AYLIK BAKIMI MAIL OLARAK GÖNDER (SADECE TAMAMLANMAMIŞ GÖREVLER)
// AYLIK BAKIMI MAIL OLARAK GÖNDER (SADECE TAMAMLANMAMIŞ GÖREVLER)
app.post('/api/reminders/send-email', authMiddleware, async (req, res) => {
  try {
    let { month, onlyImportant } = req.body;
    const userEmail = req.user.email || process.env.NOTIFY_EMAIL;

    // Ayı sayı olarak al
    const monthNumber = Number(month);
    if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ message: 'Ay 1 ile 12 arasında olmalı.' });
    }
    month = monthNumber;

    if (!userEmail) {
      return res.status(500).json({
        message:
          'Alıcı e-posta adresi bulunamadı (req.user.email veya NOTIFY_EMAIL tanımlı değil).'
      });
    }

    // 1) Bu ay için bakım kaydı olan ağaçları bul
    const trees = await Tree.find({
      'maintenance.month': month
    }).lean();

    if (!trees.length) {
      return res.json({
        message: `${MONTH_NAMES[month - 1]} ayı için bakım planı bulunmuyor.`
      });
    }

    // 2) SADECE TAMAMLANMAMIŞ görevleri al (completed !== true)
    const lines = trees
      .map((t) => {
        const incompletes = (t.maintenance || [])
          .filter((m) => {
            const sameMonth =
              m.month === month && m.completed !== true; // hâlâ tamamlanmamış
            if (!sameMonth) return false;

            if (onlyImportant) {
              return isImportantTask(m.tasks);
            }
            return true;
          })
          .map((m) => `• ${m.tasks}`)
          .join('\n');


        if (!incompletes) return null; // Bu ağaçta tamamlanmamış görev yoksa atla

        return `Ağaç: ${t.name} (Adet: ${t.count})\n${incompletes}`;
      })
      .filter(Boolean);

    // 3) Hiç tamamlanmamış görev yoksa MAIL GÖNDERME
    if (!lines.length) {
      return res.json({
        message: onlyImportant
          ? `${MONTH_NAMES[month - 1]} ayı için ÖNEMLİ (budama/ilaç/sulama/gübre) TAMAMLANMAMIŞ bakım bulunmuyor.`
          : `${MONTH_NAMES[month - 1]} ayı için TAMAMLANMAMIŞ bakım bulunmuyor.`
      });
    }


    const mailText =
      `${MONTH_NAMES[month - 1]} ayı için tamamlanmamış bakım görevlerin:\n\n` +
      lines.join('\n\n') +
      `\n\nGörevleri tamamladıkça uygulamada ilgili ayın kartına tıklayıp 'tamamlandı' işaretleyebilirsin. 🌿`;

    const mailOptions = {
      from:
        process.env.FROM_EMAIL ||
        process.env.SMTP_USER ||
        process.env.EMAIL_USER,
      to: userEmail,
      subject: `Akıllı Bahçe - ${MONTH_NAMES[month - 1]} için tamamlanmamış bakımlar`,
      text: mailText
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log('E-posta gönderildi, messageId:', info.messageId);

    return res.json({
      message: 'Hatırlatma maili gönderildi.',
      id: info.messageId
    });
  } catch (err) {
    console.error('E-posta gönderim hatası:', err);
    return res.status(500).json({
      message:
        'E-posta gönderilemedi: ' +
        (err.response?.body || err.message || 'Bilinmeyen hata')
    });
  }
});



// Sebze
// SEBZELER İÇİN AYLIK BAKIMI MAIL OLARAK GÖNDER (SADECE TAMAMLANMAMIŞ GÖREVLER)
app.post('/api/veg-reminders/send-email', authMiddleware, async (req, res) => {
  try {
    let { month, onlyImportant } = req.body;
    const userEmail = process.env.NOTIFY_EMAIL; // Sebzede JWT'de email yok, env'den alıyoruz

    const monthNumber = Number(month);
    if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ message: 'Ay 1 ile 12 arasında olmalı.' });
    }
    month = monthNumber;

    if (!userEmail) {
      return res.status(500).json({
        message:
          'Sebze e-postası için alıcı e-posta adresi bulunamadı (NOTIFY_EMAIL tanımlı değil).'
      });
    }

    // 1) Bu ay için bakım kaydı olan sebzeleri bul
    const veggies = await Vegetable.find({
      'maintenance.month': month
    }).lean();

    if (!veggies.length) {
      return res.json({
        message: `${MONTH_NAMES[month - 1]} ayı için SEBZELERDE bakım planı bulunmuyor.`
      });
    }

    // 2) SADECE TAMAMLANMAMIŞ görevleri (completed !== true) topla
    const lines = veggies
      .map((v) => {
        const incompletes = (v.maintenance || [])
          .filter((m) => {
            const sameMonth =
              m.month === month && m.completed !== true;
            if (!sameMonth) return false;

            if (onlyImportant) {
              return isImportantTask(m.tasks);
            }
            return true;
          })
          .map((m) => `• ${m.tasks}`)
          .join('\n');


        if (!incompletes) return null;

        return `Sebze: ${v.name} (Adet: ${v.count})\n${incompletes}`;
      })
      .filter(Boolean);

    // 3) Hiç tamamlanmamış sebze görevi yoksa MAIL GÖNDERME
    if (!lines.length) {
      return res.json({
        message: onlyImportant
          ? `${MONTH_NAMES[month - 1]} ayı için SEBZELERDE ÖNEMLİ TAMAMLANMAMIŞ bakım yok.`
          : `${MONTH_NAMES[month - 1]} ayı için SEBZELERDE TAMAMLANMAMIŞ bakım yok.`
      });
    }


    const mailText =
      `${MONTH_NAMES[month - 1]} ayı için tamamlanmamış SEBZE bakım görevlerin:\n\n` +
      lines.join('\n\n') +
      `\n\nGörevleri tamamladıkça uygulamada ilgili ayın kartına tıklayıp 'tamamlandı' işaretleyebilirsin. 🥬`;

    const mailOptions = {
      from:
        process.env.FROM_EMAIL ||
        process.env.SMTP_USER ||
        process.env.EMAIL_USER,
      to: userEmail,
      subject: `Akıllı Bahçe - ${MONTH_NAMES[month - 1]} sebze bakımları`,
      text: mailText
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log('Sebze e-posta gönderildi, messageId:', info.messageId);

    return res.json({
      message: 'Sebze hatırlatma maili gönderildi.',
      id: info.messageId
    });
  } catch (err) {
    console.error('Sebze e-posta gönderim hatası:', err);
    return res.status(500).json({
      message:
        'Sebze e-postası gönderilemedi: ' +
        (err.response?.body || err.message || 'Bilinmeyen hata')
    });
  }
});


/* -------------------- Push Abonelik & Hatırlatma -------------------- */

// Abone ol
app.post('/api/push/subscribe', authMiddleware, async (req, res) => {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return res
        .status(500)
        .json({ message: 'VAPID anahtarları tanımlı değil.' });
    }

    const userId = req.user.id;
    const { browser, userAgent, ...subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ message: 'Geçersiz subscription verisi.' });
    }

    console.log('Push subscribe çağrıldı. user:', userId, 'browser:', browser || 'unknown');

    // Aynı endpoint'e sahip aboneliği bul (aynı tarayıcı/cihaz)
    const existingSub = await PushSubscription.findOne({
      user: userId,
      'subscription.endpoint': subscription.endpoint
    });

    if (existingSub) {
      // Varolan aboneliği güncelle
      existingSub.subscription = subscription;
      existingSub.browser = browser || 'unknown';
      existingSub.userAgent = userAgent || '';
      existingSub.createdAt = new Date();
      await existingSub.save();
      console.log(`✓ ${browser || 'unknown'} tarayıcısı için mevcut abonelik güncellendi.`);
    } else {
      // Yeni abonelik oluştur
      const sub = new PushSubscription({
        user: userId,
        subscription,
        browser: browser || 'unknown',
        userAgent: userAgent || ''
      });
      await sub.save();
      console.log(`✓ ${browser || 'unknown'} tarayıcısı için yeni abonelik oluşturuldu.`);
    }

    // Kullanıcının toplam aktif abonelik sayısını göster
    const totalSubs = await PushSubscription.countDocuments({ user: userId });
    console.log(`  → Kullanıcının toplam aktif aboneliği: ${totalSubs}`);

    return res.json({
      message: 'Push aboneliği kaydedildi.',
      browser: browser || 'unknown',
      totalSubscriptions: totalSubs
    });
  } catch (err) {
    console.error('Push subscribe hatası:', err);
    return res
      .status(500)
      .json({ message: 'Push aboneliği kaydedilemedi (server hatası).' });
  }
});

// Ağaçlar için push
app.post('/api/push/send-reminders', authMiddleware, async (req, res) => {
  const { month, onlyImportant } = req.body;
  const userId = req.user.id;

  console.log('Push send-reminders çağrıldı. month:', month, 'user:', userId);

  const m = Number(month);
  if (!m || m < 1 || m > 12) {
    return res.status(400).json({ message: 'Geçersiz ay değeri.' });
  }

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res
      .status(500)
      .json({ message: 'VAPID anahtarları yok, push gönderilemez.' });
  }

  try {
    const trees = await Tree.find({
      maintenance: { $elemMatch: { month: m, completed: false } }
    }).lean();

    console.log('Tamamlanmamış bakım olan ağaç sayısı:', trees.length);

    if (!trees.length) {
      return res.json({
        message: `${MONTH_NAMES[m - 1]} ayı için TAMAMLANMAMIŞ ağaç bakımı yok.`
      });
    }

    const namesWithTasks = trees
      .map((t) => {
        const incompletes = (t.maintenance || [])
          .filter((mm) => {
            const sameMonth = mm.month === m && !mm.completed;
            if (!sameMonth) return false;

            if (onlyImportant) {
              return isImportantTask(mm.tasks);
            }
            return true;
          })
          .map((mm) => mm.tasks)
          .join(', ');

        if (!incompletes) return null;
        return `${t.name} (${incompletes})`;
      })
      .filter(Boolean);


    if (!namesWithTasks.length) {
      return res.json({
        message: onlyImportant
          ? `${MONTH_NAMES[m - 1]} ayı için ÖNEMLİ TAMAMLANMAMIŞ ağaç bakımı yok.`
          : `${MONTH_NAMES[m - 1]} ayı için TAMAMLANMAMIŞ ağaç bakımı yok.`
      });
    }


    const title = `Bahçe bakımı zamanı - ${MONTH_NAMES[m - 1]} (Ağaçlar)`;
    const body = `${MONTH_NAMES[m - 1]} ayında tamamlanmamış ağaç bakımları: ${namesWithTasks.join(
      ' | '
    )}`;

    const subs = await PushSubscription.find({ user: userId }).lean();
    console.log(`Push subscription sayısı: ${subs.length}`);

    // Hangi tarayıcılara gönderileceğini göster
    if (subs.length > 0) {
      const browsers = subs.map(s => s.browser || 'unknown').join(', ');
      console.log(`  → Hedef tarayıcılar: ${browsers}`);
    }

    if (!subs.length) {
      return res.json({
        message: 'Kayıtlı push aboneliği yok (önce Bildirimleri aç).'
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: {
        url: '',
        month: m
      }
    });

    let successCount = 0;
    const results = [];

    for (const sub of subs) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        successCount++;
        console.log(`  ✓ ${sub.browser || 'unknown'} tarayıcısına bildirim gönderildi`);
        results.push({ browser: sub.browser, status: 'success' });
      } catch (err) {
        console.error(
          `  ✗ ${sub.browser || 'unknown'} tarayıcısına gönderim hatası:`,
          err.statusCode,
          err.body || err.message
        );
        results.push({ browser: sub.browser, status: 'failed', error: err.message });
      }
    }

    return res.json({
      message: `${subs.length} aboneliğin ${successCount} tanesine push bildirimi gönderildi.`,
      results: results
    });
  } catch (err) {
    console.error('Push hatırlatma hatası:', err);
    return res
      .status(500)
      .json({ message: 'Push bildirimi gönderilemedi (server hatası).' });
  }
});

// Sebzeler için push
app.post(
  '/api/push/send-veg-reminders',
  authMiddleware,
  async (req, res) => {
    const { month, onlyImportant } = req.body;
    const userId = req.user.id;

    console.log(
      'Push send-veg-reminders çağrıldı. month:',
      month,
      'user:',
      userId
    );

    const m = Number(month);
    if (!m || m < 1 || m > 12) {
      return res.status(400).json({ message: 'Geçersiz ay değeri.' });
    }

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return res
        .status(500)
        .json({ message: 'VAPID anahtarları yok, push gönderilemez.' });
    }

    try {
      const vegetables = await Vegetable.find({
        maintenance: { $elemMatch: { month: m, completed: false } }
      }).lean();

      console.log('Tamamlanmamış bakım olan sebze sayısı:', vegetables.length);

      if (!vegetables.length) {
        return res.json({
          message: `${MONTH_NAMES[m - 1]} ayı için TAMAMLANMAMIŞ sebze bakımı yok.`
        });
      }

      const namesWithTasks = vegetables
        .map((v) => {
          const incompletes = (v.maintenance || [])
            .filter((mm) => {
              const sameMonth = mm.month === m && !mm.completed;
              if (!sameMonth) return false;

              if (onlyImportant) {
                return isImportantTask(mm.tasks);
              }
              return true;
            })
            .map((mm) => mm.tasks)
            .join(', ');

          if (!incompletes) return null;
          return `${v.name} (${incompletes})`;
        })
        .filter(Boolean);

      if (!namesWithTasks.length) {
        return res.json({
          message: onlyImportant
            ? `${MONTH_NAMES[m - 1]} ayı için SEBZELERDE ÖNEMLİ TAMAMLANMAMIŞ bakım yok.`
            : `${MONTH_NAMES[m - 1]} ayı için SEBZELERDE TAMAMLANMAMIŞ bakım yok.`
        });
      }

      const title = `Bahçe bakımı zamanı - ${MONTH_NAMES[m - 1]} (Sebzeler)`;
      const body = `${MONTH_NAMES[m - 1]} ayında tamamlanmamış sebze bakımları: ${namesWithTasks.join(
        ' | '
      )}`;

      const subs = await PushSubscription.find({ user: userId }).lean();
      console.log(`Push subscription sayısı: ${subs.length}`);

      // Hangi tarayıcılara gönderileceğini göster
      if (subs.length > 0) {
        const browsers = subs.map(s => s.browser || 'unknown').join(', ');
        console.log(`  → Hedef tarayıcılar: ${browsers}`);
      }

      if (!subs.length) {
        return res.json({
          message: 'Kayıtlı push aboneliği yok (önce Bildirimleri aç).'
        });
      }

      const payload = JSON.stringify({
        title,
        body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        data: {
          url: '',
          month: m
        }
      });

      let successCount = 0;
      const results = [];

      for (const sub of subs) {
        try {
          await webpush.sendNotification(sub.subscription, payload);
          successCount++;
          console.log(`  ✓ ${sub.browser || 'unknown'} tarayıcısına bildirim gönderildi (sebze)`);
          results.push({ browser: sub.browser, status: 'success' });
        } catch (err) {
          console.error(
            `  ✗ ${sub.browser || 'unknown'} tarayıcısına gönderim hatası (sebze):`,
            err.statusCode,
            err.body || err.message
          );
          results.push({ browser: sub.browser, status: 'failed', error: err.message });
        }
      }

      return res.json({
        message: `${subs.length} aboneliğin ${successCount} tanesine sebze push bildirimi gönderildi.`,
        results: results
      });
    } catch (err) {
      console.error('Sebze push hatırlatma hatası:', err);
      return res.status(500).json({
        message: 'Sebze push bildirimi gönderilemedi (server hatası).'
      });
    }
  }
);

// Özel Etiket Güncelle (PATCH)
app.patch('/api/map/custom-labels/:id', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Etiket metni gereklidir.' });
    }

    const label = await CustomLabel.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true } // Güncellenmiş belgeyi döndür
    );

    if (!label) {
      return res.status(404).json({ message: 'Etiket bulunamadı.' });
    }

    res.json(label);
  } catch (err) {
    console.error('Etiket güncelleme hatası:', err);
    res.status(500).json({ message: 'Etiket güncellenemedi.' });
  }
});
/* -------------------- Bakım Raporu (Geçmiş / Özet) -------------------- */

/* -------------------- Bakım Raporu (Geçmiş / Özet) -------------------- */

app.get('/api/reports/history-summary', authMiddleware, async (req, res) => {
  try {
    const yearParam = req.query.year;
    const year = yearParam ? Number(yearParam) : new Date().getFullYear();

    // 12 ay için temel yapı
    const months = MONTH_NAMES.map((name, idx) => ({
      month: idx + 1,
      monthName: name,
      trees: { total: 0, completed: 0 },
      vegetables: { total: 0, completed: 0 }
    }));

    const [trees, vegetables] = await Promise.all([
      Tree.find().lean(),
      Vegetable.find().lean()
    ]);

    // Ağaç bakımları
    trees.forEach((t) => {
      (t.maintenance || []).forEach((m) => {
        if (!m || typeof m.month !== 'number') return;
        if (m.month < 1 || m.month > 12) return;

        const idx = m.month - 1;
        months[idx].trees.total += 1;
        if (m.completed) months[idx].trees.completed += 1;
      });
    });

    // Sebze bakımları
    vegetables.forEach((v) => {
      (v.maintenance || []).forEach((m) => {
        if (!m || typeof m.month !== 'number') return;
        if (m.month < 1 || m.month > 12) return;

        const idx = m.month - 1;
        months[idx].vegetables.total += 1;
        if (m.completed) months[idx].vegetables.completed += 1;
      });
    });

    const totals = {
      trees: { totalTasks: 0, completedTasks: 0 },
      vegetables: { totalTasks: 0, completedTasks: 0 },
      all: { totalTasks: 0, completedTasks: 0 }
    };

    months.forEach((m) => {
      totals.trees.totalTasks += m.trees.total;
      totals.trees.completedTasks += m.trees.completed;
      totals.vegetables.totalTasks += m.vegetables.total;
      totals.vegetables.completedTasks += m.vegetables.completed;
    });

    totals.all.totalTasks =
      totals.trees.totalTasks + totals.vegetables.totalTasks;
    totals.all.completedTasks =
      totals.trees.completedTasks + totals.vegetables.completedTasks;

    return res.json({ year, months, totals });
  } catch (err) {
    console.error('Rapor oluşturma hatası:', err);
    return res.status(500).json({ message: 'Rapor oluşturulamadı.' });
  }
});

// Test endpoint - Günlük hatırlatmayı manuel olarak tetikle
app.post('/api/test/daily-reminder', authMiddleware, async (req, res) => {
  try {
    console.log('\n🧪 Manuel test: Günlük hatırlatma tetiklendi');

    // Bugünkü log'u temizle (test için)
    const todayDate = new Date().toISOString().split('T')[0];
    const admin = await Admin.findById(req.user.id);
    await DailyReminderLog.deleteOne({
      user: admin._id,
      date: todayDate
    });
    console.log('  🗑️  Bugünkü hatırlatma logu temizlendi (test için)');

    await sendDailyReminders();
    res.json({ message: 'Günlük hatırlatma testi tamamlandı. Konsol loglarını kontrol edin.' });
  } catch (err) {
    console.error('Test hatası:', err);
    res.status(500).json({ message: 'Test başarısız.', error: err.message });
  }
});

// Test endpoint - Bugünkü hatırlatma logunu temizle
app.delete('/api/test/daily-reminder-log', authMiddleware, async (req, res) => {
  try {
    const todayDate = new Date().toISOString().split('T')[0];
    const admin = await Admin.findById(req.user.id);

    const result = await DailyReminderLog.deleteOne({
      user: admin._id,
      date: todayDate
    });

    if (result.deletedCount > 0) {
      console.log(`🗑️  ${admin.username} için bugünkü hatırlatma logu temizlendi`);
      res.json({
        message: 'Bugünkü hatırlatma logu temizlendi. Artık tekrar bildirim alabilirsiniz.',
        cleared: true
      });
    } else {
      res.json({
        message: 'Bugün için hatırlatma logu bulunamadı.',
        cleared: false
      });
    }
  } catch (err) {
    console.error('Log temizleme hatası:', err);
    res.status(500).json({ message: 'Log temizlenemedi.', error: err.message });
  }
});

// Test endpoint - Otomatik görev oluşturma testi
app.post('/api/test/auto-task', authMiddleware, async (req, res) => {
  try {
    console.log('\n🧪 Otomatik görev oluşturma testi başlatılıyor...');

    const admin = await Admin.findById(req.user.id);
    const settings = admin?.settings;

    if (!settings?.maintenance?.autoTaskCreation) {
      return res.json({
        message: 'Otomatik görev oluşturma kapalı. Ayarlar > Bakım Planlama bölümünden açabilirsiniz.',
        autoTaskCreation: false
      });
    }

    // Test bitkisi ekle
    const testTree = new Tree({
      name: 'Test Ağacı (Otomatik görev testi)',
      count: 1,
      notes: 'Otomatik görev oluşturma test bitkisi',
      maintenance: [], // Boş maintenance ile ekleniyor
      category: 'test'
    });

    // Otomatik görev oluşturma mantığı
    const defaultWateringFreq = settings.maintenance.defaultWateringFrequency || 7;
    const defaultFertilizingPeriod = settings.maintenance.defaultFertilizingPeriod || 30;
    const wateringSeasonStart = settings.maintenance.wateringSeasonStart || 3;
    const wateringSeasonEnd = settings.maintenance.wateringSeasonEnd || 10;

    const maintenanceArray = [];

    // Sulama görevleri
    for (let month = wateringSeasonStart; month <= wateringSeasonEnd; month++) {
      maintenanceArray.push({
        month: month,
        tasks: `${defaultWateringFreq} günde bir sulama`,
        completed: false
      });
    }

    // Gübreleme görevi
    maintenanceArray.push({
      month: 4,
      tasks: `${defaultFertilizingPeriod} günde bir gübreleme`,
      completed: false
    });

    testTree.maintenance = maintenanceArray;
    await testTree.save();

    console.log(`✓ Test bitkisi eklendi: ${maintenanceArray.length} otomatik görev oluşturuldu`);

    res.json({
      message: 'Otomatik görev oluşturma testi başarılı!',
      autoTaskCreation: true,
      testPlant: testTree,
      createdTasks: maintenanceArray.length,
      settings: {
        wateringFrequency: defaultWateringFreq,
        fertilizingPeriod: defaultFertilizingPeriod,
        wateringSeason: `${wateringSeasonStart}-${wateringSeasonEnd}`,
      }
    });
  } catch (err) {
    console.error('Test hatası:', err);
    res.status(500).json({ message: 'Test başarısız.', error: err.message });
  }
});

// Test endpoint - Hasat hatırlatmaları testi
app.post('/api/test/harvest-reminder', authMiddleware, async (req, res) => {
  try {
    console.log('\n🧪 Hasat hatırlatmaları testi başlatılıyor...');

    const admin = await Admin.findById(req.user.id);
    const settings = admin?.settings;

    if (!settings?.maintenance?.harvestReminders) {
      return res.json({
        message: 'Hasat hatırlatmaları kapalı. Ayarlar > Bakım Planlama bölümünden açabilirsiniz.',
        harvestReminders: false
      });
    }

    // Test sebze ekle
    const testVeg = new Vegetable({
      name: 'Test Domates (Hasat testi)',
      count: 5,
      notes: 'Hasat hatırlatması test sebzesi',
      maintenance: [],
      category: 'test'
    });

    const maintenanceArray = [];
    const defaultWateringFreq = settings.maintenance.defaultWateringFrequency || 7;
    const wateringSeasonStart = settings.maintenance.wateringSeasonStart || 3;
    const wateringSeasonEnd = settings.maintenance.wateringSeasonEnd || 10;

    // Sulama görevleri
    for (let month = wateringSeasonStart; month <= wateringSeasonEnd; month++) {
      maintenanceArray.push({
        month: month,
        tasks: `${defaultWateringFreq} günde bir sulama`,
        completed: false
      });
    }

    // Hasat görevleri ekle
    const harvestMonths = [6, 7, 8, 9]; // Haziran-Eylül
    harvestMonths.forEach(month => {
      maintenanceArray.push({
        month: month,
        tasks: 'Hasat kontrolü (olgunlaşma durumu)',
        completed: false
      });
    });

    testVeg.maintenance = maintenanceArray;
    await testVeg.save();

    const harvestTaskCount = maintenanceArray.filter(t =>
      t.tasks.toLowerCase().includes('hasat')
    ).length;

    console.log(`✓ Test sebze eklendi: ${harvestTaskCount} hasat görevi oluşturuldu`);

    res.json({
      message: 'Hasat hatırlatmaları testi başarılı!',
      harvestReminders: true,
      testPlant: testVeg,
      totalTasks: maintenanceArray.length,
      harvestTasks: harvestTaskCount,
      harvestMonths: harvestMonths
    });
  } catch (err) {
    console.error('Test hatası:', err);
    res.status(500).json({ message: 'Test başarısız.', error: err.message });
  }
});


/* -------------------- DB & Server Start -------------------- */

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB bağlantısı başarılı.');

    const username = process.env.ADMIN_USER || 'admin';
    const password = process.env.ADMIN_PASS || 'admin123';

    let admin = await Admin.findOne({ username });
    if (!admin) {
      const passwordHash = await bcrypt.hash(password, 10);
      admin = new Admin({ username, passwordHash });
      await admin.save();
      console.log('Varsayılan admin oluşturuldu:');
      console.log(`  Kullanıcı: ${username}`);
      console.log(`  Şifre   : ${password}`);
    }

    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor.`);
    });

    // Cron job'ları başlat
    setupCronJobs();
  } catch (err) {
    console.error('Başlatma hatası:', err);
    process.exit(1);
  }
}

/* -------------------- CRON JOB'LAR (Otomatik Bakım Hatırlatmaları) -------------------- */

// Tamamlanan ve tamamlanmayan görevleri raporlama fonksiyonu
async function sendMonthlyMaintenanceReport() {
  try {
    console.log('📅 Aylık bakım raporu gönderiliyor...');

    const currentMonth = new Date().getMonth() + 1;
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    // Tüm kullanıcıları çek
    const admins = await Admin.find().lean();

    for (const admin of admins) {
      try {
        // Ağaçları çek
        const trees = await Tree.find().lean();
        const vegetables = await Vegetable.find().lean();

        // Bu ay için görevleri ayır
        const treeCompleted = [];
        const treeIncomplete = [];
        const vegCompleted = [];
        const vegIncomplete = [];

        // Ağaçları kontrol et
        trees.forEach(tree => {
          const maintenance = tree.maintenance?.find(m => m.month === currentMonth);
          if (maintenance) {
            const item = `${tree.name}: ${maintenance.tasks}`;
            if (maintenance.completed) {
              treeCompleted.push(item);
            } else {
              treeIncomplete.push(item);
            }
          }
        });

        // Sebzeleri kontrol et
        vegetables.forEach(veg => {
          const maintenance = veg.maintenance?.find(m => m.month === currentMonth);
          if (maintenance) {
            const item = `${veg.name}: ${maintenance.tasks}`;
            if (maintenance.completed) {
              vegCompleted.push(item);
            } else {
              vegIncomplete.push(item);
            }
          }
        });

        // Raporu oluştur
        const totalCompleted = treeCompleted.length + vegCompleted.length;
        const totalIncomplete = treeIncomplete.length + vegIncomplete.length;
        const totalTasks = totalCompleted + totalIncomplete;

        if (totalTasks === 0) {
          console.log(`  ℹ️ ${admin.username} için ${monthNames[currentMonth - 1]} ayında görev yok.`);
          continue;
        }

        // E-posta içeriği
        let emailHtml = `
          <h2>🌳 ${monthNames[currentMonth - 1]} Ayı Bakım Raporu</h2>
          <p>Merhaba,</p>
          <p>${monthNames[currentMonth - 1]} ayına ait bakım görevlerinizin özeti:</p>

          <h3>📊 Özet</h3>
          <ul>
            <li><strong>Toplam Görev:</strong> ${totalTasks}</li>
            <li><strong style="color: green;">✅ Tamamlanan:</strong> ${totalCompleted}</li>
            <li><strong style="color: orange;">⏳ Tamamlanmayan:</strong> ${totalIncomplete}</li>
            <li><strong>Tamamlanma Oranı:</strong> ${totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0}%</li>
          </ul>
        `;

        // Tamamlanan Ağaçlar
        if (treeCompleted.length > 0) {
          emailHtml += `
            <h3 style="color: green;">✅ Tamamlanan Ağaç Bakımları (${treeCompleted.length})</h3>
            <ul>
              ${treeCompleted.map(item => `<li>${item}</li>`).join('')}
            </ul>
          `;
        }

        // Tamamlanmayan Ağaçlar
        if (treeIncomplete.length > 0) {
          emailHtml += `
            <h3 style="color: orange;">⏳ Tamamlanmayan Ağaç Bakımları (${treeIncomplete.length})</h3>
            <ul>
              ${treeIncomplete.map(item => `<li>${item}</li>`).join('')}
            </ul>
          `;
        }

        // Tamamlanan Sebzeler
        if (vegCompleted.length > 0) {
          emailHtml += `
            <h3 style="color: green;">✅ Tamamlanan Sebze Bakımları (${vegCompleted.length})</h3>
            <ul>
              ${vegCompleted.map(item => `<li>${item}</li>`).join('')}
            </ul>
          `;
        }

        // Tamamlanmayan Sebzeler
        if (vegIncomplete.length > 0) {
          emailHtml += `
            <h3 style="color: orange;">⏳ Tamamlanmayan Sebze Bakımları (${vegIncomplete.length})</h3>
            <ul>
              ${vegIncomplete.map(item => `<li>${item}</li>`).join('')}
            </ul>
          `;
        }

        emailHtml += `
          <hr>
          <p style="color: #666; font-size: 0.9em;">
            Bu rapor otomatik olarak gönderilmiştir.<br>
            🤖 Akıllı Bahçe Yönetim Sistemi
          </p>
        `;

        // E-posta gönder
        if (transporter) {
          const toEmail = process.env.EMAIL_TO || 'singlewolf18@gmail.com';
          await transporter.sendMail({
            from: process.env.EMAIL_USER || 'singlewolf18@gmail.com',
            to: toEmail,
            subject: `🌳 ${monthNames[currentMonth - 1]} Ayı Bakım Raporu - ${totalCompleted}/${totalTasks} Tamamlandı`,
            html: emailHtml
          });
          console.log(`  ✅ E-posta gönderildi: ${toEmail}`);
        }

        // Push bildirimi gönder
        const subs = await PushSubscription.find({ user: admin._id }).lean();
        if (subs.length > 0 && VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
          const pushPayload = JSON.stringify({
            title: `🌳 ${monthNames[currentMonth - 1]} Bakım Raporu`,
            body: `✅ ${totalCompleted} tamamlandı, ⏳ ${totalIncomplete} bekliyor (Toplam: ${totalTasks})`,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            data: { url: '/reminders' }
          });

          let pushSuccess = 0;
          for (const sub of subs) {
            try {
              await webpush.sendNotification(sub.subscription, pushPayload);
              pushSuccess++;
            } catch (err) {
              console.error(`  ⚠️ Push gönderim hatası (${sub.browser}):`, err.message);
            }
          }
          console.log(`  📱 Push bildirimi gönderildi: ${pushSuccess}/${subs.length} cihaz`);
        }

      } catch (err) {
        console.error(`  ❌ ${admin.username} için rapor gönderilemedi:`, err.message);
      }
    }

    console.log('✅ Aylık bakım raporu gönderimi tamamlandı.');
  } catch (err) {
    console.error('❌ Aylık bakım raporu hatası:', err);
  }
}

// Günlük hatırlatma gönderme fonksiyonu
async function sendDailyReminders() {
  try {
    console.log('\n⏰ Günlük hatırlatmalar kontrol ediliyor...');

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Tüm kullanıcıları al
    const users = await Admin.find({});

    for (const user of users) {
      const reminderTime = user.settings?.notifications?.reminderTime || '08:00';
      const [reminderHour, reminderMinute] = reminderTime.split(':').map(Number);

      // Kullanıcının hatırlatma saati şu anki saatle eşleşiyor mu? (±10 dakika tolerans)
      const timeDiff = Math.abs((currentHour * 60 + currentMinute) - (reminderHour * 60 + reminderMinute));

      if (timeDiff <= 10) {
        // Bugün bu kullanıcıya hatırlatma gönderilmiş mi kontrol et
        const existingLog = await DailyReminderLog.findOne({
          user: user._id,
          date: todayDate
        });

        if (existingLog) {
          console.log(`  ⏭️  ${user.username} için bugün zaten hatırlatma gönderilmiş, atlanıyor`);
          continue;
        }

        console.log(`  📬 ${user.username} için hatırlatma gönderiliyor (${reminderTime})`);

        // Bu ay için bakım görevlerini al
        const currentMonth = now.getMonth() + 1;
        // Sistemde user field'ı yok, tüm ağaç ve sebzeleri al
        const trees = await Tree.find({});
        const vegetables = await Vegetable.find({});

        let taskCount = 0;

        // Ağaçlar için bu ayki görevleri say
        for (const tree of trees) {
          const monthTasks = tree.maintenance?.filter(m => m.month === currentMonth && !m.completed);
          taskCount += monthTasks?.length || 0;
        }

        // Sebzeler için bu ayki görevleri say
        let harvestTaskCount = 0;
        for (const veg of vegetables) {
          const monthTasks = veg.maintenance?.filter(m => m.month === currentMonth && !m.completed);
          taskCount += monthTasks?.length || 0;

          // Hasat görevlerini ayrıca say (harvestReminders ayarı için)
          if (user.settings?.maintenance?.harvestReminders) {
            const harvestTasks = monthTasks?.filter(t =>
              t.tasks && (t.tasks.toLowerCase().includes('hasat') || t.tasks.toLowerCase().includes('topla'))
            );
            harvestTaskCount += harvestTasks?.length || 0;
          }
        }

        if (taskCount > 0) {
          let notificationSent = false;

          // Push bildirimi gönder
          if (user.settings?.notifications?.pushEnabled) {
            try {
              const subs = await PushSubscription.find({ user: user._id });
              // Bildirim mesajını hazırla
              let notificationBody = `${taskCount} adet tamamlanmamış bakım göreviniz var!`;
              if (harvestTaskCount > 0) {
                notificationBody += ` (${harvestTaskCount} hasat görevi)`;
              }

              const payload = JSON.stringify({
                title: '🌱 Günlük Bakım Hatırlatması',
                body: notificationBody,
                icon: '/icon-192x192.png',
                badge: '/badge-72x72.png',
                tag: 'daily-reminder',
                requireInteraction: false,
                data: { url: '/' }
              });

              for (const sub of subs) {
                try {
                  await webpush.sendNotification(sub.subscription, payload);
                  console.log(`    ✓ Push bildirimi gönderildi (${sub.browser})`);
                  notificationSent = true;
                } catch (err) {
                  if (err.statusCode === 410 || err.statusCode === 404) {
                    await PushSubscription.deleteOne({ _id: sub._id });
                  }
                }
              }
            } catch (err) {
              console.error(`    ✗ Push bildirimi hatası:`, err.message);
            }
          }

          // Email gönder
          if (user.settings?.notifications?.emailEnabled && user.email) {
            try {
              // Email içeriğini hazırla
              let emailContent = `<p>Bugün için <strong>${taskCount}</strong> adet tamamlanmamış bakım göreviniz var.</p>`;
              if (harvestTaskCount > 0) {
                emailContent += `<p><strong>${harvestTaskCount}</strong> adet hasat görevi bulunmaktadır. 🍅🥕🌽</p>`;
              }

              const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: '🌱 Günlük Bakım Hatırlatması',
                html: `
                  <h2>Merhaba ${user.username},</h2>
                  ${emailContent}
                  <p>Uygulamaya giriş yaparak görevlerinizi kontrol edebilirsiniz.</p>
                  <br>
                  <p>İyi çalışmalar!</p>
                  <p><em>Akıllı Bahçe Yönetim Sistemi</em></p>
                `
              };
              await transporter.sendMail(mailOptions);
              console.log(`    ✓ Email gönderildi (${user.email})`);
              notificationSent = true;
            } catch (err) {
              console.error(`    ✗ Email hatası:`, err.message);
            }
          }

          // Bildirim gönderildiyse log'a kaydet
          if (notificationSent) {
            try {
              await DailyReminderLog.create({
                user: user._id,
                date: todayDate
              });
              console.log(`    ✓ Hatırlatma kaydı oluşturuldu`);
            } catch (err) {
              // Duplicate key hatası (zaten var) - sorun değil
              if (err.code !== 11000) {
                console.error(`    ✗ Log kaydetme hatası:`, err.message);
              }
            }
          }
        } else {
          console.log(`    ℹ️  Tamamlanmamış görev yok, bildirim gönderilmedi`);
        }
      }
    }

    console.log('✓ Günlük hatırlatma kontrolü tamamlandı\n');
  } catch (err) {
    console.error('❌ Günlük hatırlatma hatası:', err);
  }
}

// Cron job'ları ayarla
function setupCronJobs() {
  // Her 10 dakikada bir günlük hatırlatmaları kontrol et
  cron.schedule('*/10 * * * *', () => {
    sendDailyReminders();
  }, {
    timezone: 'Europe/Istanbul'
  });

  // Her ayın 1'inde saat 08:00'de çalış
  cron.schedule('0 8 1 * *', () => {
    console.log('\n⏰ Cron tetiklendi: Ayın 1. günü - Bakım raporu gönderiliyor...');
    sendMonthlyMaintenanceReport();
  }, {
    timezone: 'Europe/Istanbul'
  });

  // Her ayın 15'inde saat 08:00'de çalış
  cron.schedule('0 8 15 * *', () => {
    console.log('\n⏰ Cron tetiklendi: Ayın 15. günü - Bakım raporu gönderiliyor...');
    sendMonthlyMaintenanceReport();
  }, {
    timezone: 'Europe/Istanbul'
  });

  console.log('⏰ Cron job\'lar başlatıldı:');
  console.log('   🔔 Her 10 dakikada - Günlük hatırlatma kontrolü');
  console.log('   📅 Her ayın 1. günü saat 08:00 - Bakım raporu');
  console.log('   📅 Her ayın 15. günü saat 08:00 - Bakım raporu');
}

/* -------------------- GPS Harita API Rotaları -------------------- */
const mapRoutes = require('./map-routes');

// Map routes için middleware - modelleri inject et
app.use('/api/map', authMiddleware, (req, res, next) => {
  req.models = { Tree, Vegetable, Garden, CustomLabel };
  next();
}, mapRoutes);

start();
