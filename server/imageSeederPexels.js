// imageSeederPexelsByName.js
'use strict';

const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// node-fetch v3 ESM olduğu için CJS'te bu şekilde kullanıyoruz
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// =========================
//  Config
// =========================

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/garden-db';
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');

const DEFAULT_TREE_IMAGE = '/uploads/noimage.jpg';
const DEFAULT_VEG_IMAGE = '/uploads/noimage.png';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Bir çalıştırmada işlenecek maksimum İSİM sayısı
// 0 => tüm isimler
const MAX_TREE_NAMES_PER_RUN = 0;
const MAX_VEG_NAMES_PER_RUN = 0;

// Pexels rate-limit'e takılmamak için her istek arası bekleme (ms)
const DELAY_BETWEEN_REQUESTS_MS = 5000; // 5 saniye

// Rate limit sonrası otomatik tekrar deneme
const MAX_RATE_LIMIT_RETRIES = 5;       // en fazla kaç kez tekrar denensin
const RATE_LIMIT_WAIT_MS = 10_000;      // her 429 sonrası ne kadar beklensin (1 dk)

// =========================
//  Schemas & Models
// =========================

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
    imageUrl: { type: String, default: DEFAULT_TREE_IMAGE },
    category: { type: String, default: 'genel' },
    maintenance: [maintenanceSchema]
  },
  { timestamps: true }
);

const vegetableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    count: { type: Number, default: 1 },
    notes: String,
    imageUrl: { type: String, default: DEFAULT_VEG_IMAGE },
    category: { type: String, default: 'genel' },
    maintenance: [maintenanceSchema]
  },
  { timestamps: true }
);

const Tree = mongoose.model('Tree', treeSchema);
const Vegetable = mongoose.model('Vegetable', vegetableSchema);

// =========================
//  Helpers
// =========================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Türkçe karakterleri temizle ve URL-safe yap
function sanitizeFilename(name) {
  const charMap = {
    ç: 'c',
    Ç: 'C',
    ğ: 'g',
    Ğ: 'G',
    ı: 'i',
    İ: 'I',
    ö: 'o',
    Ö: 'O',
    ş: 's',
    Ş: 'S',
    ü: 'u',
    Ü: 'U'
  };

  return (name || '')
    .split('')
    .map((char) => charMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// =========================
//  Keywords sözlüğü
// =========================

const KEYWORDS = {
  'Acı Biber': 'hot pepper,vegetable,spicy',
  'Ahududu': 'raspberry,fruit,berry',
  'Akçaağaç': 'maple,tree,autumn',
  'Alabaş': 'kohlrabi,vegetable,root',
  'Alıç': 'hawthorn,fruit,berry',
  'Altıntop': 'pomelo,fruit,citrus',
  'Antep Fıstığı': 'pistachio,tree,nut',
  'Armut': 'pear,tree,fruit',
  'Arpacık Soğan': 'shallot,vegetable,bulb',
  'Avokado': 'avocado,fruit,tree',
  'Ayva': 'quince,fruit,tree',
  'Badem': 'almond,tree,nut',
  'Bakla': 'broad bean,vegetable,legume',
  'Bal Kabağı': 'pumpkin,vegetable,orange',
  'Bamya': 'okra,vegetable,green',
  'Barbunya': 'cranberry bean,legume,bean',
  'Bektaşi Üzümü': 'gooseberry,fruit,berry',
  'Bergamot': 'bergamot,fruit,citrus',
  'Beyaz Dut': 'white mulberry,fruit,berry',
  'Beyaz Lahana': 'white cabbage,vegetable,leafy',
  'Bezelye': 'pea,vegetable,green',
  'Biber': 'pepper,vegetable,colorful',
  'Böğürtlen': 'blackberry,fruit,berry',
  'Börülce': 'black eyed pea,vegetable,legume',
  'Brokoli': 'broccoli,vegetable,green',
  'Brüksel Lahanası': 'brussels sprouts,vegetable,green',
  'Ceviz': 'walnut,tree,nut',
  'Çam': 'pine,tree,forest',
  'Çarliston Biber': 'long sweet pepper,vegetable',
  'Çin Lahanası': 'chinese cabbage,vegetable,leafy',
  'Dereotu': 'dill,herb,green',
  'Domates': 'tomato,vegetable,red',
  'Elma': 'apple,tree,fruit',
  'Enginar': 'artichoke,vegetable,green',
  'Erik': 'plum,tree,fruit',
  'Fasulye': 'green bean,vegetable,legume',
  'Fındık': 'hazelnut,tree,nut',
  'Frenk Soğanı': 'chives,herb,green',
  'Gavur Narı': 'heirloom tomato,vegetable,red',
  'Göbek Marul': 'iceberg lettuce,vegetable,leafy',
  'Greyfurt': 'grapefruit,fruit,citrus',
  'Guava': 'guava,fruit,tropical',
  'Havuç': 'carrot,vegetable,root',
  'Ihlamur': 'linden,tree,flower',
  'Ispanak': 'spinach,vegetable,green',
  'İncir': 'fig,fruit,tree',
  'Japon Gülü (Sakura)': 'sakura,cherry blossom,tree',
  'Kabak': 'zucchini,vegetable,green',
  'Kabak (Balkabağı)': 'pumpkin,vegetable,orange',
  'Kan Portakalı': 'blood orange,fruit,citrus',
  'Kapya Biber': 'red sweet pepper,vegetable',
  'Kara Dut': 'black mulberry,fruit,berry',
  'Kara Lahana': 'collard greens,vegetable,leafy',
  'Karambola': 'starfruit,fruit,tropical',
  'Karayemiş': 'cherry laurel,fruit,berry',
  'Karnabahar': 'cauliflower,vegetable,white',
  'Karpuz': 'watermelon,fruit,slice',
  'Kavun': 'melon,fruit,yellow',
  'Kayısı': 'apricot,tree,fruit',
  'Keçiboynuzu': 'carob,tree,fruit',
  'Kereviz (Kök)': 'celeriac,root celery,vegetable',
  'Kereviz (Sap)': 'celery,stalk,vegetable',
  'Kestane': 'chestnut,tree,nut',
  'Kırmızı Lahana': 'red cabbage,vegetable,leafy',
  'Kıvırcık Marul': 'leaf lettuce,vegetable,green',
  'Kızılcık': 'cornelian cherry,fruit,berry',
  'Kiraz': 'cherry,tree,fruit',
  'Kumkuat': 'kumquat,fruit,citrus',
  'Kuru Soğan': 'onion,vegetable,bulb',
  'Kuşkonmaz': 'asparagus,vegetable,green',
  'Kuzukulağı': 'sorrel,herb,green',
  'Ladin': 'spruce,tree,forest',
  'Lahana': 'cabbage,vegetable,leafy',
  'Liçi': 'lychee,fruit,tropical',
  'Limon': 'lemon,fruit,citrus',
  'Mandalina': 'tangerine,fruit,citrus',
  'Mango': 'mango,fruit,tropical',
  'Marul': 'lettuce,vegetable,leafy',
  'Maydanoz': 'parsley,herb,green',
  'Mercimek': 'lentil,legume,grain',
  'Meşe': 'oak,tree,forest',
  'Muşmula': 'medlar,fruit,autumn',
  'Muz': 'banana,fruit,yellow',
  'Nane': 'mint,herb,green',
  'Napolyon Kirazı': 'napoleon cherry,fruit,tree',
  'Nar': 'pomegranate,fruit,red',
  'Nektarin': 'nectarine,fruit,tree',
  'Nohut': 'chickpea,legume,grain',
  'Pancar': 'beetroot,vegetable,root',
  'Papaya': 'papaya,fruit,tropical',
  'Patates': 'potato,vegetable,root',
  'Patlıcan': 'eggplant,vegetable,purple',
  'Pazı': 'chard,vegetable,green',
  'Pekan Cevizi': 'pecan,tree,nut',
  'Pırasa': 'leek,vegetable,green',
  'Pitaya': 'dragon fruit,fruit,tropical',
  'Portakal': 'orange,fruit,citrus',
  'Rambutan': 'rambutan,fruit,tropical',
  'Ravent': 'rhubarb,vegetable,stalk',
  'Rezene': 'fennel,vegetable,bulb',
  'Roka': 'arugula,rocket,salad',
  'Sakız Ağacı': 'mastic tree,tree,mediterranean',
  'Salatalık': 'cucumber,vegetable,green',
  'Salsifi': 'salsify,vegetable,root',
  'Sarımsak': 'garlic,vegetable,bulb',
  'Sedir': 'cedar,tree,forest',
  'Semizotu': 'purslane,vegetable,green',
  'Servi': 'cypress,tree,ornamental',
  'Sivri Biber': 'green chili pepper,vegetable,spicy',
  'Soğan': 'onion,vegetable,bulb',
  'Spagetti Kabağı': 'spaghetti squash,vegetable,orange',
  'Sumak': 'sumac,spice,red',
  'Şalgam': 'turnip,vegetable,root',
  'Şeftali': 'peach,fruit,tree',
  'Tatlı Patates': 'sweet potato,vegetable,root',
  'Tere': 'garden cress,herb,green',
  'Trabzon Hurması': 'persimmon,fruit,orange',
  'Turp': 'radish,vegetable,root',
  'Turunç': 'bitter orange,fruit,citrus',
  'Üzüm Asması': 'grape vine,fruit,cluster',
  'Vişne': 'sour cherry,fruit,tree',
  'Yaban Mersini': 'blueberry,fruit,berry',
  'Yabani Elma': 'wild apple,tree,fruit',
  'Yenidünya': 'loquat,fruit,tree',
  'Yer Elması': 'jerusalem artichoke,vegetable,root',
  'Yeşil Soğan': 'spring onion,vegetable,green',
  'Zeytin': 'olive,tree,mediterranean',
};

// Bitki adını İngilizce anahtar kelimelere çevir
function getSearchKeyword(name, category) {
  if (!name) return '';

  // 1) tam isim
  if (KEYWORDS[name]) return KEYWORDS[name];

  // 2) "Bal Kabağı (Kışlık)" gibi parantezli isimler için
  const base = name.split('(')[0].trim();
  if (KEYWORDS[base]) return KEYWORDS[base];

  // 3) fallback: küçük harf Türkçe isim
  return base.toLowerCase();
}

async function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

// =========================
//  HTTP üzerinden dosya indirme
// =========================

function downloadImage(url, filepath, redirectCount = 0, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirectCount > maxRedirects) {
      return reject(new Error(`Too many redirects for URL: ${url}`));
    }

    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(
      url,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      },
      (response) => {
        // Redirect
        if (response.statusCode === 301 || response.statusCode === 302) {
          const location = response.headers.location;
          if (!location) {
            return reject(new Error(`Redirect with no location header for URL: ${url}`));
          }
          return downloadImage(location, filepath, redirectCount + 1, maxRedirects)
            .then(resolve)
            .catch(reject);
        }

        if (response.statusCode !== 200) {
          return reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        }

        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filepath);
        });

        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      }
    );

    // Timeout
    request.setTimeout(30000, () => {
      request.destroy(new Error('Request timeout'));
    });

    request.on('error', (err) => {
      reject(err);
    });
  });
}

// =========================
//  Pexels entegrasyonu
// =========================

async function getImageUrlFromPexels(query) {
  if (!PEXELS_API_KEY) {
    throw new Error('PEXELS_API_KEY tanımlı değil (.env dosyanı kontrol et)');
  }

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query
  )}&per_page=1&orientation=landscape`;

  const res = await fetch(url, {
    headers: {
      Authorization: PEXELS_API_KEY
    }
  });

  if (res.status === 429) {
    // Rate limit aşıldı
    throw new Error('PEXELS_RATE_LIMIT');
  }

  if (!res.ok) {
    throw new Error(`Pexels API hata: HTTP ${res.status}`);
  }

  const data = await res.json();

  if (!data.photos || data.photos.length === 0) {
    throw new Error(`Pexels sonuç bulamadı: "${query}"`);
  }

  const photo = data.photos[0];
  return photo.src.large || photo.src.medium || photo.src.original;
}

// =========================
//  Ağaç İSİMLERİ bazında işlem (imageUrl'e bakmadan)
// =========================

async function processTreeNames() {
  console.log('🌳 AĞAÇ İSİMLERİ İÇİN GÖRSELLER İNDİRİLİYOR (Pexels)...\n');

  // imageUrl durumuna bakmadan TÜM isimleri al
  let names = await Tree.distinct('name');
  console.log(`   📋 DB'de ${names.length} farklı ağaç ismi var.`);

  if (MAX_TREE_NAMES_PER_RUN > 0) {
    names = names.slice(0, MAX_TREE_NAMES_PER_RUN);
  }

  console.log(`   🎯 Bu çalıştırmada işlenecek ağaç isim sayısı: ${names.length}\n`);

  let success = 0;
  let fail = 0;
  let totalUpdated = 0;

  for (const name of names) {
    const filenameBase = sanitizeFilename(name) || 'tree';
    const filepath = path.join(UPLOADS_DIR, `${filenameBase}.jpg`);
    const relativePath = `/uploads/${filenameBase}.jpg`;

    const keyword = getSearchKeyword(name);
    const tags = (keyword || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const mainKeyword = tags[0] || name || 'fruit';

    let typeWord = 'fruit';
    if (tags.includes('nut')) typeWord = 'nuts';
    if (!tags.includes('fruit') && !tags.includes('nut')) typeWord = 'tree';

    const queryText = `${mainKeyword} ${typeWord}`;

    try {
      if (fs.existsSync(filepath)) {
        console.log(
          `   ⏭️  "${name}" için dosya zaten var, yine de DB güncellenecek (${relativePath}).`
        );
      } else {
        console.log(`   🔎 "${name}" için Pexels'te aranıyor: "${queryText}"`);
        const imageUrl = await getImageUrlFromPexels(queryText);

        console.log(`   📥 "${name}" indiriliyor...`);
        await downloadImage(imageUrl, filepath);

        await sleep(DELAY_BETWEEN_REQUESTS_MS);
      }

      const result = await Tree.updateMany(
        { name },
        { $set: { imageUrl: relativePath } }
      );

      console.log(
        `   ✅ "${name}" için görsel ayarlandı. Güncellenen kayıt sayısı: ${result.modifiedCount}`
      );

      success++;
      totalUpdated += result.modifiedCount;
    } catch (err) {
      if (err.message === 'PEXELS_RATE_LIMIT') {
        console.log(
          '🚫 Pexels rate limit aşıldı, ağaç isimleri için işlem erken durduruldu.'
        );
        throw err;
      }

      console.log(`   ❌ "${name}" için işlem başarısız: ${err.message}`);
      fail++;
    }
  }

  console.log(
    `\n🌳 Ağaç İsimleri Özeti: ${success} isim başarılı, ${fail} isim başarısız, toplam güncellenen kayıt: ${totalUpdated}\n`
  );
  return { successNames: success, failNames: fail, totalUpdated };
}

// =========================
//  Sebze İSİMLERİ bazında işlem (imageUrl'e bakmadan)
// =========================

async function processVegNames() {
  console.log('🥬 SEBZE İSİMLERİ İÇİN GÖRSELLER İNDİRİLİYOR (Pexels)...\n');

  // imageUrl durumuna bakmadan TÜM isimleri al
  let names = await Vegetable.distinct('name');
  console.log(`   📋 DB'de ${names.length} farklı sebze ismi var.`);

  if (MAX_VEG_NAMES_PER_RUN > 0) {
    names = names.slice(0, MAX_VEG_NAMES_PER_RUN);
  }

  console.log(`   🎯 Bu çalıştırmada işlenecek sebze isim sayısı: ${names.length}\n`);

  let success = 0;
  let fail = 0;
  let totalUpdated = 0;

  for (const name of names) {
    const filenameBase = 'veg-' + (sanitizeFilename(name) || 'veg');
    const filepath = path.join(UPLOADS_DIR, `${filenameBase}.jpg`);
    const relativePath = `/uploads/${filenameBase}.jpg`;

    const keyword = getSearchKeyword(name);
    const tags = (keyword || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const mainKeyword = tags[0] || name || 'vegetable';

    const queryText = `${mainKeyword} vegetable`;

    try {
      if (fs.existsSync(filepath)) {
        console.log(
          `   ⏭️  "${name}" için dosya zaten var, yine de DB güncellenecek (${relativePath}).`
        );
      } else {
        console.log(`   🔎 "${name}" için Pexels'te aranıyor: "${queryText}"`);
        const imageUrl = await getImageUrlFromPexels(queryText);

        console.log(`   📥 "${name}" indiriliyor...`);
        await downloadImage(imageUrl, filepath);

        await sleep(DELAY_BETWEEN_REQUESTS_MS);
      }

      const result = await Vegetable.updateMany(
        { name },
        { $set: { imageUrl: relativePath } }
      );

      console.log(
        `   ✅ "${name}" için görsel ayarlandı. Güncellenen kayıt sayısı: ${result.modifiedCount}`
      );

      success++;
      totalUpdated += result.modifiedCount;
    } catch (err) {
      if (err.message === 'PEXELS_RATE_LIMIT') {
        console.log(
          '🚫 Pexels rate limit aşıldı, sebze isimleri için işlem erken durduruldu.'
        );
        throw err;
      }

      console.log(`   ❌ "${name}" için işlem başarısız: ${err.message}`);
      fail++;
    }
  }

  console.log(
    `\n🥬 Sebze İsimleri Özeti: ${success} isim başarılı, ${fail} isim başarısız, toplam güncellenen kayıt: ${totalUpdated}\n`
  );
  return { successNames: success, failNames: fail, totalUpdated };
}

// =========================
//  Rate limit aware wrapper
// =========================

async function runWithRateLimitRetry(taskFn, label) {
  let attempt = 0;
  while (true) {
    try {
      return await taskFn();
    } catch (err) {
      if (err.message === 'PEXELS_RATE_LIMIT' && attempt < MAX_RATE_LIMIT_RETRIES) {
        attempt++;
        console.log(
          `⏳ Pexels rate limit (${label}). ${RATE_LIMIT_WAIT_MS / 1000} sn bekleniyor... (deneme ${attempt}/${MAX_RATE_LIMIT_RETRIES})`
        );
        await sleep(RATE_LIMIT_WAIT_MS);
        continue; // aynı task'i tekrar dene
      }
      // başka hata ya da retry limit aşıldı
      throw err;
    }
  }
}

// =========================
//  Ana fonksiyon
// =========================

async function downloadAllImages() {
  try {
    console.log("🌐 MongoDB'ye bağlanılıyor...\n");
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Bağlantı başarılı\n');

    if (!PEXELS_API_KEY) {
      console.log(
        '⚠️  Uyarı: PEXELS_API_KEY tanımlı değil, script çalışırken hata verecek. Lütfen .env dosyanı kontrol et.'
      );
    }

    await ensureUploadsDir();

    const totalTrees = await Tree.countDocuments();
    const totalVeg = await Vegetable.countDocuments();
    console.log(`🌳 DB'de toplam tree sayısı: ${totalTrees}`);
    console.log(`🥬 DB'de toplam vegetable sayısı: ${totalVeg}\n`);

    const treeResult = await runWithRateLimitRetry(processTreeNames, 'ağaç isimleri');
    const vegResult = await runWithRateLimitRetry(processVegNames, 'sebze isimleri');

    console.log('📊 GENEL ÖZET (İsim bazında):');
    console.log(
      `   🌳 Ağaç isimleri - başarılı: ${treeResult.successNames}, başarısız: ${treeResult.failNames}, güncellenen kayıt: ${treeResult.totalUpdated}`
    );
    console.log(
      `   🥬 Sebze isimleri - başarılı: ${vegResult.successNames}, başarısız: ${vegResult.failNames}, güncellenen kayıt: ${vegResult.totalUpdated}`
    );
    console.log(`   📁 Görseller klasörü: ${UPLOADS_DIR}\n`);

    console.log('✅ Görsel indirme işlemi (isim bazında) tamamlandı!\n');
  } catch (error) {
    console.error('❌ Hata:', error.message || error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('👋 MongoDB bağlantısı kapatıldı\n');
    }
  }
}

// Script'i çalıştır
downloadAllImages();
