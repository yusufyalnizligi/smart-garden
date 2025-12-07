import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import GardenMapTab from './GardenMapTab'; // 🗺️ Yeni Map Component

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);


// Environment-based configuration
// If on localhost (dev), use 5000. If on production (relative), use /api
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = process.env.REACT_APP_API_URL || (isLocal ? 'http://localhost:5000/api' : '/api');
const BASE_URL = process.env.REACT_APP_BASE_URL || window.location.origin;
const VAPID_PUBLIC_KEY = 'BO0KSV3iyt34vxggZvjqlE_AOENpuJU19ROPkxmQHuHxpxW4QCdDBSuvHkY9Vqqz8Xil-nCjDLYBecEnr3aN1Vk';
// -------------------- OTOMATİK BAKIM ÖNERİLERİ -------------------- //

const treeMaintenanceSuggestions = {
  genel: [
    'Genel kontrol, kurumuş dalları temizle, gövdeyi gözle kontrol et.',
    'Toprağı havalandır, kıştan kalan yaprakları temizle.',
    'İlkbahar gübresi uygula, zararlı kontrolü yap.',
    'Çiçeklenme dönemi takibi, gerekli ise hafif budama.',
    'Sulama düzenini ayarla, yabani otları temizle.',
    'Sulamayı artır, gövde ve dal kontrolü yap.',
    'Yoğun sıcaklarda sulamayı düzenli tut, malç kontrolü yap.',
    'Gerekirse ikinci gübreleme, hastalık belirtilerini kontrol et.',
    'Meyve/sezon sonu kontrolü, hafif budama planla.',
    'Sonbahar yaprak temizliği, toprak havalandırma.',
    'Kışa hazırlık; ana budama planı, koruyucu önlem kontrolü.',
    'Kış öncesi son genel kontrol, zararlı/yaralanma gözlemi.'
  ],
  meyve: [
    'Kış budaması, kuru ve zayıf dalların alınması.',
    'Tomurcuk kontrolü, kış sonrası genel kontrol.',
    'İlkbahar gübresi, zararlı ve hastalık takibi.',
    'Çiçeklenme takibi, gerekirse çiçek seyreltme.',
    'Meyve bağlama kontrolü, sulama düzeni ayarı.',
    'Meyve büyüme dönemi; gübre ve sulamayı düzenle.',
    'Aşırı yükte meyve seyreltme, dal kırığı kontrolü.',
    'Hastalık/zararlı için ilaçlama (gerekiyorsa).',
    'Hasat hazırlığı, dalların yük durumunu kontrol et.',
    'Hasat sonrası budama planı, toprak düzenlemesi.',
    'Sonbahar gübresi, yaprak dökümü sonrası kontrol.',
    'Kış koruması, gövde çatlak kontrolü.'
  ],
  sus: [
    'Biçim budaması, kuru dalların alınması.',
    'Toprak yüzeyi ve çevre düzeni kontrolü.',
    'Gerekirse yavaş salınımlı gübre uygulaması.',
    'Biçim verme, fazla uzayan sürgünleri kısaltma.',
    'Sulama düzenini yaz aylarına göre ayarla.',
    'Toprak nemini kontrol et, malç ekle.',
    'Yoğun sıcaklarda gölgeleme/sulama kontrolü.',
    'Gerekirse ikinci biçim budaması.',
    'Genel form kontrolü, zararlı takibi.',
    'Kuruyan yaprak/dalları temizle.',
    'Kış öncesi hafif budama.',
    'Genel kış kontrolü.'
  ],
  'igne-yaprakli': [
    'Kuru/bozuk dalları temizle.',
    'Genel form kontrolü, rüzgar zararı var mı bak.',
    'İlkbahar gübresi (iğne yapraklı uyumlu).',
    'Hafif form budaması.',
    'Toprak nemini ve malç durumunu kontrol et.',
    'Sıcak dönemde sulamayı artır, gövdeyi gözle.',
    'Reçine akıntısı/hastalık belirtisi var mı bak.',
    'Gerekirse iğne yapraklılara uygun ilaçlama.',
    'Sonbahar rüzgarlarına hazırlık, dal kırığı kontrolü.',
    'Kök boğazı ve gövde çevresini temizle.',
    'Kışa hazırlık, gerekirse destek kazıkları gözden geçir.',
    'Kış ortası genel kontrol.'
  ],
  diger: [
    'Genel kontrol, kuru dal temizliği.',
    'Toprak ve çevre düzenlemesi.',
    'İlkbahar için hafif gübreleme.',
    'Büyüme şekline göre hafif budama.',
    'Sulama düzenini ayarla.',
    'Toprak nemini ve otlanmayı kontrol et.',
    'Sıcak dönemde gövde ve yaprak durumunu gözle.',
    'Gerekirse destek ve bağları düzelt.',
    'Sonbahar öncesi genel kontrol.',
    'Yaprak/ürün dökümü sonrası temizlik.',
    'Kışa hazırlık, koruma önlemleri.',
    'Kış dönemi genel gözlem.'
  ]
};

const vegetableMaintenanceSuggestions = {
  genel: [
    'Toprak hazırlığı, gerekiyorsa yanmış çiftlik gübresi ekle.',
    'Ekim/dikim planı yap, tohum/ fide hazırlığı.',
    'Ekim/dikim zamanı; can suyu ver.',
    'Fideleri kontrol et, seyreltme gerekiyorsa yap.',
    'Yabancı ot temizliği, hafif üst gübreleme.',
    'Düzenli sulama, hastalık/zararlı kontrolü.',
    'Yoğun büyüme dönemi; destek, herek vb. ekle.',
    'Hasat başlangıcı, sulamayı dengele.',
    'Devam eden hasat, bitki yenileme için plan yap.',
    'Sezon sonu toprak temizliği.',
    'Toprak dinlendirme, yeşil gübreleme imkanı varsa planla.',
    'Gelecek sezon için ürün rotasyonu planla.'
  ],
  yaprakli: [
    'Toprağı hazırlayıp organik madde ekle.',
    'Marul/ıspanak vb. için ekim/dikim yap.',
    'Can suyu ve ilk yabani ot temizliği.',
    'Sık ekilen yerlerde seyreltme.',
    'Yaprak gelişimini takip et, üst gübre uygula.',
    'Düzenli sulama, mildiyö vb. hastalıklara dikkat.',
    'Hasat başlangıcı (alt yapraklardan).',
    'Sürekli hasat, bozulmuş yaprakları temizle.',
    'Yatakları yavaş yavaş boşalt, yeni ürün planla.',
    'Toprak dinlendirme veya yeni ürün ekimi.',
    'Organik madde takviyesi.',
    'Gelecek sezon için alan planlaması.'
  ],
  kök: [
    'Kök sebzeler için toprak derinlemesine işlenir.',
    'Tohum ekimi (havuç, pancar, turp vb.).',
    'Çıkış sonrası seyreltme.',
    'Düzenli sulama, kabuk bağlamayı önle.',
    'Yabani ot kontrolü.',
    'Gerekirse hafif gübreleme.',
    'Kök gelişimini takip et, toprak çatlaklarını kapat.',
    'Erken hasat edilebilenleri al.',
    'Ana hasat dönemi.',
    'Toprak temizliği, kök artıkları toplanır.',
    'Toprak dinlendirme.',
    'Gelecek sezon kök ekimi için alanı değiştirme planı.'
  ],
  meyve: [
    'Domates/biber vb. için fide/ tohum hazırlığı.',
    'Fideleri serada/evde büyüt.',
    'Dikim zamanı yaklaşırken toprak hazırlığı.',
    'Fideleri tarlaya/ bahçeye dik, can suyu ver.',
    'Herek/çit desteği, dip boğaz doldurma.',
    'Çiçeklenme ve meyve bağlama takibi.',
    'Üst gübreleme, düzenli sulama.',
    'Yoğun meyve döneminde hasada başla.',
    'Sürekli hasat, bozuk meyveleri uzaklaştır.',
    'Sezon sonu, yorgun bitkileri sök.',
    'Toprak dinlendirme, organik madde ekle.',
    'Gelecek sezon ekim planlaması.'
  ],
  baklagil: [
    'Toprağı hafifçe hazırlayıp çok derin sürme.',
    'Fasulye/bezelye vb. ekimi.',
    'Çıkış sonrası destek/ çit sistemi kur.',
    'Yabancı ot kontrolü.',
    'Çiçeklenme dönemi, sulamayı düzenle.',
    'Bakla, fasulye vb. ilk hasat.',
    'Düzenli hasat, bitki üzerinde olgunlaşmış ürün bırakma.',
    'Sezon sonuna doğru bitkileri sök.',
    'Kökleri mümkünse toprakta bırakarak azot katkısından yararlan.',
    'Toprak dinlendirme.',
    'Organik madde ekle.',
    'Yeni sezon için farklı ürün rotasyonu planla.'
  ],
  diger: [
    'Toprak ve yer seçimini gözden geçir.',
    'Ekim/dikim zamanı ayarla.',
    'İlk sulama ve çıkış kontrolü.',
    'Yabani ot, zararlı kontrolü.',
    'Gerekirse üst gübreleme.',
    'Düzenli sulama.',
    'Gelişimi yavaş olan bitkileri kontrol et.',
    'Hasat başlangıcı.',
    'Devam eden hasat, kuruyan bitkileri uzaklaştır.',
    'Toprak temizliği.',
    'Organik madde/kompost ekle.',
    'Gelecek sezon planlaması.'
  ]
};

function getTreeSuggestions(category) {
  return treeMaintenanceSuggestions[category] || treeMaintenanceSuggestions.genel;
}

function getVegetableSuggestions(category) {
  return (
    vegetableMaintenanceSuggestions[category] ||
    vegetableMaintenanceSuggestions.genel
  );
}

const monthNames = [
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


const classifyMaintenanceTask = (text = '') => {
  const t = text.toLowerCase();

  if (t.match(/budama/)) {
    return { key: 'budama', label: 'Budama', className: 'maintenance-tag-budama' };
  }
  if (t.match(/ilaç|ilac/)) {
    return { key: 'ilac', label: 'İlaçlama', className: 'maintenance-tag-ilac' };
  }
  if (t.match(/gübre|gubre/)) {
    return { key: 'gubre', label: 'Gübreleme', className: 'maintenance-tag-gubre' };
  }
  if (t.match(/sula|sulama|su ver/)) {
    return { key: 'sulama', label: 'Sulama', className: 'maintenance-tag-sulama' };
  }
  if (t.match(/hasat|topla/)) {
    return { key: 'hasat', label: 'Hasat', className: 'maintenance-tag-hasat' };
  }

  return { key: 'genel', label: 'Genel Bakım', className: 'maintenance-tag-genel' };
};


const SETTINGS_KEY = 'sg_settings';

const DEFAULT_SETTINGS = {
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    weeklyDigest: false,
    criticalTaskAlerts: true,
    reminderTime: '08:00'
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
  reminders: {
    treeOnlyImportantDefault: false,
    vegOnlyImportantDefault: false,
    autoOpenSuggestions: true
  },
  appearance: {
    theme: 'light',
    colorScheme: 'green',
    fontSize: 'medium',
    viewMode: 'card',
    chartsDefaultOpen: true
  },
  maintenance: {
    defaultWateringFrequency: 7,
    defaultFertilizingPeriod: 30,
    autoTaskCreation: true,
    harvestReminders: true,
    wateringSeasonStart: 3,  // Mart
    wateringSeasonEnd: 10,   // Ekim
    fertilizingSeasonStart: 3, // Mart
    fertilizingSeasonEnd: 9   // Eylül
  },
  profile: {
    gardenName: '',
    gardenSize: 0,
    experienceLevel: 'beginner',
    siteTitle: 'Akıllı Bahçe',
    siteDescription: 'Bahçenizi dijital dünyada yönetin. Ağaçlarınızı, sebzelerinizi takip edin, bakım zamanlarını kaçırmayın.',
    siteEmail: 'info@akillibahce.com',
    siteWebsite: 'www.akillibahce.com',
    siteWhatsApp: ''
  },
  ui: {
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm'
  }
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications || {}) },
      weather: { ...DEFAULT_SETTINGS.weather, ...(parsed.weather || {}) },
      reminders: { ...DEFAULT_SETTINGS.reminders, ...(parsed.reminders || {}) },
      appearance: { ...DEFAULT_SETTINGS.appearance, ...(parsed.appearance || {}) },
      maintenance: { ...DEFAULT_SETTINGS.maintenance, ...(parsed.maintenance || {}) },
      profile: { ...DEFAULT_SETTINGS.profile, ...(parsed.profile || {}) },
      ui: { ...DEFAULT_SETTINGS.ui, ...(parsed.ui || {}) }
    };
  } catch (e) {
    console.warn('Ayarlar okunamadı, varsayılanlar kullanılacak.', e);
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(nextSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
  } catch (e) {
    console.warn('Ayarlar kaydedilemedi.', e);
  }
}



function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function formatDateWithSettings(date) {
  let fmt = 'dd.MM.yyyy';

  try {
    const s = loadSettings();
    fmt = s.ui.dateFormat || fmt;
  } catch { }

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  const monthTR = monthNames[date.getMonth()];

  return fmt
    .replace('dd', dd)
    .replace('MMMM', monthTR)
    .replace('MM', mm)
    .replace('yyyy', yyyy);

}

/* -------------------- LOGIN -------------------- */

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Giriş başarısız.');
      }

      onLogin(data.token, data.username);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Akıllı Bahçe - Admin Giriş</h2>
      <form onSubmit={handleSubmit} className="card form-card">
        <label>
          Kullanıcı Adı
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Şifre
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <div className="error-text">{error}</div>}
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
}
/* -------------------- HAVA DURUMU SEKME (GENİŞ PANEL) -------------------- */

function WeatherTab({ token }) {
  const [city, setCity] = useState(() => {
    try {
      return localStorage.getItem('sg_city') || 'Elazig';
    } catch {
      return 'Elazig';
    }
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());

  // Ay isimleri / gün isimleri
  const dayNames = [
    'Pazar',
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi'
  ];

  // Ayarlar sekmesinden şehir değişince yakalamak için
  useEffect(() => {
    const handleCityChange = () => {
      try {
        const stored = localStorage.getItem('sg_city') || 'Elazig';
        setCity(stored);
      } catch {
        // ignore
      }
    };

    window.addEventListener('sg-city-changed', handleCityChange);
    handleCityChange();

    return () =>
      window.removeEventListener('sg-city-changed', handleCityChange);
  }, []);

  // Geniş hava durumu verisini çek
  useEffect(() => {
    // Token yoksa hiç istek atma
    if (!token) {
      setData(null);
      setError('');
      return;
    }

    const abort = new AbortController();

    const fetchExtended = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(
          `${API_URL}/weather/extended?city=${encodeURIComponent(city)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: abort.signal
          }
        );

        const json = await res.json().catch(() => ({}));

        // Sadece backend gerçekten token diyorsa oturum hatası göster
        if (
          res.status === 401 &&
          typeof json.message === 'string' &&
          json.message.toLowerCase().includes('token')
        ) {
          setError('Oturum süren dolmuş veya token geçersiz. Lütfen tekrar giriş yap.');
          return;
        }

        if (!res.ok) {
          throw new Error(json.message || 'Hava durumu alınamadı.');
        }


        setData(json);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Hava durumu alınamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchExtended();

    return () => abort.abort();
  }, [token, city]);


  // Saat + tarih için
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const handleCitySelectChange = async (e) => {
    const value = e.target.value;
    setCity(value);
    try {
      localStorage.setItem('sg_city', value);
      // Ayarlara da kaydet (API + localStorage'daki settings)
      const currentSettings = loadSettings();
      const updatedSettings = {
        ...currentSettings,
        weather: { ...currentSettings.weather, city: value }
      };
      saveSettings(updatedSettings);

      // API'ye de kaydet
      fetch(`${API_URL}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ path: 'weather.city', value })
      }).catch((err) => console.warn('API settings update failed:', err));

      // Header'daki widget'ı da güncelle
      window.dispatchEvent(new Event('sg-city-changed'));
    } catch (err) {
      console.warn('Şehir ayarı kaydedilemedi:', err);
    }
  };

  if (!token) {
    return (
      <div className="weather-page">
        <p className="muted">Hava durumu için önce giriş yapmalısın.</p>
      </div>
    );
  }

  const hasData = !!data && !!data.current;

  let hour12 = false;
  try {
    const s = loadSettings();
    if (s.ui?.timeFormat === 'hh:mm') {
      hour12 = true;
    }
  } catch { }

  const dateStr = formatDateWithSettings(now);
  const timeStr = now.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12
  });

  const current = data?.current || {};
  const hourly = data?.hourly || [];
  const daily = data?.daily || [];
  const air = data?.air || null;
  const windSpeed = typeof current.wind_speed === 'number' ? current.wind_speed : null;
  const windDeg = typeof current.wind_deg === 'number' ? current.wind_deg : null;
  const windDirLabel = getWindDirectionLabel(windDeg);

  // UV verisi var mı?
  const hasUv = typeof current.uvi === 'number';
  const uvInfo = hasUv ? getUvInfo(current.uvi) : null;

  // Hava kalitesi etiketi
  const aqiInfo = getAqiInfo(air?.aqi);

  // Hava kalitesi kartını tek yerde tanımlayalım, sonra hem solda hem sağda kullanabilelim
  const airQualityCard =
    air && (
      <div className="weather-aqi-card">
        <div className="card-title-row">
          <span className="card-title">Hava Kalitesi</span>
          <span className={`aqi-badge ${aqiInfo.className || ''}`}>
            AQI {air.aqi} · {aqiInfo.label}
          </span>
        </div>
        <div className="weather-aqi-grid">
          <div className="weather-aqi-item">
            <span className="label">PM2.5 : </span>
            <span className="value">{air.pm2_5?.toFixed(1) ?? '—'}</span>
          </div>
          <div className="weather-aqi-item">
            <span className="label">PM10 : </span>
            <span className="value">{air.pm10?.toFixed(1) ?? '—'}</span>
          </div>
          <div className="weather-aqi-item">
            <span className="label">O₃ : </span>
            <span className="value">{air.o3?.toFixed(1) ?? '—'}</span>
          </div>
          <div className="weather-aqi-item">
            <span className="label">NO₂ : </span>
            <span className="value">{air.no2?.toFixed(1) ?? '—'}</span>
          </div>
          <div className="weather-aqi-item">
            <span className="label">SO₂ : </span>
            <span className="value">{air.so2?.toFixed(1) ?? '—'}</span>
          </div>
          <div className="weather-aqi-item">
            <span className="label">CO : </span>
            <span className="value">{air.co?.toFixed(1) ?? '—'}</span>
          </div>
        </div>
      </div>
    );


  const sunrise = current.sunrise ? new Date(current.sunrise * 1000) : null;
  const sunset = current.sunset ? new Date(current.sunset * 1000) : null;

  const sunriseStr =
    sunrise &&
    sunrise.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12
    });

  const sunsetStr =
    sunset &&
    sunset.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12
    });

  const hourlySlice = hourly.slice(0, 12);
  const hourlyLabels = hourlySlice.map((h) =>
    new Date(h.dt * 1000).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12
    })
  );
  const hourlyTemps = hourlySlice.map((h) => h.temp);

  const hourlyChartData = {
    labels: hourlyLabels,
    datasets: [
      {
        label: 'Sıcaklık (°C)',
        data: hourlyTemps,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3
      }
    ]
  };

  const hourlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}°C`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: false }
    }
  };

  return (
    <div className="weather-page">
      {/* Üst başlık + saat + tarih + şehir seçimi */}
      <div className="weather-page-header">
        <div>
          <h2>Hava Durumu</h2>
          <p className="muted">
            Ayrıntılı hava durumu, UV indeksi, hava kalitesi ve tahminler.
          </p>
        </div>
        <div className="weather-page-header-right">

          <select
            className="settings-select weather-city-select"
            value={city}
            onChange={handleCitySelectChange}
          >
            <option value="Elazig">Elazığ</option>
            <option value="Istanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="Izmir">İzmir</option>
            <option value="Bursa">Bursa</option>
            <option value="Antalya">Antalya</option>
          </select>
        </div>
      </div>

      {error && <div className="error-text">{error}</div>}

      {loading && !hasData && (
        <div className="card">
          <p>Hava durumu yükleniyor...</p>
        </div>
      )}

      {hasData && (
        <>
          {/* Ana panel: sıcaklık, hissedilen, UV, rüzgar pusulası, hava kalitesi */}
          <div className="weather-main-grid">
            <div className="weather-main-panel card">
              {/* Sol taraf: sıcaklık + UV + gün doğumu/batımı */}
              <div className="weather-main-left">
                <div className="weather-main-temp"><div className="weather-date-time">
                  <span>{dateStr}
                    {timeStr}</span>
                </div>
                  <div className="weather-main-temp-value">
                    {Math.round(current.temp)}°C
                  </div>
                  {typeof current.feels_like === 'number' && (
                    <div className="weather-main-feels">
                      Hissedilen {Math.round(current.feels_like)}°C
                    </div>
                  )}
                  {current.description && (
                    <div className="weather-main-desc">
                      {current.description}
                    </div>
                  )}
                  <div className="weather-main-extra">
                    {typeof current.humidity === 'number' && (
                      <span>Nem % {current.humidity}</span>
                    )}
                    {typeof current.pressure === 'number' && (
                      <span>Basınç {current.pressure} hPa </span>
                    )}
                    {typeof current.clouds === 'number' && (
                      <span>Bulutluluk % {current.clouds}</span>
                    )}
                  </div>
                </div>

                <div className="weather-main-sun">
                  {sunriseStr && (
                    <div>
                      <div className="label">Gün doğumu</div>
                      <div className="value">{sunriseStr}</div>
                    </div>
                  )}
                  {sunsetStr && (
                    <div>
                      <div className="label">Gün batımı</div>
                      <div className="value">{sunsetStr}</div>
                    </div>
                  )}
                </div>

                {/* UV bandı varsa göster, yoksa yerine hava kalitesini getir */}
                {hasUv && (
                  <div className="weather-main-uv">
                    <div className="uv-label-row">
                      <span>UV İndeksi</span>
                      <span className="uv-value">
                        {current.uvi.toFixed(1)}
                      </span>
                    </div>
                    <div
                      className={`uv-band ${uvInfo?.className || ''}`}
                      aria-label={uvInfo?.label}
                    >
                      <span className="uv-band-label">{uvInfo?.label}</span>
                    </div>
                  </div>
                )}

                {!hasUv && airQualityCard}

              </div>

              {/* Sağ taraf: Rüzgar pusulası + hava kalitesi */}
              <div className="weather-main-right">
                {/* Rüzgar */}
                <div className="weather-wind-card">
                  <div className="card-title-row">
                    <span className="card-title">Rüzgar</span>
                    {windSpeed != null && (
                      <span className="card-sub">
                        {windSpeed.toFixed(1)} m/s
                      </span>
                    )}
                  </div>

                  <div className="weather-compass">
                    <div className="weather-compass-circle" />
                    <div className="weather-compass-arrow-wrapper">
                      {/* OpenWeather’da wind_deg: rüzgarın GELDİĞİ yön (derece) */}
                      <div
                        className="weather-compass-arrow"
                        style={{
                          transform: `rotate(${(windDeg || 0) - 90}deg)`
                        }}
                      />
                    </div>
                    <div className="weather-compass-label n">N</div>
                    <div className="weather-compass-label e">E</div>
                    <div className="weather-compass-label s">S</div>
                    <div className="weather-compass-label w">W</div>
                  </div>

                  {/* Pusulanın altındaki yazılı bilgiler */}
                  <div className="weather-wind-info">
                    <div>
                      Yön:{' '}
                      {windDeg != null
                        ? `${windDirLabel} (${Math.round(windDeg)}°)`
                        : '—'}
                    </div>
                    <div>
                      Hız:{' '}
                      {windSpeed != null
                        ? `${windSpeed.toFixed(1)} m/s`
                        : '—'}
                    </div>
                  </div>
                </div>



              </div>
            </div>

            {/* Sağ kolon: saatlik tahmin grafiği */}
            <div className="weather-side-column">
              <div className="weather-hourly-card card">
                <div className="card-title-row">
                  <span className="card-title">Saatlik Tahmin</span>
                </div>
                {hourlySlice.length > 0 ? (
                  <div className="weather-hourly-chart-wrapper">
                    <Line data={hourlyChartData} options={hourlyChartOptions} />
                  </div>
                ) : (
                  <p className="muted">
                    Saatlik tahmin verisi bulunamadı.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Haftalık tahmin */}
          <div className="weather-week-card card">
            <div className="card-title-row">
              <span className="card-title">Haftalaık Tahmin</span>
            </div>
            <div className="weather-week-grid">
              {daily.map((day, idx) => {
                const date = new Date(day.dt * 1000);
                const name =
                  idx === 0
                    ? 'Bugün'
                    : idx === 1
                      ? 'Yarın'
                      : dayNames[date.getDay()];
                return (
                  <div key={day.dt || idx} className="weather-week-day">
                    <div className="weather-week-day-name">{name}</div>
                    <div className="weather-week-temp">
                      <span className="max">
                        {Math.round(day.temp_max)}°
                      </span>
                      <span className="min">
                        {Math.round(day.temp_min)}°
                      </span>
                    </div>
                    {typeof day.pop === 'number' && (
                      <div className="weather-week-pop">
                        Yağış %{Math.round(day.pop * 100)}
                      </div>
                    )}
                    {typeof day.uvi === 'number' && (
                      <div className="weather-week-uv">
                        UV {day.uvi.toFixed(1)}
                      </div>
                    )}
                    {day.description && (
                      <div className="weather-week-desc">
                        {day.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
function getWindDirectionLabel(deg) {
  if (typeof deg !== 'number') return '—';
  const dirs = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB']; // Kuzey, Kuzeydoğu vb.
  const index = Math.round(((deg % 360) / 45)) % 8;
  return dirs[index];
}

// UV seviyesi etiketi + renk sınıfı
function getUvInfo(uvi) {
  if (typeof uvi !== 'number') {
    return { label: 'Veri yok', className: 'uv-none' };
  }
  if (uvi < 3) return { label: 'Düşük', className: 'uv-low' };
  if (uvi < 6) return { label: 'Orta', className: 'uv-moderate' };
  if (uvi < 8) return { label: 'Yüksek', className: 'uv-high' };
  if (uvi < 11) return { label: 'Çok yüksek', className: 'uv-very-high' };
  return { label: 'Aşırı', className: 'uv-extreme' };
}

// AQI etiketi + renk sınıfı
function getAqiInfo(aqi) {
  switch (aqi) {
    case 1:
      return { label: 'İyi', className: 'aqi-good' };
    case 2:
      return { label: 'Orta', className: 'aqi-fair' };
    case 3:
      return {
        label: 'Hassas gruplar için sağlıksız',
        className: 'aqi-moderate'
      };
    case 4:
      return { label: 'Sağlıksız', className: 'aqi-poor' };
    case 5:
      return { label: 'Çok sağlıksız', className: 'aqi-very-poor' };
    default:
      return { label: 'Veri yok', className: 'aqi-unknown' };
  }
}

/* -------------------- HAVA DURUMU -------------------- */
function WeatherWidgeth({ token }) {
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(new Date());
  const [city, setCity] = useState(() => {
    try {
      return localStorage.getItem('sg_city') || 'Elazig';
    } catch {
      return 'Elazig';
    }
  });

  useEffect(() => {
    const handleCityChange = () => {
      try {
        const stored = localStorage.getItem('sg_city') || 'Elazig';
        setCity(stored);
      } catch {
        // ignore
      }
    };

    window.addEventListener('sg-city-changed', handleCityChange);
    // ilk yüklemede de ayarla
    handleCityChange();

    return () => window.removeEventListener('sg-city-changed', handleCityChange);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `${API_URL}/weather?city=${encodeURIComponent(city)}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await res.json();
        if (res.ok) setWeather(data);
      } catch (err) {
        console.log('Hava durumu alınamadı:', err);
      }
    };

    if (token) {
      fetchWeather();
    }
  }, [token, city]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!weather) return null;





  // Tarih formatlama fonksiyonu


  const dateStr = formatDateWithSettings(now);





  return (
    <div className="weather-inline">
      <div className="weather-main-row">
        <span className="w-icon">🌤️</span>
        <span className="w-temp">{Math.round(weather.temp)}°C</span>



        <span className="w-item">📍 {weather.city}</span>
        <span className="w-item">📅 {dateStr}</span>

      </div>
    </div>
  );
}
function WeatherWidget({ token }) {
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(new Date());
  const [city, setCity] = useState(() => {
    try {
      return localStorage.getItem('sg_city') || 'Elazig';
    } catch {
      return 'Elazig';
    }
  });

  useEffect(() => {
    const handleCityChange = () => {
      try {
        const stored = localStorage.getItem('sg_city') || 'Elazig';
        setCity(stored);
      } catch {
        // ignore
      }
    };

    window.addEventListener('sg-city-changed', handleCityChange);
    // ilk yüklemede de ayarla
    handleCityChange();

    return () => window.removeEventListener('sg-city-changed', handleCityChange);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `${API_URL}/weather?city=${encodeURIComponent(city)}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await res.json();
        if (res.ok) setWeather(data);
      } catch (err) {
        console.log('Hava durumu alınamadı:', err);
      }
    };

    if (token) {
      fetchWeather();
    }
  }, [token, city]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!weather) return null;





  // Tarih formatlama fonksiyonu


  const dateStr = formatDateWithSettings(now);

  let hour12 = false;
  try {
    const s = loadSettings();
    if (s.ui?.timeFormat === 'hh:mm') {
      hour12 = true; // 12 saat modu
    }
  } catch (e) {
    // varsayılan 24 saat
  }

  const timeStr = now.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12
  });

  return (
    <div className="weather-inline">
      <div className="weather-main-row">
        <span className="w-icon">🌤️</span>
        <span className="w-temp">{Math.round(weather.temp)}°C</span>
        <span className="w-item">
          Hissedilen {Math.round(weather.feels_like)}°C
        </span>
        <span className="w-item">Nem %{weather.humidity}</span>
        <span className="w-item">Rüzgar {weather.wind_speed} m/s</span>
      </div>
      <div className="weather-meta-row">
        <span className="w-item">📍 {weather.city}</span>
        <span className="w-item">📅 {dateStr}</span>
        <span className="w-item">⏰ {timeStr}</span>
      </div>
    </div>
  );
}


/* -------------------- SEBZE FORMU (POPUP İÇİN) -------------------- */

// Yaygın sebze isimleri listesi (alfabetik sıralı)
const COMMON_VEGETABLE_NAMES = [
  'Acı Biber',
  'Alabaş',
  'Arpacık Soğan',
  'Bakla',
  'Bal Kabağı',
  'Bamya',
  'Barbunya',
  'Bezelye',
  'Beyaz Lahana',
  'Biber',
  'Brokoli',
  'Börülce',
  'Brüksel Lahanası',
  'Çarliston Biber',
  'Çin Lahanası',
  'Dereotu',
  'Domates',
  'Enginar',
  'Fasulye',
  'Frenk Soğanı',
  'Göbek Marul',
  'Havuç',
  'Ispanak',
  'Kabak',
  'Kapya Biber',
  'Kara Lahana',
  'Karnabahar',
  'Karpuz',
  'Kavun',
  'Kereviz',
  'Kırmızı Lahana',
  'Kıvırcık Marul',
  'Kuru Soğan',
  'Kuşkonmaz',
  'Kuzukulağı',
  'Marul',
  'Maydanoz',
  'Mercimek',
  'Nane',
  'Nohut',
  'Pancar',
  'Patates',
  'Patlıcan',
  'Pazı',
  'Pırasa',
  'Ravent',
  'Rezene',
  'Roka',
  'Salatalık',
  'Salsifi',
  'Sarımsak',
  'Semizotu',
  'Sivri Biber',
  'Soğan',
  'Spagetti Kabağı',
  'Şalgam',
  'Tatlı Patates',
  'Tere',
  'Turp',
  'Yer Elması',
  'Yeşil Soğan'
].sort();

const VEGETABLE_CATEGORY_MAP = {
  'Marul': 'yaprakli', 'Kıvırcık Marul': 'yaprakli', 'Göbek Marul': 'yaprakli', 'Ispanak': 'yaprakli', 'Pazı': 'yaprakli', 'Roka': 'yaprakli', 'Tere': 'yaprakli', 'Maydanoz': 'yaprakli', 'Dereotu': 'yaprakli', 'Nane': 'yaprakli', 'Kuzukulağı': 'yaprakli', 'Semizotu': 'yaprakli', 'Beyaz Lahana': 'yaprakli', 'Kara Lahana': 'yaprakli', 'Kırmızı Lahana': 'yaprakli', 'Brüksel Lahanası': 'yaprakli', 'Çin Lahanası': 'yaprakli',
  'Domates': 'meyveli', 'Biber': 'meyveli', 'Çarliston Biber': 'meyveli', 'Sivri Biber': 'meyveli', 'Kapya Biber': 'meyveli', 'Patlıcan': 'meyveli', 'Bamya': 'meyveli',
  'Havuç': 'kok', 'Patates': 'kok', 'Tatlı Patates': 'kok', 'Pancar': 'kok', 'Turp': 'kok', 'Şalgam': 'kok', 'Kereviz': 'kok', 'Yer Elması': 'kok', 'Salsifi': 'kok',
  'Soğan': 'sogansi', 'Kuru Soğan': 'sogansi', 'Yeşil Soğan': 'sogansi', 'Sarımsak': 'sogansi', 'Pırasa': 'sogansi', 'Arpacık Soğan': 'sogansi', 'Frenk Soğanı': 'sogansi',
  'Fasulye': 'baklagil', 'Barbunya': 'baklagil', 'Bezelye': 'baklagil', 'Bakla': 'baklagil', 'Börülce': 'baklagil', 'Nohut': 'baklagil', 'Mercimek': 'baklagil',
  'Kabak': 'kabakgil', 'Bal Kabağı': 'kabakgil', 'Spagetti Kabağı': 'kabakgil', 'Kavun': 'kabakgil', 'Karpuz': 'kabakgil', 'Salatalık': 'kabakgil',
  'Kuşkonmaz': 'ozel', 'Enginar': 'ozel', 'Ravent': 'ozel', 'Brokoli': 'ozel', 'Karnabahar': 'ozel', 'Rezene': 'ozel'
};

const VEGETABLE_CATEGORY_LABELS = {
  genel: 'Genel',
  yaprakli: 'Yapraklı',
  kok: 'Kök Sebzeler',
  meyveli: 'Meyveli Sebzeler',
  kabakgil: 'Kabakgiller',
  baklagil: 'Baklagiller',
  sogansi: 'Soğansı Bitkiler',
  aromatik: 'Aromatik Otlar',
  ozel: 'Özel Sebzeler'
};

function VegetableForm({ initialVeg, onSave, onCancel, token }) {
  const [nameSelection, setNameSelection] = useState(''); // Dropdown seçimi
  const [customName, setCustomName] = useState(''); // Özel isim girişi
  const [name, setName] = useState('');
  const [count, setCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [monthlyTasks, setMonthlyTasks] = useState(Array(12).fill(''));
  const [category, setCategory] = useState('genel');

  const handleApplySuggestions = () => {
    const template = getVegetableSuggestions(category);

    setMonthlyTasks((prev) =>
      prev.map((val, idx) => {
        if (val && val.trim()) return val;
        return template[idx] || '';
      })
    );
  };



  useEffect(() => {
    if (initialVeg) {
      const vegName = initialVeg.name || '';
      setName(vegName);

      // Listede varsa dropdown'dan seç, yoksa "Özel" seç
      if (COMMON_VEGETABLE_NAMES.includes(vegName)) {
        setNameSelection(vegName);
        setCustomName('');
      } else {
        setNameSelection('Özel');
        setCustomName(vegName);
      }

      setCount(typeof initialVeg.count === 'number' ? initialVeg.count : 1);
      setNotes(initialVeg.notes || '');
      setImageUrl(initialVeg.imageUrl || '');
      setImageFile(null);
      setCategory(initialVeg.category || 'genel');
      const tasks = Array(12).fill('');
      (initialVeg.maintenance || []).forEach((m) => {
        if (m.month >= 1 && m.month <= 12) {
          tasks[m.month - 1] = m.tasks;
        }
      });
      setMonthlyTasks(tasks);
    } else {
      setName('');
      setNameSelection('');
      setCustomName('');
      setCount(1);
      setNotes('');
      setImageUrl('');
      setImageFile(null);
      setMonthlyTasks(Array(12).fill(''));
      setCategory('genel');
    }
  }, [initialVeg]);

  // nameSelection veya customName değiştiğinde name'i güncelle
  // AYRICA: Kategori otomatik seçilsin
  useEffect(() => {
    let newName = '';
    if (nameSelection === 'Özel') {
      newName = customName;
    } else if (nameSelection) {
      newName = nameSelection;
    }
    setName(newName);

    // Otomatik Kategori Seçimi (Sadece yeni eklemede veya kullanıcı değiştirmediyse mantıklı ama burada her isim değişiminde zorlayabiliriz)
    if (newName && VEGETABLE_CATEGORY_MAP[newName]) {
      setCategory(VEGETABLE_CATEGORY_MAP[newName]);
    }
  }, [nameSelection, customName]);

  const handleRemoveImage = async () => {
    // Yeni eklenen (daha kaydedilmemiş) sebzede sadece local bilgiyi sil
    if (!initialVeg?._id) {
      setImageUrl('');
      setImageFile(null);
      return;
    }

    if (!window.confirm('Bu sebzenin resmini silmek istiyor musun?')) {
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/vegetables/${initialVeg._id}/image`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || 'Resim silinemedi.');
        return;
      }

      const updatedVeg = data.vegetable || {};
      setImageUrl(updatedVeg.imageUrl || '');
      setImageFile(null);
    } catch (err) {
      console.error('Sebze resmi silme hatası:', err);
      alert('Sebze resmi silinirken bir hata oluştu.');
    }
  };




  const handleTaskChange = (index, value) => {
    const copy = [...monthlyTasks];
    copy[index] = value;
    setMonthlyTasks(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        console.log('Uploading vegetable image...');
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        const uploadData = await uploadRes.json().catch((err) => {
          console.error('Image upload JSON parse error:', err);
          return {};
        });

        console.log('Upload response:', { ok: uploadRes.ok, data: uploadData });

        if (uploadRes.ok && uploadData.url) {
          finalImageUrl = uploadData.url;
        } else if (imageFile) {
          console.warn('Image upload failed, continuing without image');
        }
      }

      const maintenance = monthlyTasks
        .map((text, idx) =>
          text.trim() ? { month: idx + 1, tasks: text.trim() } : null
        )
        .filter(Boolean);

      await onSave({
        name,
        count: Number(count) || 0,
        notes,
        imageUrl: finalImageUrl,
        maintenance,
        category
      });
    } catch (err) {
      console.error('VegetableForm submit error:', err);
      alert('Bir hata oluştu: ' + err.message);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>{initialVeg ? 'Sebzeyi Düzenle' : 'Yeni Sebze Ekle'}</h3>

      <label>
        Sebze Adı
        <select
          value={nameSelection}
          onChange={(e) => setNameSelection(e.target.value)}
          required
        >
          <option value="">-- Seçiniz --</option>
          {COMMON_VEGETABLE_NAMES.map((vegName) => (
            <option key={vegName} value={vegName}>
              {vegName}
            </option>
          ))}
          <option value="Özel">🥬 Özel (Elle gir)</option>
        </select>
      </label>

      {nameSelection === 'Özel' && (
        <label>
          Özel Sebze Adı
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Sebze adını yazın"
            required
          />
        </label>
      )}

      <label>
        Adet
        <input
          type="number"
          min="0"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
      </label>
      <label>
        Sebze Kategorisi
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="yaprakli">Yapraklı (Marul, Lahana, Ispanak, Pazı...)</option>
          <option value="kok">Kök Sebzeler (Havuç, Pancar, Turp, Patates...)</option>
          <option value="meyveli">Meyveli Sebzeler (Domates, Biber, Patlıcan, Bamya...)</option>
          <option value="kabakgil">Kabakgiller (Kabak, Salatalık, Kavun, Karpuz...)</option>
          <option value="baklagil">Baklagiller (Fasulye, Bezelye, Nohut, Mercimek...)</option>
          <option value="sogansi">Soğansı Bitkiler (Soğan, Sarımsak, Pırasa...)</option>
          <option value="aromatik">Aromatik Otlar (Maydanoz, Dereotu, Nane, Rezene...)</option>
          <option value="ozel">Özel Sebzeler (Kuşkonmaz, Ravent...)</option>
        </select>
      </label>
      <label>
        Notlar
        <textarea
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Genel notlar..."
        />
      </label>

      <label>
        Resim Seç
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <small className="help-text">
          Maksimum 1 MB, tercihen 1200x900 piksel ve JPEG / PNG / WEBP formatında resim yükle.
        </small>
      </label>

      {imageUrl && (
        <div className="form-image-preview">
          <img
            src={`${BASE_URL}${imageUrl}`}
            alt="Önizleme"
            loading="lazy"
            onError={(e) => {
              e.target.src = `${BASE_URL}/uploads/noimage.png`;
            }}
          />
          {/* 🆕 Sebze resmi sil butonu */}
          <button
            type="button"
            className="btn"
            style={{ marginTop: '4px' }}
            onClick={handleRemoveImage}
          >
            Resmi Sil
          </button>
        </div>
      )}





      <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
        <button
          type="button"
          className="btn"
          onClick={handleApplySuggestions}
        >
          🔮 Kategoriye Göre Bakım Önerilerini Doldur
        </button>
        <span className="muted">
          Boş olan aylar otomatik doldurulur, yazdıkların korunur.
        </span>
      </div>

      <div className="months-grid">
        {monthNames.map((mName, idx) => (
          <div key={mName} className="month-item">
            <div className="month-title">{mName}</div>
            <textarea
              rows="2"
              value={monthlyTasks[idx]}
              onChange={(e) => handleTaskChange(idx, e.target.value)}
              placeholder={`${mName} ayı bakımı...`}
            />
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          İptal
        </button>
        <button type="submit" className="btn primary">
          Kaydet
        </button>
      </div>
    </form>
  );
}

/* -------------------- AĞAÇ FORMU (POPUP İÇİN) -------------------- */

// Yaygın ağaç ve sebze isimleri listesi
const COMMON_TREE_NAMES = [
  'Ahududu', 'Akçaağaç', 'Alıç', 'Altıntop', 'Antep Fıstığı', 'Ardıç',
  'Armut', 'Avokado', 'Ayva', 'Badem', 'Bektaşi Üzümü',
  'Bergamot', 'Beyaz Dut', 'Böğürtlen', 'Ceviz', 'Çam',
  'Elma', 'Erik', 'Fındık', 'Gavur Narı', 'Greyfurt',
  'Guava', 'Günlük Ağacı', 'Ihlamur', 'İncir', 'Japon Gülü (Sakura)', 'Kan Portakalı',
  'Kara Dut', 'Karabiber', 'Karambola', 'Karayemiş', 'Kayısı', 'Keçiboynuzu',
  'Kestane', 'Kiraz', 'Kızılcık', 'Kumkuat', 'Ladin',
  'Limon', 'Liçi', 'Mandalina', 'Mango', 'Meşe',
  'Muşmula', 'Muz', 'Napolyon Kirazı', 'Nar', 'Nektarin',
  'Papaya', 'Pekan Cevizi', 'Pitaya', 'Portakal', 'Rambutan',
  'Sakız Ağacı', 'Sedir', 'Servi', 'Sumak', 'Şeftali',
  'Trabzon Hurması', 'Turunç', 'Üzüm Asması', 'Vişne', 'Yabani Elma',
  'Yaban Mersini', 'Yenibahar', 'Yenidünya', 'Zeytin'
].sort();

const TREE_CATEGORY_MAP = {
  'Elma': 'meyve', 'Armut': 'meyve', 'Kiraz': 'meyve', 'Şeftali': 'meyve', 'Zeytin': 'meyve', 'Nar': 'meyve', 'Ayva': 'meyve', 'Kayısı': 'meyve', 'Vişne': 'meyve', 'Erik': 'meyve', 'İncir': 'meyve', 'Trabzon Hurması': 'meyve', 'Nektarin': 'meyve', 'Üzüm Asması': 'meyve', 'Napolyon Kirazı': 'meyve',
  'Portakal': 'narenciye', 'Mandalina': 'narenciye', 'Limon': 'narenciye', 'Greyfurt': 'narenciye', 'Turunç': 'narenciye', 'Bergamot': 'narenciye', 'Kumkuat': 'narenciye', 'Kamkat': 'narenciye', 'Altıntop': 'narenciye', 'Kan Portakalı': 'narenciye',
  'Ceviz': 'sert-kabuklu', 'Fındık': 'sert-kabuklu', 'Badem': 'sert-kabuklu', 'Kestane': 'sert-kabuklu', 'Antep Fıstığı': 'sert-kabuklu', 'Pekan Cevizi': 'sert-kabuklu',
  'Çam': 'igne-yaprakli', 'Sedir': 'igne-yaprakli', 'Ladin': 'igne-yaprakli', 'Servi': 'igne-yaprakli',
  'Akçaağaç': 'sus-agaci', 'Meşe': 'sus-agaci', 'Japon Gülü (Sakura)': 'sus-agaci', 'Erguvan': 'sus-agaci', 'Manolya': 'sus-agaci', 'Çınar': 'sus-agaci',
  'Ihlamur': 'tibbi-aromatik', 'Sığla': 'tibbi-aromatik', 'Sakız Ağacı': 'tibbi-aromatik', 'Sumak': 'tibbi-aromatik', 'Defne': 'tibbi-aromatik', 'Okaliptüs': 'tibbi-aromatik',
  'Ahududu': 'yumusak-meyveli', 'Böğürtlen': 'yumusak-meyveli', 'Bektaşi Üzümü': 'yumusak-meyveli', 'Karadut': 'yumusak-meyveli', 'Dut': 'yumusak-meyveli', 'Beyaz Dut': 'yumusak-meyveli', 'Kara Dut': 'yumusak-meyveli',
  'Avokado': 'tropik', 'Mango': 'tropik', 'Muz': 'tropik', 'Papaya': 'tropik', 'Liçi': 'tropik', 'Ananas': 'tropik', 'Ejder Meyvesi': 'tropik', 'Pitaya': 'tropik', 'Guava': 'tropik', 'Yenidünya': 'tropik', 'Rambutan': 'tropik', 'Karambola': 'tropik', 'Gavur Narı': 'tropik',
  'Kızılcık': 'yabani-meyve', 'Alıç': 'yabani-meyve', 'Muşmula': 'yabani-meyve', 'İğde': 'yabani-meyve', 'Yabani Elma': 'yabani-meyve', 'Ahlat': 'yabani-meyve', 'Karayemiş': 'yabani-meyve', 'Yaban Mersini': 'yabani-meyve', 'Keçiboynuzu': 'yabani-meyve',
  'Ardıç': 'reçineli', 'Günlük Ağacı': 'reçineli',
  'Yenibahar': 'baharat', 'Karabiber': 'baharat'
};

const TREE_CATEGORY_LABELS = {
  genel: 'Genel',
  meyve: 'Meyve Ağaçları',
  narenciye: 'Narenciye',
  tropik: 'Tropik Meyveler',
  'sert-kabuklu': 'Sert Kabuklu Meyveler',
  'sus-agaci': 'Süs Ağaçları',
  'igne-yaprakli': 'İğne Yapraklı',
  'yumusak-meyveli': 'Yumuşak Meyveli',
  'yabani-meyve': 'Yabani Meyveler',
  'tibbi-aromatik': 'Tıbbi ve Aromatik',
  'reçineli': 'Reçineli',
  'baharat': 'Baharat'
};

function TreeForm({ initialTree, onSave, onCancel, token }) {
  const [nameSelection, setNameSelection] = useState(''); // Dropdown seçimi
  const [customName, setCustomName] = useState(''); // Özel isim girişi
  const [name, setName] = useState('');
  const [count, setCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [monthlyTasks, setMonthlyTasks] = useState(Array(12).fill(''));
  const [category, setCategory] = useState('genel');

  const handleApplySuggestions = () => {
    const template = getTreeSuggestions(category);

    setMonthlyTasks((prev) =>
      prev.map((val, idx) => {
        // Eğer kullanıcı zaten bir şey yazmışsa ÜSTÜNE YAZMA
        if (val && val.trim()) return val;
        return template[idx] || '';
      })
    );
  };




  useEffect(() => {
    if (initialTree) {
      const treeName = initialTree.name || '';
      setName(treeName);

      // Listede varsa dropdown'dan seç, yoksa "Özel" seç
      if (COMMON_TREE_NAMES.includes(treeName)) {
        setNameSelection(treeName);
        setCustomName('');
      } else {
        setNameSelection('Özel');
        setCustomName(treeName);
      }

      setCount(
        typeof initialTree.count === 'number' ? initialTree.count : 1
      );
      setNotes(initialTree.notes || '');
      setImageUrl(initialTree.imageUrl || '');
      setImageFile(null);

      // 🆕 kategori
      setCategory(initialTree.category || 'genel');

      const tasks = Array(12).fill('');
      (initialTree.maintenance || []).forEach((m) => {
        if (m.month >= 1 && m.month <= 12) {
          tasks[m.month - 1] = m.tasks;
        }
      });
      setMonthlyTasks(tasks);
    } else {
      setName('');
      setNameSelection('');
      setCustomName('');
      setCount(1);
      setNotes('');
      setImageUrl('');
      setImageFile(null);
      setMonthlyTasks(Array(12).fill(''));

      // 🆕
      setCategory('genel');
    }
  }, [initialTree]);

  // nameSelection veya customName değiştiğinde name'i güncelle
  // AYRICA: Kategori otomatik seçilsin
  useEffect(() => {
    let newName = '';
    if (nameSelection === 'Özel') {
      newName = customName;
    } else if (nameSelection) {
      newName = nameSelection;
    }
    setName(newName);

    // Otomatik Kategori Seçimi
    if (newName && TREE_CATEGORY_MAP[newName]) {
      setCategory(TREE_CATEGORY_MAP[newName]);
    }
  }, [nameSelection, customName]);

  const handleTaskChange = (index, value) => {
    const copy = [...monthlyTasks];
    copy[index] = value;
    setMonthlyTasks(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let finalImageUrl = imageUrl;

      // Yeni dosya seçildiyse sunucuya yükle
      if (imageFile) {
        console.log('Uploading image...');
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        const uploadData = await uploadRes.json().catch((err) => {
          console.error('Image upload JSON parse error:', err);
          return {};
        });

        console.log('Upload response:', { ok: uploadRes.ok, data: uploadData });

        if (uploadRes.ok && uploadData.url) {
          finalImageUrl = uploadData.url;
        } else if (imageFile) {
          console.warn('Image upload failed, continuing without image');
        }
      }

      const maintenance = monthlyTasks
        .map((text, idx) =>
          text.trim()
            ? { month: idx + 1, tasks: text.trim() }
            : null
        )
        .filter(Boolean);

      await onSave({
        name,
        count: Number(count) || 0,
        notes,
        imageUrl: finalImageUrl,
        maintenance,
        category
      });
    } catch (err) {
      console.error('TreeForm submit error:', err);
      alert('Bir hata oluştu: ' + err.message);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>{initialTree ? 'Ağacı Düzenle' : 'Yeni Ağaç Ekle'}</h3>

      <label>
        Ağaç Adı
        <select
          value={nameSelection}
          onChange={(e) => setNameSelection(e.target.value)}
          required
        >
          <option value="">-- Seçiniz --</option>
          {COMMON_TREE_NAMES.map((treeName) => (
            <option key={treeName} value={treeName}>
              {treeName}
            </option>
          ))}
          <option value="Özel">🌱 Özel (Elle gir)</option>
        </select>
      </label>

      {nameSelection === 'Özel' && (
        <label>
          Özel Ağaç Adı
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Ağaç adını yazın"
            required
          />
        </label>
      )}

      <label>
        Adet
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            type="button"
            onClick={() => setCount(Math.max(0, parseInt(count || 0) - 1))}
            style={{ padding: '5px 10px', cursor: 'pointer', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            -
          </button>
          <input
            type="number"
            min="0"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ width: '60px', textAlign: 'center' }}
          />
          <button
            type="button"
            onClick={() => setCount(parseInt(count || 0) + 1)}
            style={{ padding: '5px 10px', cursor: 'pointer', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            +
          </button>
        </div>
      </label>
      <label>
        Ağaç Kategorisi
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="meyve">Meyve Ağaçları (Elma, Armut, Kiraz, Şeftali, Zeytin, Nar...)</option>
          <option value="narenciye">Narenciye (Portakal, Mandalina, Limon, Greyfurt...)</option>
          <option value="tropik">Tropik Meyveler (Mango, Avokado, Muz, Papaya, Liçi...)</option>
          <option value="sert-kabuklu">Sert Kabuklu Meyveler (Ceviz, Fındık, Badem, Kestane...)</option>
          <option value="sus-agaci">Süs Ağaçları (Akçaağaç, Meşe, Ihlamur, Sakura...)</option>
          <option value="igne-yaprakli">İğne Yapraklı (Çam, Sedir, Ladin, Servi...)</option>
          <option value="yumusak-meyveli">Yumuşak Meyveli (Ahududu, Böğürtlen, Bektaşi Üzümü...)</option>
          <option value="yabani-meyve">Yabani Meyveler (Yabani Elma, Yaban Mersini, Keçiboynuzu...)</option>
          <option value="tibbi-aromatik">Tıbbi ve Aromatik (Sakız Ağacı, Ihlamur, Sığla, Sumak...)</option>
          <option value="reçineli">Reçineli (Ardıç, Günlük Ağacı...)</option>
          <option value="baharat">Baharat (Yenibahar, Karabiber...)</option>
        </select>
      </label>

      <label>
        Notlar
        <textarea
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Genel notlar..."
        />
      </label>

      <label>
        Resim Seç
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <small className="help-text">
          Maksimum 1 MB, tercihen 1200x900 piksel ve JPEG / PNG / WEBP formatında resim yükle.
        </small>
      </label>


      {imageUrl && (
        <div className="form-image-preview">
          <img
            src={`${BASE_URL}${imageUrl}`}
            alt="Önizleme"
            loading="lazy"
            onError={(e) => {
              e.target.src = `${BASE_URL}/uploads/noimage.jpg`;
            }}
          />
        </div>
      )}

      {imageUrl && (
        <button
          type="button"
          className="btn danger"
          onClick={async () => {
            if (!window.confirm('Bu resmi silmek istiyor musun?')) return;

            try {
              const res = await fetch(
                `${API_URL}/trees/${initialTree._id}/image`,
                {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` }
                }
              );

              const data = await res.json().catch(() => ({}));
              if (!res.ok) {
                alert(data.message || 'Resim silinemedi.');
                return;
              }

              alert('Resim silindi.');
              setImageUrl(''); // önizlemeyi güncelle
            } catch (err) {
              alert('Sunucu hatası.');
            }
          }}
          style={{ marginTop: '8px' }}
        >
          Resmi Sil
        </button>
      )}
      <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
        <button
          type="button"
          className="btn"
          onClick={handleApplySuggestions}
        >
          🔮 Kategoriye Göre Bakım Önerilerini Doldur
        </button>
        <span className="muted">
          Boş olan aylar otomatik doldurulur, yazdıkların silinmez.
        </span>
      </div>

      <div className="months-grid">
        {monthNames.map((mName, idx) => (
          <div key={mName} className="month-item">
            <div className="month-title">{mName}</div>
            <textarea
              rows="2"
              value={monthlyTasks[idx]}
              onChange={(e) => handleTaskChange(idx, e.target.value)}
              placeholder={`${mName} ayı bakımı...`}
            />
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          İptal
        </button>
        <button type="submit" className="btn primary">
          Kaydet
        </button>
      </div>
    </form>
  );
}

/* -------------------- SEBZE YÖNETİMİ (GRID + POPUP) -------------------- */

function VegetableManager({ token }) {
  const [veggies, setVeggies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingVeg, setEditingVeg] = useState(null);
  const [selectedVeg, setSelectedVeg] = useState(null);

  // Filtreleme ve sıralama state'leri
  const [sortBy, setSortBy] = useState('name-asc');

  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Görünüm modunu al
  const [viewMode, setViewMode] = useState('card');
  useEffect(() => {
    const settings = loadSettings();
    setViewMode(settings.appearance?.viewMode || 'card');

    const handleSettingsChange = () => {
      const newSettings = loadSettings();
      setViewMode(newSettings.appearance?.viewMode || 'card');
    };

    window.addEventListener('sg-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('sg-settings-changed', handleSettingsChange);
  }, []);

  const fetchVeggies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/vegetables`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ([]));
      if (!res.ok) {
        throw new Error(data.message || 'Sebzeler alınamadı.');
      }
      setVeggies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchVeggies();
  }, [fetchVeggies]);

  const handleCreate = () => {
    setEditingVeg(null);
    setSelectedVeg(null);
    setShowForm(true);
  };

  const handleEdit = (veg) => {
    setEditingVeg(veg);
    setSelectedVeg(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu sebzeyi silmek istediğine emin misin?')) return;

    try {
      const res = await fetch(`${API_URL}/vegetables/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Silme başarısız.');
      }
      setVeggies((prev) => prev.filter((v) => v._id !== id));
      setSelectedVeg(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuickUpdate = async (veg, newCount) => {
    try {
      const url = `${API_URL}/vegetables/${veg._id}`;
      const updatedData = { ...veg, count: newCount };

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Güncelleme başarısız');

      setVeggies((prev) =>
        prev.map((v) => (v._id === data._id ? data : v))
      );

      // Modal açıksa selectedVeg'i de güncelle (anlık değişim için)
      if (selectedVeg && selectedVeg._id === data._id) {
        setSelectedVeg(data);
      }
    } catch (err) {
      console.error('Quick update error:', err);
    }
  };

  const handleSave = async (vegData) => {
    try {
      let url = `${API_URL}/vegetables`;
      let method = 'POST';

      if (editingVeg) {
        url = `${API_URL}/vegetables/${editingVeg._id}`;
        method = 'PUT';
      }

      console.log('Saving vegetable:', vegData);
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(vegData)
      });

      const data = await res.json().catch((err) => {
        console.error('JSON parse error:', err);
        return {};
      });

      console.log('Response:', { ok: res.ok, status: res.status, data });

      if (!res.ok) {
        throw new Error(data.message || 'Kaydetme başarısız.');
      }

      if (editingVeg) {
        setVeggies((prev) =>
          prev.map((v) => (v._id === data._id ? data : v))
        );
      } else {
        setVeggies((prev) => [...prev, data]);
      }

      setShowForm(false);
      setEditingVeg(null);
    } catch (err) {
      console.error('Save error:', err);
      alert(err.message);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingVeg(null);
  };

  const closeDetail = () => {
    setSelectedVeg(null);
  };

  // Filtreleme ve sıralama işlemleri
  const getFilteredAndSortedVeggies = () => {
    let filtered = [...veggies];

    // Kategori filtresi
    // Kategori filtresi
    if (filterCategory !== 'all') {
      filtered = filtered.filter((v) => v.category === filterCategory);
    }

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter((v) =>
        v.name.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr'))
      );
    }

    // Sıralama
    filtered.sort((a, b) => {
      // Önce sayısı sıfır olanları sona at
      const aIsZero = (a.count || 0) === 0;
      const bIsZero = (b.count || 0) === 0;

      if (aIsZero && !bIsZero) return 1;
      if (!aIsZero && bIsZero) return -1;

      // Her ikisi de sıfır veya her ikisi de sıfır değilse normal sıralama
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'tr');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'tr');
        case 'date-new':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'date-old':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'category':
          return a.category.localeCompare(b.category, 'tr');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleMaintenanceToggle = async (
    vegId,
    month,
    currentlyCompleted
  ) => {
    const question = currentlyCompleted
      ? 'Bu ayki bakımı "tamamlanmadı" yapmak istiyor musun?'
      : 'Bu ayki bakım tamamlandı mı?';

    const ok = window.confirm(question);
    if (!ok) return;

    try {
      const res = await fetch(
        `${API_URL}/vegetables/${vegId}/maintenance/${month}/toggle`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'Bakım durumu güncellenemedi.');
        return;
      }

      const updatedVeg = data.vegetable || {};
      setVeggies((prev) =>
        prev.map((v) => (v._id === updatedVeg._id ? updatedVeg : v))
      );

      setSelectedVeg((prev) =>
        prev && prev._id === updatedVeg._id ? updatedVeg : prev
      );
    } catch (err) {
      console.error('Sebze bakım toggle hatası:', err);
      alert('Sunucu hatası.');
    }
  };

  const filteredVeggies = getFilteredAndSortedVeggies();

  return (
    <div>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <h2>Sebzeler</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <label style={{ fontWeight: 'bold' }}>Ara:</label>
          <input
            type="text"
            placeholder="İsim ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="settings-select"
            style={{ width: '120px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <label style={{ fontWeight: 'bold' }}>Kategori:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="settings-select"
          >
            <option value="all">Tümü</option>
            {Object.entries(VEGETABLE_CATEGORY_LABELS)
              .filter(([key]) => veggies.some(v => v.category === key))
              .map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))
            }
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <label style={{ fontWeight: 'bold' }}>Sırala:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            class="settings-select"
          >
            <option value="name-asc">İsim (A-Z)</option>
            <option value="name-desc">İsim (Z-A)</option>
            <option value="date-new">Tarih (Yeni-Eski)</option>
            <option value="date-old">Tarih (Eski-Yeni)</option>
            <option value="category">Kategoriye Göre</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#666', marginRight: 'auto' }}>
          {filteredVeggies.reduce((sum, v) => sum + (v.count || 0), 0)} sebze
        </div>

        <button className="btn primary" onClick={handleCreate}>
          + Yeni Sebze
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className={viewMode === 'list' ? 'items-list' : 'cards-grid'}>
        {filteredVeggies.map((veg) => {
          const totalTasks = veg.maintenance?.length || 0;
          const doneTasks =
            veg.maintenance?.filter((m) => m.completed).length || 0;
          const completion = totalTasks
            ? Math.round((doneTasks / totalTasks) * 100)
            : 0;

          const isZeroCount = (veg.count || 0) === 0;

          return (
            <div
              key={veg._id}
              className={viewMode === 'list' ? 'item-row' : 'tree-card'}
              onClick={() => setSelectedVeg(veg)}
              style={{ opacity: isZeroCount ? 0.5 : 1 }}
            >
              <div className="tree-card-image-wrapper">
                <img
                  src={`${BASE_URL}${veg.imageUrl || '/uploads/noimage.png'
                    }`}
                  alt={veg.name}
                  className="tree-card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `${BASE_URL}/uploads/noimage.png`;
                  }}
                />
              </div>

              <div className={viewMode === 'list' ? 'tree-card-body tree-card-body-list' : 'tree-card-body'}>
                <div className="tree-card-header-row">
                  <h3>{veg.name}</h3>

                  <div className="header-right-badges">
                    {totalTasks > 0 && (
                      <span
                        className={
                          'tree-progress-pill ' +
                          (completion === 100
                            ? 'tree-progress-pill-done'
                            : '')
                        }
                      >
                        {doneTasks}/{totalTasks} • %{completion}
                      </span>
                    )}

                    {viewMode === 'list' && veg.maintenance && veg.maintenance.length > 0 && (
                      <span className="tree-chip maintenance-chip-inline">
                        📅 {veg.maintenance.length} ay
                      </span>
                    )}
                  </div>
                </div>

                <div className="tree-card-meta-row">
                  <span className="tree-chip">Adet: {veg.count}</span>

                  <span className="tree-chip">
                    {veg.category === 'yaprakli'
                      ? 'Yapraklı'
                      : veg.category === 'kök'
                        ? 'Kök Sebze'
                        : veg.category === 'meyve'
                          ? 'Meyve Sebze'
                          : veg.category === 'baklagil'
                            ? 'Baklagil'
                            : 'Genel'}
                  </span>

                </div>

                {veg.notes && (
                  <p className="tree-card-note">{veg.notes}</p>
                )}
              </div>

              {viewMode === 'list' && veg.maintenance && veg.maintenance.length > 0 && (() => {
                const currentMonth = new Date().getMonth() + 1; // 1-12 arası
                const upcomingMonths = veg.maintenance.filter(m => m.month >= currentMonth).slice(0, 3);
                const remaining = veg.maintenance.filter(m => m.month >= currentMonth).length - 3;

                return upcomingMonths.length > 0 && (
                  <div className="list-maintenance-summary list-maintenance-sidebar">
                    {upcomingMonths.map((m) => (
                      <div
                        key={m._id || m.month}
                        className="maintenance-preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMaintenanceToggle(veg._id, m.month, m.completed);
                        }}
                      >
                        <span className="month-badge">{monthNames[m.month - 1]}</span>
                        <span className="task-preview">{m.tasks?.substring(0, 100)}{m.tasks?.length > 40 ? '...' : ''}</span>
                        {m.completed && <span className="completed-badge">✓</span>}
                      </div>
                    ))}
                    {remaining > 0 && (
                      <div className="more-tasks">+{remaining} ay daha</div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {!loading && veggies.length === 0 && (
        <p>Henüz sebze eklenmemiş. “Yeni Sebze” ile başlayabilirsin.</p>
      )}

      {selectedVeg && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedVeg.name}</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>Adet:</strong>
              <button
                onClick={() => {
                  const newCount = Math.max(0, (selectedVeg.count || 0) - 1);
                  handleQuickUpdate(selectedVeg, newCount);
                }}
                style={{
                  padding: '5px 10px',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  background: '#f8f9fa',
                  borderRadius: '4px'
                }}
              >
                -
              </button>
              <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                {selectedVeg.count}
              </span>
              <button
                onClick={() => {
                  const newCount = (selectedVeg.count || 0) + 1;
                  handleQuickUpdate(selectedVeg, newCount);
                }}
                style={{
                  padding: '5px 10px',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  background: '#f8f9fa',
                  borderRadius: '4px'
                }}
              >
                +
              </button>
            </p>
            <p>
              <strong>Kategori:</strong>{' '}
              {selectedVeg.category || 'Genel'}
            </p>
            {selectedVeg.notes && (
              <p>
                <strong>Not:</strong> {selectedVeg.notes}
              </p>
            )}

            {(() => {
              const currentMonth = new Date().getMonth() + 1;
              const thisMonth = selectedVeg.maintenance?.find(
                (m) => m.month === currentMonth
              );

              return (
                <div className="this-month-box">
                  <h4>
                    Bu Ay Yapılacaklar ({monthNames[currentMonth - 1]})
                  </h4>
                  {thisMonth ? (
                    <p>
                      {thisMonth.tasks}{' '}
                      {thisMonth.completed && (
                        <span className="this-month-done">
                          ✅ Tamamlandı
                        </span>
                      )}
                    </p>
                  ) : (
                    <p>Bu ay için bakım planı yok.</p>
                  )}
                </div>
              );
            })()}

            <h3>Aylık Bakım Planı</h3>
            {selectedVeg.maintenance &&
              selectedVeg.maintenance.length > 0 ? (
              <div className="maintenance-table-wrapper">
                <table className="maintenance-table">
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>Ay</th>
                      <th style={{ width: '100px' }}>Kategori</th>
                      <th>Bakım Görevleri</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVeg.maintenance
                      .sort((a, b) => a.month - b.month)
                      .map((m) => {
                        const text = m.tasks || 'Görev girilmemiş';
                        const isImportant = /budama|ilaç|sulama|gübre/i.test(text);
                        const tag = classifyMaintenanceTask(text);

                        return (
                          <tr
                            key={m._id || `${selectedVeg._id}-${m.month}`}
                            className={
                              'maintenance-table-row ' +
                              (isImportant ? 'important ' : '') +
                              (m.completed ? 'completed ' : '')
                            }
                            onClick={() =>
                              handleMaintenanceToggle(
                                selectedVeg._id,
                                m.month,
                                m.completed
                              )
                            }
                          >
                            <td>
                              <span className="maintenance-month-chip">
                                {monthNames[m.month - 1]}
                              </span>
                            </td>
                            <td>
                              <span className={`maintenance-tag ${tag.className}`}>
                                {tag.label}
                              </span>
                            </td>
                            <td className="maintenance-task-cell">{text}</td>
                            <td style={{ textAlign: 'center' }}>
                              {m.completed ? (
                                <span className="maintenance-check">✅</span>
                              ) : (
                                <span className="maintenance-pending">⏳</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="maintenance-empty">
                Bakım planı girilmemiş.
              </p>
            )}

            <div className="modal-actions">
              <button
                className="btn danger"
                onClick={() => handleDelete(selectedVeg._id)}
              >
                Sil
              </button>
              <button
                className="btn"
                onClick={() => handleEdit(selectedVeg)}
              >
                Düzenle
              </button>
              <button className="btn" onClick={closeDetail}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div
            className="modal modal-form"
            onClick={(e) => e.stopPropagation()}
          >
            <VegetableForm
              initialVeg={editingVeg}
              onSave={handleSave}
              onCancel={closeForm}
              token={token}
            />
          </div>
        </div>
      )}
    </div>
  );
}


/* -------------------- AĞAÇ YÖNETİMİ (GRID + POPUP) -------------------- */

function TreeManager({ token }) {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingTree, setEditingTree] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);

  // Filtreleme ve sıralama state'leri
  const [sortBy, setSortBy] = useState('name-asc');

  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Görünüm modunu al
  const [viewMode, setViewMode] = useState('card');
  useEffect(() => {
    const settings = loadSettings();
    setViewMode(settings.appearance?.viewMode || 'card');

    const handleSettingsChange = () => {
      const newSettings = loadSettings();
      setViewMode(newSettings.appearance?.viewMode || 'card');
    };

    window.addEventListener('sg-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('sg-settings-changed', handleSettingsChange);
  }, []);

  const fetchTrees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/trees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ([]));
      if (!res.ok) {
        throw new Error(data.message || 'Ağaçlar alınamadı.');
      }
      setTrees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  const handleCreate = () => {
    setEditingTree(null);
    setSelectedTree(null);
    setShowForm(true);
  };

  const handleEdit = (tree) => {
    setEditingTree(tree);
    setSelectedTree(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ağacı silmek istediğine emin misin?')) return;

    try {
      const res = await fetch(`${API_URL}/trees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Silme başarısız.');
      }
      setTrees((prev) => prev.filter((t) => t._id !== id));
      setSelectedTree(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMaintenanceToggle = async (treeId, month, currentlyCompleted) => {
    const question = currentlyCompleted
      ? 'Bu ayki bakımı "tamamlanmadı" yapmak istiyor musun?'
      : 'Bu ayki bakım tamamlandı mı?';

    const ok = window.confirm(question);
    if (!ok) return;

    try {
      const res = await fetch(
        `${API_URL}/trees/${treeId}/maintenance/${month}/toggle`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'Bakım durumu güncellenemedi.');
        return;
      }

      const updatedTree = data.tree;

      setTrees((prev) =>
        prev.map((t) => (t._id === updatedTree._id ? updatedTree : t))
      );

      setSelectedTree((prev) =>
        prev && prev._id === updatedTree._id ? updatedTree : prev
      );
    } catch (err) {
      console.error('Bakım toggle fetch hatası:', err);
      alert('Sunucu hatası.');
    }
  };

  const handleQuickUpdate = async (tree, newCount) => {
    try {
      const url = `${API_URL}/trees/${tree._id}`;
      // Sadece count değişikliği için tüm objeyi göndermek yerine,
      // backend PUT tüm objeyi bekliyorsa mevcut tree ile merge edip yolluyoruz.
      // EĞER backend PATCH destekliyorsa daha iyi olurdu ama şimdilik PUT.
      const updatedData = { ...tree, count: newCount };

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Güncelleme başarısız');

      setTrees((prev) =>
        prev.map((t) => (t._id === data._id ? data : t))
      );

      // Modal açıksa selectedTree'yi de güncelle (anlık değişim için)
      if (selectedTree && selectedTree._id === data._id) {
        setSelectedTree(data);
      }
    } catch (err) {
      console.error('Quick update error:', err);
      // Hata durumunda kullanıcıya bildirim yapılabilir
    }
  };

  const handleSave = async (treeData) => {
    try {
      let url = `${API_URL}/trees`;
      let method = 'POST';

      if (editingTree) {
        url = `${API_URL}/trees/${editingTree._id}`;
        method = 'PUT';
      }

      console.log('Saving tree:', treeData);
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(treeData)
      });

      const data = await res.json().catch((err) => {
        console.error('JSON parse error:', err);
        return {};
      });

      console.log('Response:', { ok: res.ok, status: res.status, data });

      if (!res.ok) {
        throw new Error(data.message || 'Kaydetme başarısız.');
      }

      if (editingTree) {
        setTrees((prev) =>
          prev.map((t) => (t._id === data._id ? data : t))
        );
      } else {
        setTrees((prev) => [...prev, data]);
      }

      setShowForm(false);
      setEditingTree(null);
    } catch (err) {
      console.error('Save error:', err);
      alert(err.message);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTree(null);
  };

  const closeDetail = () => {
    setSelectedTree(null);
  };

  // Filtreleme ve sıralama işlemleri
  const getFilteredAndSortedTrees = () => {
    let filtered = [...trees];

    // Kategori filtresi
    // Kategori filtresi
    if (filterCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.name.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr'))
      );
    }

    // Sıralama
    filtered.sort((a, b) => {
      // Önce sayısı sıfır olanları sona at
      const aIsZero = (a.count || 0) === 0;
      const bIsZero = (b.count || 0) === 0;

      if (aIsZero && !bIsZero) return 1;
      if (!aIsZero && bIsZero) return -1;

      // Her ikisi de sıfır veya her ikisi de sıfır değilse normal sıralama
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'tr');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'tr');
        case 'date-new':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'date-old':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'category':
          return a.category.localeCompare(b.category, 'tr');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredTrees = getFilteredAndSortedTrees();

  return (
    <div>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <h2>Ağaçlar</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <label style={{ fontWeight: 'bold' }}>Ara:</label>
          <input
            type="text"
            placeholder="İsim ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="settings-select"
            style={{ width: '120px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <label style={{ fontWeight: 'bold' }}>Kategori:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="settings-select"
          >
            <option value="all">Tümü</option>
            {Object.entries(TREE_CATEGORY_LABELS)
              .filter(([key]) => trees.some(t => t.category === key))
              .map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))
            }
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <label style={{ fontWeight: 'bold' }}>Sırala:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            class="settings-select" >
            <option value="name-asc">İsim (A-Z)</option>
            <option value="name-desc">İsim (Z-A)</option>
            <option value="date-new">Tarih (Yeni-Eski)</option>
            <option value="date-old">Tarih (Eski-Yeni)</option>
            <option value="category">Kategoriye Göre</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#666', marginRight: 'auto' }}>
          {filteredTrees.reduce((sum, t) => sum + (t.count || 0), 0)} ağaç
        </div>

        <button className="btn primary" onClick={handleCreate}>
          + Yeni Ağaç
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className={viewMode === 'list' ? 'items-list' : 'cards-grid'}>
        {filteredTrees.map((tree) => {
          const totalTasks = tree.maintenance?.length || 0;
          const doneTasks =
            tree.maintenance?.filter((m) => m.completed).length || 0;
          const completion = totalTasks
            ? Math.round((doneTasks / totalTasks) * 100)
            : 0;

          const isZeroCount = (tree.count || 0) === 0;

          return (
            <div
              key={tree._id}
              className={viewMode === 'list' ? 'item-row' : 'tree-card'}
              onClick={() => setSelectedTree(tree)}
              style={{ opacity: isZeroCount ? 0.5 : 1 }}
            >
              <div className="tree-card-image-wrapper">
                <img
                  src={`${BASE_URL}${tree.imageUrl || '/uploads/noimage.jpg'
                    }`}
                  alt={tree.name}
                  className="tree-card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `${BASE_URL}/uploads/noimage.jpg`;
                  }}
                />
              </div>

              <div className={viewMode === 'list' ? 'tree-card-body tree-card-body-list' : 'tree-card-body'}>
                <div className="tree-card-header-row">
                  <h3>{tree.name}</h3>

                  <div className="header-right-badges">
                    {totalTasks > 0 && (
                      <span
                        className={
                          'tree-progress-pill ' +
                          (completion === 100
                            ? 'tree-progress-pill-done'
                            : '')
                        }
                      >
                        {doneTasks}/{totalTasks} • %{completion}
                      </span>
                    )}

                    {viewMode === 'list' && tree.maintenance && tree.maintenance.length > 0 && (
                      <span className="tree-chip maintenance-chip-inline">
                        📅 {tree.maintenance.length} ay
                      </span>
                    )}
                  </div>
                </div>

                <div className="tree-card-meta-row">
                  <span className="tree-chip">Adet: {tree.count}</span>
                  <span className="tree-chip">


                    {tree.category === 'meyve'
                      ? 'Meyve Ağacı'
                      : tree.category === 'sus'
                        ? 'Süs Ağacı'
                        : tree.category === 'igne-yaprakli'
                          ? 'İğne Yapraklı'
                          : tree.category === 'diger'
                            ? 'Diğer'
                            : 'Genel'}
                  </span>

                </div>

                {tree.notes && (
                  <p className="tree-card-note">{tree.notes}</p>
                )}
              </div>

              {viewMode === 'list' && tree.maintenance && tree.maintenance.length > 0 && (() => {
                const currentMonth = new Date().getMonth() + 1; // 1-12 arası
                const upcomingMonths = tree.maintenance.filter(m => m.month >= currentMonth).slice(0, 3);
                const remaining = tree.maintenance.filter(m => m.month >= currentMonth).length - 3;

                return upcomingMonths.length > 0 && (
                  <div className="list-maintenance-summary list-maintenance-sidebar">
                    {upcomingMonths.map((m) => (
                      <div
                        key={m._id || m.month}
                        className="maintenance-preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMaintenanceToggle(tree._id, m.month, m.completed);
                        }}
                      >
                        <span className="month-badge">{monthNames[m.month - 1]}</span>
                        <span className="task-preview">{m.tasks?.substring(0, 40)}{m.tasks?.length > 40 ? '...' : ''}</span>
                        {m.completed && <span className="completed-badge">✓</span>}
                      </div>
                    ))}
                    {remaining > 0 && (
                      <div className="more-tasks">+{remaining} ay daha</div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {!loading && trees.length === 0 && (
        <p>Henüz ağaç eklenmemiş. “Yeni Ağaç” ile başlayabilirsin.</p>
      )}

      {selectedTree && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedTree.name}</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>Adet:</strong>
              <button
                onClick={() => {
                  const newCount = Math.max(0, (selectedTree.count || 0) - 1);
                  handleQuickUpdate(selectedTree, newCount);
                }}
                style={{
                  padding: '5px 10px',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  background: '#f8f9fa',
                  borderRadius: '4px'
                }}
              >
                -
              </button>
              <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                {selectedTree.count}
              </span>
              <button
                onClick={() => {
                  const newCount = (selectedTree.count || 0) + 1;
                  handleQuickUpdate(selectedTree, newCount);
                }}
                style={{
                  padding: '5px 10px',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  background: '#f8f9fa',
                  borderRadius: '4px'
                }}
              >
                +
              </button>
            </p>
            <p>
              <strong>Kategori:</strong>{' '}
              {selectedTree.category || 'Genel'}
            </p>
            {selectedTree.notes && (
              <p>
                <strong>Not:</strong> {selectedTree.notes}
              </p>
            )}

            {(() => {
              const currentMonth = new Date().getMonth() + 1;
              const thisMonth = selectedTree.maintenance?.find(
                (m) => m.month === currentMonth
              );

              return (
                <div className="this-month-box">
                  <h4>
                    Bu Ay Yapılacaklar ({monthNames[currentMonth - 1]})
                  </h4>
                  {thisMonth ? (
                    <p>
                      {thisMonth.tasks}{' '}
                      {thisMonth.completed && (
                        <span className="this-month-done">
                          ✅ Tamamlandı
                        </span>
                      )}
                    </p>
                  ) : (
                    <p>Bu ay için bakım planı yok.</p>
                  )}
                </div>
              );
            })()}

            <h3>Aylık Bakım Planı</h3>
            {selectedTree.maintenance &&
              selectedTree.maintenance.length > 0 ? (
              <div className="maintenance-table-wrapper">
                <table className="maintenance-table">
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>Ay</th>
                      <th style={{ width: '100px' }}>Kategori</th>
                      <th>Bakım Görevleri</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTree.maintenance
                      .sort((a, b) => a.month - b.month)
                      .map((m) => {
                        const text = m.tasks || 'Görev girilmemiş';
                        const isImportant = /budama|ilaç|sulama|gübre/i.test(text);
                        const tag = classifyMaintenanceTask(text);

                        return (
                          <tr
                            key={m._id || `${selectedTree._id}-${m.month}`}
                            className={
                              'maintenance-table-row ' +
                              (isImportant ? 'important ' : '') +
                              (m.completed ? 'completed ' : '')
                            }
                            onClick={() =>
                              handleMaintenanceToggle(
                                selectedTree._id,
                                m.month,
                                m.completed
                              )
                            }
                          >
                            <td>
                              <span className="maintenance-month-chip">
                                {monthNames[m.month - 1]}
                              </span>
                            </td>
                            <td>
                              <span className={`maintenance-tag ${tag.className}`}>
                                {tag.label}
                              </span>
                            </td>
                            <td className="maintenance-task-cell">{text}</td>
                            <td style={{ textAlign: 'center' }}>
                              {m.completed ? (
                                <span className="maintenance-check">✅</span>
                              ) : (
                                <span className="maintenance-pending">⏳</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="maintenance-empty">Bakım planı girilmemiş.</p>
            )}

            <div className="modal-actions">
              <button
                className="btn danger"
                onClick={() => handleDelete(selectedTree._id)}
              >
                Sil
              </button>
              <button
                className="btn"
                onClick={() => handleEdit(selectedTree)}
              >
                Düzenle
              </button>
              <button className="btn" onClick={closeDetail}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div
            className="modal modal-form"
            onClick={(e) => e.stopPropagation()}
          >
            <TreeForm
              initialTree={editingTree}
              onSave={handleSave}
              onCancel={closeForm}
              token={token}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------- HATIRLATMALAR -------------------- */

function Reminders({ token, month, onChangeMonth }) {
  const [treeReminders, setTreeReminders] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState('');

  const [vegReminders, setVegReminders] = useState([]);
  const [vegLoading, setVegLoading] = useState(false);
  const [vegError, setVegError] = useState('');

  const [treeEmailSending, setTreeEmailSending] = useState(false);
  const [treeEmailMessage, setTreeEmailMessage] = useState('');
  const [treePushSending, setTreePushSending] = useState(false);
  const [treePushMessage, setTreePushMessage] = useState('');

  const [vegEmailSending, setVegEmailSending] = useState(false);
  const [vegEmailMessage, setVegEmailMessage] = useState('');
  const [vegPushSending, setVegPushSending] = useState(false);
  const [vegPushMessage, setVegPushMessage] = useState('');

  const [treeOnlyImportant, setTreeOnlyImportant] = useState(() => {
    try {
      const s = loadSettings();
      return !!s.reminders.treeOnlyImportantDefault;
    } catch {
      return false;
    }
  });
  const [vegOnlyImportant, setVegOnlyImportant] = useState(() => {
    try {
      const s = loadSettings();
      return !!s.reminders.vegOnlyImportantDefault;
    } catch {
      return false;
    }
  });
  const [treeComboSending, setTreeComboSending] = useState(false);
  const [vegComboSending, setVegComboSending] = useState(false);

  // GEÇMİŞ (HISTORY) STATE
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false); // Varsayılan kapalı

  // Bildirim kutuları görünürlüğü
  const [treeNotifyVisible, setTreeNotifyVisible] = useState(false);
  const [vegNotifyVisible, setVegNotifyVisible] = useState(false);

  const [suggestionUpdatingId, setSuggestionUpdatingId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState('');
  const [suggestionsVisible, setSuggestionsVisible] = useState(() => {
    try {
      const s = loadSettings();
      return !!s.reminders.autoOpenSuggestions;
    } catch {
      return false;
    }
  }); // 🆕


  const fetchSuggestions = useCallback(async () => {
    setSuggestionsLoading(true);
    setSuggestionsError('');
    try {
      const res = await fetch(`${API_URL}/recommendations?month=${month}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Öneriler alınamadı.');
      }

      setSuggestions(data.items || []);
      setSuggestionsVisible(true);
    } catch (err) {
      setSuggestionsError(err.message || 'Öneriler alınırken hata oluştu.');
    } finally {
      setSuggestionsLoading(false);
    }
  }, [month, token]);





  const fetchTreeReminders = useCallback(async (m) => {
    setTreeLoading(true);
    setTreeError('');
    try {
      const res = await fetch(`${API_URL}/reminders/${m}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Ağaç hatırlatmaları alınamadı.');
      }
      setTreeReminders(data.reminders || []);
    } catch (err) {
      setTreeError(err.message);
    } finally {
      setTreeLoading(false);
    }
  }, [token]);

  const fetchVegReminders = useCallback(async (m) => {
    setVegLoading(true);
    setVegError('');
    try {
      const res = await fetch(`${API_URL}/veg-reminders/${m}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Sebze hatırlatmaları alınamadı.');
      }
      setVegReminders(data.reminders || []);
    } catch (err) {
      setVegError(err.message);
    } finally {
      setVegLoading(false);
    }
  }, [token]);

  // GEÇMİŞ GETİR
  const fetchHistory = useCallback(async (m) => {
    setHistoryLoading(true);
    console.log(`[DEBUG] Fetching history for month: ${m}`);
    try {
      const res = await fetch(`${API_URL}/reminders/history/${m}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`[DEBUG] History response status: ${res.status}`);
      const data = await res.json().catch(() => ({}));
      console.log(`[DEBUG] History data:`, data);

      if (res.ok && data.history) {
        setHistoryData(data.history);
      }
    } catch (err) {
      console.error('Geçmiş hatası:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [token]);

  // GEÇMİŞ: TÜM AĞAÇLARI GERİ AL
  const handleUndoAllTrees = async () => {
    // Sadece 'tree' olanları filtrele
    const treesToUndo = historyData.filter((item) => item.type === 'tree');
    if (treesToUndo.length === 0) return;

    if (!window.confirm(`${monthNames[month - 1]} ayı geçmişinden TÜM AĞAÇLARI geri almak istiyor musunuz?`)) {
      return;
    }

    setHistoryLoading(true);
    try {
      // Paralel olarak toggle et
      await Promise.all(
        treesToUndo.map(item =>
          fetch(`${API_URL}/trees/${item.id}/maintenance/${month}/toggle`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      // Listeleri yenile
      await fetchHistory(month);
      fetchTreeReminders(month);
    } catch (err) {
      console.error('Tümünü geri al (tree) hatası:', err);
      alert('İşlem sırasında hata oluştu.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // GEÇMİŞ: TÜM SEBZELERİ GERİ AL
  const handleUndoAllVeggies = async () => {
    // Sadece 'vegetable' olanları filtrele
    const vegToUndo = historyData.filter((item) => item.type === 'vegetable');
    if (vegToUndo.length === 0) return;

    if (!window.confirm(`${monthNames[month - 1]} ayı geçmişinden TÜM SEBZELERİ geri almak istiyor musunuz?`)) {
      return;
    }

    setHistoryLoading(true);
    try {
      // Paralel olarak toggle et
      await Promise.all(
        vegToUndo.map(item =>
          fetch(`${API_URL}/vegetables/${item.id}/maintenance/${month}/toggle`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      // Listeleri yenile
      await fetchHistory(month);
      fetchVegReminders(month);
    } catch (err) {
      console.error('Tümünü geri al (veg) hatası:', err);
      alert('İşlem sırasında hata oluştu.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // GEÇMİŞ TOGGLE (Tamamlanmadı işaretle)
  const handleHistoryToggle = async (item) => {
    const endpoint = item.type === 'tree' ? 'trees' : 'vegetables';
    const id = item.id;

    if (!window.confirm(`${item.name} için bu görevi "Tamamlanmadı" olarak geri almak istiyor musun?`)) {
      return;
    }

    try {
      await fetch(`${API_URL}/${endpoint}/${id}/maintenance/${month}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      // Listeleri yenile
      await fetchHistory(month);
      fetchTreeReminders(month);
      fetchVegReminders(month);
    } catch (err) {
      console.error('History toggle hatası:', err);
      alert('İşlem başarısız.');
    }
  };

  useEffect(() => {
    fetchTreeReminders(month);
    fetchVegReminders(month);

    // Geçmiş görünürse onu da çek
    if (historyVisible) {
      fetchHistory(month);
    }

    // Ayarlar: otomatik bakım önerisi paneli açıksa, önerileri de getir
    try {
      const s = loadSettings();
      if (s.reminders.autoOpenSuggestions) {
        setSuggestionsVisible(true);
        fetchSuggestions();
      }
    } catch (e) {
      // sessiz geç
    }
  }, [month, historyVisible, fetchTreeReminders, fetchVegReminders, fetchHistory, fetchSuggestions]);
  const sendTreeCombinedReminders = async () => {
    setTreeComboSending(true);
    // Eski mesajları temizleyelim ki yeni sonuç net görünsün
    setTreeEmailMessage('');
    setTreePushMessage('');

    try {
      const payload = { month, onlyImportant: treeOnlyImportant };

      const [emailRes, pushRes] = await Promise.all([
        fetch(`${API_URL}/reminders/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }),
        fetch(`${API_URL}/push/send-reminders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
      ]);

      const emailData = await emailRes.json().catch(() => ({}));
      const pushData = await pushRes.json().catch(() => ({}));

      if (!emailRes.ok) {
        throw new Error(emailData.message || 'E-posta gönderilemedi.');
      }
      if (!pushRes.ok) {
        throw new Error(pushData.message || 'Push bildirimi gönderilemedi.');
      }

      setTreeEmailMessage(emailData.message || 'E-posta hatırlatması gönderildi.');
      setTreePushMessage(pushData.message || 'Push bildirimi gönderildi.');
    } catch (err) {
      setTreeEmailMessage(`Hata: ${err.message}`);
    } finally {
      setTreeComboSending(false);
    }
  };

  const sendTreeEmailReminders = async () => {
    setTreeEmailSending(true);
    setTreeEmailMessage('');
    try {
      const res = await fetch(`${API_URL}/reminders/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ month, onlyImportant: treeOnlyImportant })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'E-posta gönderilemedi.');
      }
      setTreeEmailMessage(data.message || 'E-posta gönderildi.');
    } catch (err) {
      setTreeEmailMessage(err.message);
    } finally {
      setTreeEmailSending(false);
    }
  };

  const sendTreePushReminders = async () => {
    setTreePushSending(true);
    setTreePushMessage('');
    try {
      const res = await fetch(`${API_URL}/push/send-reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ month, onlyImportant: treeOnlyImportant })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Push bildirimi gönderilemedi.');
      }
      setTreePushMessage(data.message || 'Push bildirimi gönderildi.');
    } catch (err) {
      console.error('Ağaç push hatırlatma hatası:', err);
      setTreePushMessage(err.message);
    } finally {
      setTreePushSending(false);
    }
  };
  const sendVegCombinedReminders = async () => {
    setVegComboSending(true);
    setVegEmailMessage('');
    setVegPushMessage('');

    try {
      const payload = { month, onlyImportant: vegOnlyImportant };

      const [emailRes, pushRes] = await Promise.all([
        fetch(`${API_URL}/veg-reminders/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }),
        fetch(`${API_URL}/push/send-veg-reminders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
      ]);

      const emailData = await emailRes.json().catch(() => ({}));
      const pushData = await pushRes.json().catch(() => ({}));

      if (!emailRes.ok) {
        throw new Error(emailData.message || 'Sebze e-postası gönderilemedi.');
      }
      if (!pushRes.ok) {
        throw new Error(pushData.message || 'Sebze push bildirimi gönderilemedi.');
      }

      setVegEmailMessage(emailData.message || 'Sebze e-posta hatırlatması gönderildi.');
      setVegPushMessage(pushData.message || 'Sebze push bildirimi gönderildi.');
    } catch (err) {
      setVegEmailMessage(`Hata: ${err.message}`);
    } finally {
      setVegComboSending(false);
    }
  };

  const sendVegEmailReminders = async () => {
    setVegEmailSending(true);
    setVegEmailMessage('');
    try {
      const res = await fetch(`${API_URL}/veg-reminders/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ month, onlyImportant: vegOnlyImportant })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Sebze e-postası gönderilemedi.');
      }
      setVegEmailMessage(data.message || 'Sebze e-postası gönderildi.');
    } catch (err) {
      setVegEmailMessage(err.message);
    } finally {
      setVegEmailSending(false);
    }
  };

  const sendVegPushReminders = async () => {
    setVegPushSending(true);
    setVegPushMessage('');
    try {
      const res = await fetch(`${API_URL}/push/send-veg-reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ month, onlyImportant: vegOnlyImportant })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.message || 'Sebze push bildirimi gönderilemedi.'
        );
      }
      setVegPushMessage(data.message || 'Sebze push bildirimi gönderildi.');
    } catch (err) {
      console.error('Sebze push hatırlatma hatası:', err);
      setVegPushMessage(err.message);
    } finally {
      setVegPushSending(false);
    }
  };

  const handleTreeCardClick = async (treeId) => {
    const ok = window.confirm(
      `${monthNames[month - 1]} ayı için bu ağacın bakımlarını "tamamlandı" işaretlemek istiyor musun?`
    );
    if (!ok) return;

    try {
      const res = await fetch(
        `${API_URL}/trees/${treeId}/maintenance/${month}/toggle`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'Bakım durumu güncellenemedi.');
        return;
      }
      fetchTreeReminders(month);
      if (historyVisible) fetchHistory(month);
    } catch (err) {
      console.error('Ağaç kart tamamla hatası:', err);
      alert('Sunucu hatası.');
    }
  };
  const handleSuggestionComplete = async (s) => {
    const confirmText = `"${s.name}" için ${s.month}. ay görevi tamamlandı olarak işaretlensin mi?`;
    if (!window.confirm(confirmText)) return;

    setSuggestionUpdatingId(s.id);
    try {
      if (s.kind === 'tree' && s.treeId) {
        const res = await fetch(
          `${API_URL}/trees/${s.treeId}/maintenance/${s.month}/toggle`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Ağaç bakımı güncellenemedi.');
        // ilgili hatırlatma listelerini tazele
        await fetchTreeReminders(month);
      } else if (s.kind === 'vegetable' && s.vegetableId) {
        const res = await fetch(
          `${API_URL}/vegetables/${s.vegetableId}/maintenance/${s.month}/toggle`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Sebze bakımı güncellenemedi.');
        await fetchVegReminders(month);
      }

      // Öneri listesini de güncelle (tamamlanan artık görünmesin)
      await fetchSuggestions();
      if (historyVisible) fetchHistory(month);
    } catch (err) {
      console.error('Öneri tamamla hatası:', err);
      alert(err.message || 'Görev tamamlanamadı.');
    } finally {
      setSuggestionUpdatingId(null);
    }
  };

  const handleVegCardClick = async (vegId) => {
    const ok = window.confirm(
      `${monthNames[month - 1]} ayı için bu sebzenin bakımlarını "tamamlandı" işaretlemek istiyor musun?`
    );
    if (!ok) return;

    try {
      const res = await fetch(
        `${API_URL}/vegetables/${vegId}/maintenance/${month}/toggle`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'Sebze bakım durumu güncellenemedi.');
        return;
      }
      fetchVegReminders(month);
      if (historyVisible) fetchHistory(month);
    } catch (err) {
      console.error('Sebze kart tamamla hatası:', err);
      alert('Sunucu hatası.');
    }
  };

  const handleCompleteAllTrees = async () => {
    if (treeReminders.length === 0) return;
    const ok = window.confirm(
      `${monthNames[month - 1]} ayı için listedeki TÜM ağaç bakımlarını "tamamlandı" olarak işaretlemek istediğinize emin misiniz?`
    );
    if (!ok) return;

    setTreeLoading(true);
    try {
      // Tüm ağaç hatırlatmalarını paralel olarak güncelle
      await Promise.all(
        treeReminders.map((item) =>
          fetch(`${API_URL}/trees/${item.treeId}/maintenance/${month}/toggle`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
        )
      );
      // Listeyi yenile
      await fetchTreeReminders(month);
      if (historyVisible) fetchHistory(month);
    } catch (err) {
      console.error('Toplu ağaç tamamlama hatası:', err);
      alert('Bazı görevler tamamlanırken hata oluştu.');
    } finally {
      setTreeLoading(false);
    }
  };

  const handleCompleteAllVeggies = async () => {
    if (vegReminders.length === 0) return;
    const ok = window.confirm(
      `${monthNames[month - 1]} ayı için listedeki TÜM sebze bakımlarını "tamamlandı" olarak işaretlemek istediğinize emin misiniz?`
    );
    if (!ok) return;

    setVegLoading(true);
    try {
      // Tüm sebze hatırlatmalarını paralel olarak güncelle
      await Promise.all(
        vegReminders.map((item) =>
          fetch(
            `${API_URL}/vegetables/${item.vegetableId}/maintenance/${month}/toggle`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          )
        )
      );
      // Listeyi yenile
      await fetchVegReminders(month);
      if (historyVisible) fetchHistory(month);
    } catch (err) {
      console.error('Toplu sebze tamamlama hatası:', err);
      alert('Bazı görevler tamamlanırken hata oluştu.');
    } finally {
      setVegLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Bakım Hatırlatmaları</h2>
        <select
          value={month}
          onChange={(e) => onChangeMonth(Number(e.target.value))}
          className="month-select"
        >
          {monthNames.map((name, idx) => (
            <option key={name} value={idx + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {/* Otomatik bakım öneri sistemi */}
      <div className="card">
        <div className="section-header">
          <h3>Otomatik Bakım Önerileri</h3>

          <div className="section-actions">
            <button
              className="btn"
              type="button"
              onClick={fetchSuggestions}
              disabled={suggestionsLoading}
            >
              {suggestionsLoading ? 'Öneriler yükleniyor...' : 'Önerileri getir'}
            </button>

            {suggestions.length > 0 && (
              <button
                type="button"
                className="btn secondary-btn"
                onClick={() => setSuggestionsVisible((v) => !v)}
              >
                {suggestionsVisible ? 'Önerileri gizle' : 'Önerileri göster'}
              </button>
            )}
          </div>
        </div>

        {suggestionsError && (
          <p className="error-text" style={{ marginTop: 4 }}>
            {suggestionsError}
          </p>
        )}

        {!suggestionsLoading &&
          suggestionsVisible &&
          suggestions.length === 0 &&
          !suggestionsError && (
            <p className="muted" style={{ marginTop: 4 }}>
              Henüz öneri yok. Ay seç ve &quot;Önerileri getir&quot; düğmesine tıkla.
            </p>
          )}

        {suggestionsVisible && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s) => (
              <li
                key={s.id}
                className={
                  'suggestion-item ' +
                  (s.important ? 'important ' : '') +
                  (s.category === 'geçmiş' ? 'suggestion-past ' : '') +
                  (s.category === 'gelecek' ? 'suggestion-future ' : '')
                }
              >
                <div className="suggestion-main">
                  <span className="suggestion-kind-chip">
                    {s.kind === 'tree' ? '🌳 Ağaç' : '🥬 Sebze'}
                  </span>
                  <span className="suggestion-name">{s.name}</span>
                  <span className="suggestion-month">{s.month}. ay</span>
                  {s.important && (
                    <span className="suggestion-important-chip">ÖNEMLİ</span>
                  )}
                </div>

                <div className="suggestion-task-row">
                  <span className="suggestion-task-type">{s.taskType}</span>
                  <span className="suggestion-task-text">{s.task}</span>
                </div>

                <div className="suggestion-footer-row">
                  <div className="suggestion-category-row">
                    {s.category === 'geçmiş' && <span>⏰ Geçmiş görev</span>}
                    {s.category === 'bu-ay' && (
                      <span>📌 Bu ay yapılması önerilir</span>
                    )}
                    {s.category === 'gelecek' && (
                      <span>🔮 Gelecek ay için hazırlık</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn suggestion-complete-btn"
                    onClick={() => handleSuggestionComplete(s)}
                    disabled={suggestionUpdatingId === s.id}
                  >
                    {suggestionUpdatingId === s.id
                      ? 'İşaretleniyor...'
                      : 'TAMAMLANDI'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>


      {/* Ağaç bildirim butonları */}
      {/* Ağaç bildirim butonları */}
      <div className="card">
        <div
          className="section-header"
          onClick={() => setTreeNotifyVisible(!treeNotifyVisible)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: 0, marginRight: '10px' }}>{monthNames[month - 1]} ayı için bildirim gönder (Ağaçlar)</h3>
            <span style={{ fontSize: '1.2rem' }}>{treeNotifyVisible ? '▼' : '▶'}</span>
          </div>
          {treeReminders.length > 0 && treeNotifyVisible && (
            <button
              className="btn primary"
              onClick={(e) => {
                e.stopPropagation();
                handleCompleteAllTrees();
              }}
              style={{ marginLeft: 'auto', backgroundColor: '#2e7d32' }}
            >
              ✓ Tümünü Tamamla
            </button>
          )}
        </div>

        {treeNotifyVisible && (
          <>
            <div className="notify-row">
              <button
                className="btn"
                onClick={sendTreeEmailReminders}
                disabled={treeEmailSending}
              >
                {treeEmailSending
                  ? 'E-posta gönderiliyor...'
                  : 'E-posta ile hatırlat'}
              </button>
              <button
                className="btn"
                onClick={sendTreePushReminders}
                disabled={treePushSending}
              >
                {treePushSending
                  ? 'Push bildirimi gönderiliyor...'
                  : 'Push bildirimi gönder'}
              </button>
              <div style={{ marginTop: '8px' }}>
                <button
                  className="btn"
                  onClick={sendTreeCombinedReminders}
                  disabled={treeComboSending}
                >
                  {treeComboSending
                    ? 'E-posta + Push gönderiliyor...'
                    : 'E-posta + Push birlikte gönder'}
                </button>
              </div>


              {/* 🔘 sadece önemli görevler kuralı */}
              <label
                className="muted"
                style={{ display: 'block', marginTop: '6px' }}
              >
                <input
                  type="checkbox"
                  checked={treeOnlyImportant}
                  onChange={(e) => setTreeOnlyImportant(e.target.checked)}
                  style={{ marginRight: '6px' }}
                />
                Sadece <strong>ÖNEMLİ</strong> görevler için bildir (budama / ilaç / gübre)
              </label>

              {(treeEmailMessage || treePushMessage) && (
                <p className="muted">
                  {treeEmailMessage}{' '}
                  {treePushMessage && ` / ${treePushMessage}`}
                </p>
              )}
            </div>

            <h3 style={{ marginTop: '20px' }}>Ağaçlar</h3>
            {treeLoading && <p>Yükleniyor...</p>}
            {treeError && <p className="error-text">{treeError}</p>}
            {!treeLoading && treeReminders.length === 0 && (
              <p>{monthNames[month - 1]} ayı için planlanmış ağaç bakımı yok.</p>
            )}

            <div className="reminders-grid">
              {treeReminders.map((item) => (
                <div
                  key={item.treeId}
                  className="card reminder-card-tree"
                  onClick={() => handleTreeCardClick(item.treeId)}
                >
                  <div className="card-header-row">
                    <h3>{item.name}</h3>
                    <span className="badge">Adet: {item.count}</span>
                  </div>
                  <ul className="maintenance-list">
                    {item.tasks.map((t, idx) => {
                      const tag = classifyMaintenanceTask(t || '');
                      const isImportant = /budama|ilaç|sulama|gübre/i.test(t || '');

                      return (
                        <li
                          key={idx}
                          className={
                            'maintenance-item ' + (isImportant ? 'important ' : '')
                          }
                        >
                          <span className={`maintenance-tag ${tag.className}`}>
                            {tag.label}
                          </span>
                          <span className="maintenance-task-inline">{t}</span>
                        </li>
                      );
                    })}
                  </ul>

                </div>
              ))}
            </div>
          </>
        )}
      </div>



      <hr style={{ margin: '24px 0' }} />

      {/* Sebze bildirim butonları */}
      <div className="card">
        <div
          className="section-header"
          onClick={() => setVegNotifyVisible(!vegNotifyVisible)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: 0, marginRight: '10px' }}>{monthNames[month - 1]} ayı için bildirim gönder (Sebzeler)</h3>
            <span style={{ fontSize: '1.2rem' }}>{vegNotifyVisible ? '▼' : '▶'}</span>
          </div>
          {vegReminders.length > 0 && vegNotifyVisible && (
            <button
              className="btn primary"
              onClick={(e) => {
                e.stopPropagation();
                handleCompleteAllVeggies();
              }}
              style={{ marginLeft: 'auto', backgroundColor: '#2e7d32' }}
            >
              ✓ Tümünü Tamamla
            </button>
          )}
        </div>

        {vegNotifyVisible && (
          <>
            <div className="notify-row">
              <button
                className="btn"
                onClick={sendVegEmailReminders}
                disabled={vegEmailSending}
              >
                {vegEmailSending
                  ? 'Sebze e-postası gönderiliyor...'
                  : 'Sebzeler için e-posta'}
              </button>
              <button
                className="btn"
                onClick={sendVegPushReminders}
                disabled={vegPushSending}
              >
                {vegPushSending
                  ? 'Sebze push bildirimi gönderiliyor...'
                  : 'Sebzeler için push'}
              </button>
              {/* 🆕 Karma buton */}
              <div style={{ marginTop: '8px' }}>
                <button
                  className="btn"
                  onClick={sendVegCombinedReminders}
                  disabled={vegComboSending}
                >
                  {vegComboSending
                    ? 'E-posta + Push gönderiliyor...'
                    : 'E-posta + Push birlikte gönder'}
                </button>
              </div>
              {/* 🆕 Sebze kuralı */}
              <label className="muted" style={{ display: 'block', marginTop: '6px' }}>
                <input
                  type="checkbox"
                  checked={vegOnlyImportant}
                  onChange={(e) => setVegOnlyImportant(e.target.checked)}
                  style={{ marginRight: '6px' }}
                />
                Sadece <strong>ÖNEMLİ</strong> sebze görevleri için bildir (budama / ilaç / gübre)
              </label>

              {(vegEmailMessage || vegPushMessage) && (
                <p className="muted">
                  {vegEmailMessage}{' '}
                  {vegPushMessage && ` / ${vegPushMessage}`}
                </p>
              )}
            </div>

            <h3 style={{ marginTop: '20px' }}>Sebzeler</h3>
            {vegLoading && <p>Yükleniyor...</p>}
            {vegError && <p className="error-text">{vegError}</p>}
            {!vegLoading && vegReminders.length === 0 && (
              <p>{monthNames[month - 1]} ayı için planlanmış sebze bakımı yok.</p>
            )}

            <div className="reminders-grid">
              {vegReminders.map((item) => (
                <div
                  key={item.vegetableId}
                  className="card reminder-card-tree"
                  onClick={() => handleVegCardClick(item.vegetableId)}
                >
                  <div className="card-header-row">
                    <h3>{item.name}</h3>
                    <span className="badge">Adet: {item.count}</span>
                  </div>
                  <ul className="maintenance-list">
                    {item.tasks.map((t, idx) => {
                      const tag = classifyMaintenanceTask(t || '');
                      const isImportant = /budama|ilaç|sulama|gübre/i.test(t || '');

                      return (
                        <li
                          key={idx}
                          className={
                            'maintenance-item ' + (isImportant ? 'important ' : '')
                          }
                        >
                          <span className={`maintenance-tag ${tag.className}`}>
                            {tag.label}
                          </span>
                          <span className="maintenance-task-inline">{t}</span>
                        </li>
                      );
                    })}
                  </ul>

                </div>
              ))}
            </div>
          </>
        )}

      </div>



      <hr style={{ margin: '32px 0' }} />

      {/* GEÇMİŞ / TAMAMLANAN GÖREVLER BÖLÜMÜ */}
      <div className="card" style={{ backgroundColor: '#f9f9f9', border: '1px dashed #ccc' }}>
        <div className="section-header" style={{ cursor: 'pointer' }} onClick={() => {
          const next = !historyVisible;
          setHistoryVisible(next);
          if (next) fetchHistory(month);
        }}>
          <h3>AYLIK GEÇMİŞ BAKIM LİSTESİ (Ağaç + Sebze)</h3>
          <button
            type="button"
            className="btn"
            style={{ fontSize: '0.9rem', padding: '4px 12px' }}
            onClick={(e) => {
              e.stopPropagation();
              const next = !historyVisible;
              setHistoryVisible(next);
              if (next) fetchHistory(month);
            }}
          >
            {historyVisible ? 'Listeyi Gizle' : 'Listeyi Getir'}
          </button>
        </div>

        {historyVisible && (
          <div style={{ marginTop: '16px' }}>

            {historyLoading && <p>Yükleniyor...</p>}
            {!historyLoading && historyData.length === 0 && (
              <p className="muted">Bu ayda henüz tamamlanan bir görev yok.</p>
            )}

            {historyData.length > 0 && (
              <>


                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  {historyData.some((i) => i.type === 'tree') && (
                    <button
                      className="btn small"
                      onClick={handleUndoAllTrees}
                      disabled={historyLoading}
                      style={{ backgroundColor: '#795548', color: 'white' }}
                    >
                      🌳 Ağaçları Geri Al
                    </button>
                  )}
                  {historyData.some((i) => i.type === 'vegetable') && (
                    <button
                      className="btn small"
                      onClick={handleUndoAllVeggies}
                      disabled={historyLoading}
                      style={{ backgroundColor: '#2e7d32', color: 'white' }}
                    >
                      🥬 Sebzeleri Geri Al
                    </button>
                  )}
                </div>



                <div className="items-list">
                  {historyData.map((item, idx) => (
                    <div key={idx} className="item-row" style={{ opacity: 0.8 }}>
                      <div>
                        {item.type === 'tree' ? '🌳' : '🥬'} <strong>{item.name}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '4px' }}>
                          {item.tasks.join(', ')}
                        </div>
                      </div>
                      <button
                        className="btn small"
                        onClick={() => handleHistoryToggle(item)}
                        style={{ marginLeft: 'auto', backgroundColor: '#9e9e9e', color: 'white' }}
                      >
                        Geri Al ↺
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

    </div >
  );
}

/* -------------------- TAKVİM -------------------- */

/* -------------------- TAKVİM -------------------- */

function CalendarView({ token, onSelectMonth }) {
  const [trees, setTrees] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        const [resTrees, resVeg] = await Promise.all([
          fetch(`${API_URL}/trees`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_URL}/vegetables`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const dataTrees = await resTrees.json().catch(() => ([]));
        const dataVeg = await resVeg.json().catch(() => ([]));

        if (!resTrees.ok) {
          throw new Error(dataTrees.message || 'Ağaçlar alınamadı.');
        }
        if (!resVeg.ok) {
          throw new Error(dataVeg.message || 'Sebzeler alınamadı.');
        }

        setTrees(dataTrees);
        setVegetables(dataVeg);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const buildStats = (items) => {
    const base = monthNames.map((name, idx) => ({
      index: idx + 1,
      name,
      total: 0,
      done: 0
    }));

    items.forEach((item) => {
      // Adeti 0 olanları görev sayısına dahil etme
      if ((item.count || 0) === 0) return;

      (item.maintenance || []).forEach((m) => {
        if (m.month >= 1 && m.month <= 12) {
          base[m.month - 1].total += 1;
          if (m.completed) base[m.month - 1].done += 1;
        }
      });
    });

    return base.map((m) => ({
      ...m,
      percent: m.total === 0 ? 0 : Math.round((m.done / m.total) * 100)
    }));
  };

  const treeStats = buildStats(trees);
  const vegStats = buildStats(vegetables);

  // 🧩 Ağaç + sebze birleşik aylık özet
  const combinedStats = monthNames.map((name, idx) => {
    const t = treeStats[idx] || { total: 0, done: 0, percent: 0 };
    const v = vegStats[idx] || { total: 0, done: 0, percent: 0 };

    const total = t.total + v.total;
    const done = t.done + v.done;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    return {
      index: idx + 1,
      name,
      total,
      done,
      percent,
      tree: t,
      veg: v
    };
  });

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  const currentMonthIndex = new Date().getMonth() + 1;

  return (
    <div className="calendar-page">
      <div className="calendar-section">
        <h2>Yıllık Bakım Takvimi (Ağaç + Sebze)</h2>
        <p className="muted" style={{ marginBottom: '4px' }}>
          Her kartta ilgili ay için toplam bakım ilerlemesini ve
          ağaç / sebze kırılımını görebilirsin.
        </p>
        <p className="muted" style={{ fontSize: '0.8rem' }}>
          Kartlara tıklayınca o ayın detaylı hatırlatma ekranına geçersin.
        </p>

        <div className="calendar-grid">
          {combinedStats.map((m) => {
            const isCurrent = m.index === currentMonthIndex;
            const isEmpty = m.total === 0;

            return (
              <div
                key={m.index}
                className={
                  'month-card ' +
                  (isEmpty ? 'month-card-empty ' : '') +
                  (isCurrent ? 'month-card-current ' : '')
                }
                onClick={() => onSelectMonth(m.index)}
              >
                <div className="month-card-header">
                  <span className="month-card-name">{m.name}</span>
                  {isCurrent && (
                    <span className="month-card-badge">Bu ay</span>
                  )}
                </div>

                {isEmpty ? (
                  <p className="month-card-text">Planlı bakım yok.</p>
                ) : (
                  <>
                    <p className="month-card-text">
                      Toplam görev: {m.done}/{m.total}
                    </p>
                    <p className="month-card-subline">
                      🌳 {m.tree.done}/{m.tree.total} &nbsp;·&nbsp; 🥬{' '}
                      {m.veg.done}/{m.veg.total}
                    </p>
                    <div className="month-card-progress-bar">
                      <div
                        className="month-card-progress-fill"
                        style={{ width: `${m.percent}%` }}
                      />
                    </div>
                    <p className="month-card-percent">
                      %{m.percent} tamamlandı
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


/* -------------------- HOME (ANA SEKME) -------------------- */

function Home({ token }) {
  const [trees, setTrees] = useState([]);
  const [veggies, setVeggies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileInfo, setProfileInfo] = useState({
    gardenName: '',
    gardenSize: 0,
    experienceLevel: 'beginner'
  });
  const [showAllUrgentTasks, setShowAllUrgentTasks] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        const [resTrees, resVeg] = await Promise.all([
          fetch(`${API_URL}/trees`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_URL}/vegetables`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const dataTrees = await resTrees.json().catch(() => ([]));
        const dataVeg = await resVeg.json().catch(() => ([]));

        if (!resTrees.ok) {
          throw new Error(dataTrees.message || 'Ağaçlar alınamadı.');
        }
        if (!resVeg.ok) {
          throw new Error(dataVeg.message || 'Sebzeler alınamadı.');
        }

        setTrees(dataTrees);
        setVeggies(dataVeg);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  // Acil görevi tamamla
  const handleCompleteUrgentTask = async (task) => {
    // Onay uyarısı göster
    const confirmMessage = `${task.name} - ${task.task}\n\nBu görevi tamamlamak istediğinize emin misiniz?`;
    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) {
      return;
    }

    const endpoint = task.type === 'Ağaç' ? 'trees' : 'vegetables';
    const url = `${API_URL}/${endpoint}/${task.id}/maintenance/${task.month}/toggle`;

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'Görev tamamlanamadı.');
        return;
      }

      // Listeyi güncelle
      if (task.type === 'Ağaç') {
        setTrees((prev) =>
          prev.map((t) => (t._id === data.tree._id ? data.tree : t))
        );
      } else {
        setVeggies((prev) =>
          prev.map((v) => (v._id === data.vegetable._id ? data.vegetable : v))
        );
      }
    } catch (err) {
      console.error('Görev tamamlama hatası:', err);
      alert('Sunucu hatası.');
    }
  };

  // Profil bilgilerini yükle
  useEffect(() => {
    const loadProfile = () => {
      const settings = loadSettings();
      if (settings && settings.profile) {
        setProfileInfo({
          gardenName: settings.profile.gardenName || '',
          gardenSize: settings.profile.gardenSize || 0,
          experienceLevel: settings.profile.experienceLevel || 'beginner'
        });
      }
    };

    loadProfile();

    // Ayarlar değiştiğinde profil bilgilerini güncelle
    const handleSettingsChange = () => {
      loadProfile();
    };

    window.addEventListener('sg-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('sg-settings-changed', handleSettingsChange);
  }, []);

  let treeTasks = 0;
  let treeDone = 0;
  let vegTasks = 0;
  let vegDone = 0;


  trees.forEach((t) => {
    // Adeti 0 olanları görev sayısına dahil etme
    if ((t.count || 0) === 0) return;

    (t.maintenance || []).forEach((m) => {
      if (m.month === currentMonth) {
        treeTasks++;
        if (m.completed) treeDone++;
      }
    });
  });

  veggies.forEach((v) => {
    // Adeti 0 olanları görev sayısına dahil etme
    if ((v.count || 0) === 0) return;

    (v.maintenance || []).forEach((m) => {
      if (m.month === currentMonth) {
        vegTasks++;
        if (m.completed) vegDone++;
      }
    });
  });

  const dayNames = [
    'Pazar',
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi'
  ];

  const dateStr = `${dayNames[now.getDay()]} ${now.getDate()} ${monthNames[now.getMonth()]
    } ${now.getFullYear()}`;
  const timeStr = now.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const treePercent =
    treeTasks === 0 ? 0 : Math.round((treeDone / treeTasks) * 100);
  const vegPercent =
    vegTasks === 0 ? 0 : Math.round((vegDone / vegTasks) * 100);

  const totalTasks = treeTasks + vegTasks;
  const totalDone = treeDone + vegDone;
  const totalRemaining = Math.max(totalTasks - totalDone, 0);

  const overallPercent =
    totalTasks === 0 ? 0 : Math.round((totalDone / totalTasks) * 100);

  // 🎨 Light Mode Renk Paleti (modern ve sade)
  const chartText = '#1f2937';     // koyu gri yazı
  const chartGrid = '#e5e7eb';     // açık grid çizgisi
  const doughnutBase = '#e5e7eb';  // kalan görev rengi (açık gri)

  // 🍩 Donut Grafik
  const doughnutData = {
    labels: ['Tamamlanan', 'Kalan'],
    datasets: [
      {
        data: [totalDone, totalRemaining],
        backgroundColor: ['#22c55e', doughnutBase],
        borderWidth: 0
      }
    ]
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: chartText,
          boxWidth: 14,
          font: { size: 11 }
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || '';
            const value = ctx.parsed;
            return `${label}: ${value} görev`;
          }
        }
      }
    },
    cutout: '70%',
    radius: '90%'
  };

  // 📊 Bar Grafik
  const barData = {
    labels: ['Ağaçlar', 'Sebzeler'],
    datasets: [
      {
        label: 'Tamamlanan (%)',
        data: [treePercent, vegPercent],
        backgroundColor: ['#22c55e', '#3b82f6'],
        borderRadius: 10,
        maxBarThickness: 45
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: chartText },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: chartText
        },
        grid: { color: chartGrid }
      }
    }
  };

  // Mevsim belirleme
  const getSeason = (month) => {
    if (month >= 3 && month <= 5) return { name: '🌸 İlkbahar', tip: 'Ekim ve budama zamanı!' };
    if (month >= 6 && month <= 8) return { name: '☀️ Yaz', tip: 'Sulama ve hasat mevsimi!' };
    if (month >= 9 && month <= 11) return { name: '🍂 Sonbahar', tip: 'Toprak hazırlığı zamanı!' };
    return { name: '❄️ Kış', tip: 'Dinlenme ve planlama dönemi!' };
  };

  const season = getSeason(currentMonth);

  // Acil görevleri bul (bu ay tamamlanmamış ve gerçekten kritik olanlar)
  const urgentTasks = [];

  // Ayarlardan sezon bilgilerini al
  const settings = loadSettings();
  const wateringSeasonStart = settings.maintenance?.wateringSeasonStart || 4;
  const wateringSeasonEnd = settings.maintenance?.wateringSeasonEnd || 10;
  const fertilizingSeasonStart = settings.maintenance?.fertilizingSeasonStart || 3;
  const fertilizingSeasonEnd = settings.maintenance?.fertilizingSeasonEnd || 10;

  const isWateringSeason = currentMonth >= wateringSeasonStart && currentMonth <= wateringSeasonEnd;
  const isFertilizingSeason = currentMonth >= fertilizingSeasonStart && currentMonth <= fertilizingSeasonEnd;

  // Sezon başlangıç kontrolü
  const isWateringSeasonStart = currentMonth === wateringSeasonStart;
  const isFertilizingSeasonStart = currentMonth === fertilizingSeasonStart;

  // Ağaçlar için acil görevler: budama, ilaçlama, gübreleme (sezon içindeyse), sulama (sezon içindeyse)
  trees.forEach((t) => {
    // Adeti 0 olanları acil görevlere dahil etme
    if ((t.count || 0) === 0) return;

    const monthTask = t.maintenance?.find(m => m.month === currentMonth && !m.completed);
    if (monthTask) {
      const taskText = monthTask.tasks || '';

      // Gelecek sezon/planlama gibi ifadeler varsa acil sayma
      const isFuturePlanning = /gelecek|planlama|plan yap|hazırlık|düşün/i.test(taskText);
      if (isFuturePlanning) return;

      // Budama ve ilaçlama her zaman acil
      const hasPruningOrSpray = /budama|ilaç/i.test(taskText);

      // Gübreleme sadece sezon içindeyse acil
      const hasFertilizing = /gübre/i.test(taskText);
      const isFertilizingUrgent = hasFertilizing && isFertilizingSeason;

      // Sulama sadece sezon içindeyse acil
      const hasWatering = /sulama|sulam/i.test(taskText);
      const isWateringUrgent = hasWatering && isWateringSeason;

      if (hasPruningOrSpray || isFertilizingUrgent || isWateringUrgent) {
        urgentTasks.push({
          type: 'Ağaç',
          name: t.name,
          task: taskText,
          id: t._id,
          month: currentMonth
        });
      }
    }
  });

  // Sebzeler için acil görevler: sadece ekim ve ilaçlama (zamanında yapılması kritik)
  veggies.forEach((v) => {
    // Adeti 0 olanları acil görevlere dahil etme
    if ((v.count || 0) === 0) return;

    const monthTask = v.maintenance?.find(m => m.month === currentMonth && !m.completed);
    if (monthTask) {
      const taskText = monthTask.tasks || '';
      // Sadece ekim veya ilaçlama içeren görevleri acil say
      const isUrgent = /ekim|ilaç|tohum|fide/i.test(taskText);
      // Gelecek sezon/planlama gibi ifadeler varsa acil sayma
      const isFuturePlanning = /gelecek|planlama|plan yap|hazırlık|düşün/i.test(taskText);

      if (isUrgent && !isFuturePlanning) {
        urgentTasks.push({
          type: 'Sebze',
          name: v.name,
          task: taskText,
          id: v._id,
          month: currentMonth
        });
      }
    }
  });

  return (
    <div className="home-page">
      <div className="home-header-row">
        <div className="home-card">
          <h2>Bugünün Özeti</h2>
          <p className="home-date-line">
            📅 {dateStr} · ⏰ {timeStr}
          </p>

          <div className="today-summary-grid">
            <div className="summary-item">
              <span className="summary-label">Mevsim</span>
              <span className="summary-value">{season.name}</span>
              <span className="summary-tip">{season.tip}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Bu Ay</span>
              <span className="summary-value">
                {totalDone}/{totalTasks} Görev
              </span>
              <span className="summary-tip">
                {overallPercent === 100 ? '🎉 Tamamlandı!' : `%${overallPercent} tamamlandı`}
              </span>
            </div>
          </div>

          {/* Sezon başlangıç uyarıları */}
          {(isWateringSeasonStart || isFertilizingSeasonStart) && (
            <div className="season-alert-box">
              <div className="season-alert-header">🌱 Sezon Başlangıç Uyarıları</div>
              {isWateringSeasonStart && (
                <div className="season-alert-item">
                  💧 <strong>Sulama sezonu başladı!</strong> Düzenli sulama zamanı.
                </div>
              )}
              {isFertilizingSeasonStart && (
                <div className="season-alert-item">
                  🌿 <strong>Gübreleme sezonu başladı!</strong> Bitkilerinizi gübrelemeye başlayabilirsiniz.
                </div>
              )}
            </div>
          )}

          <div className={urgentTasks.length > 0 ? 'urgent-tasks-box urgent' : 'urgent-tasks-box normal'}>
            <div className="urgent-header">
              {urgentTasks.length > 0 ? (
                <>⚠️ Acil Görevler ({urgentTasks.length})</>
              ) : (
                <>✅ Tüm Önemli Görevler Tamamlandı!</>
              )}
            </div>
            {urgentTasks.length > 0 ? (
              <div className="urgent-list">
                {(showAllUrgentTasks ? urgentTasks : urgentTasks.slice(0, 3)).map((task, idx) => (
                  <div
                    key={idx}
                    className="urgent-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteUrgentTask(task);
                    }}
                    style={{ cursor: 'pointer' }}
                    title="Tamamlamak için tıkla"
                  >
                    <div className="urgent-item-header">
                      <span className="urgent-type">{task.type}</span>
                      <span className="urgent-name">{task.name}</span>
                    </div>
                    <div className="urgent-task-detail">{task.task}</div>
                  </div>
                ))}
                {urgentTasks.length > 3 && !showAllUrgentTasks && (
                  <div
                    className="urgent-more"
                    onClick={() => setShowAllUrgentTasks(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    +{urgentTasks.length - 3} görev daha
                  </div>
                )}
                {showAllUrgentTasks && urgentTasks.length > 3 && (
                  <div
                    className="urgent-more"
                    onClick={() => setShowAllUrgentTasks(false)}
                    style={{ cursor: 'pointer' }}
                  >
                    Daha az göster
                  </div>
                )}
              </div>
            ) : (
              <div className="urgent-success-message">
                Bu ay için tüm önemli bakım görevlerini tamamladın! 🎉
              </div>
            )}
          </div>
        </div>

        <div className="home-card">
          <h3>Bahçe Genel Durum</h3>
          {loading && <p>Yükleniyor...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && (
            <>
              {profileInfo.gardenName && (
                <div className="garden-name-display">
                  🏡 {profileInfo.gardenName}
                </div>
              )}
              <div className="garden-stats-grid">
                {profileInfo.gardenSize > 0 && (
                  <div className="garden-stat-box">
                    <div className="garden-stat-icon">📏</div>
                    <div className="garden-stat-label">Alan</div>
                    <div className="garden-stat-value">{profileInfo.gardenSize} m²</div>
                  </div>
                )}
                {profileInfo.experienceLevel && (
                  <div className="garden-stat-box">
                    <div className="garden-stat-icon">⭐</div>
                    <div className="garden-stat-label">Deneyim</div>
                    <div className="garden-stat-value">
                      {profileInfo.experienceLevel === 'beginner' && 'Yeni Başlayan'}
                      {profileInfo.experienceLevel === 'intermediate' && 'Orta Seviye'}
                      {profileInfo.experienceLevel === 'advanced' && 'İleri Seviye'}
                    </div>
                  </div>
                )}
                <div className="garden-stat-box">
                  <div className="garden-stat-icon">🌳</div>
                  <div className="garden-stat-label">Toplam Ağaç</div>
                  <div className="garden-stat-value">{trees.reduce((sum, t) => sum + (t.count || 0), 0)}</div>
                </div>
                <div className="garden-stat-box">
                  <div className="garden-stat-icon">🥬</div>
                  <div className="garden-stat-label">Toplam Sebze</div>
                  <div className="garden-stat-value">{veggies.reduce((sum, v) => sum + (v.count || 0), 0)}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="home-grid">
        <div className="home-card">
          <h3>Bu Ay - Ağaç Bakımları</h3>
          <p>
            Görev sayısı: <strong>{treeTasks}</strong>
          </p>
          <p>
            Tamamlananlar: <strong>{treeDone}</strong>
          </p>
          <p>
            Kalan:{' '}
            <strong>
              {Math.max(treeTasks - treeDone, 0)}
            </strong>
          </p>

          {/* 🎯 Grafik: Ağaçlar için tamamlanma barı */}
          <div className="home-progress">
            <div className="home-progress-label-row">
              <span>Tamamlanma oranı</span>
              <span>%{treePercent}</span>
            </div>
            <div className="home-progress-bar">
              <div
                className="home-progress-fill"
                style={{ width: `${treePercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="home-card">
          <h3>Bu Ay - Sebze Bakımları</h3>
          <p>
            Görev sayısı: <strong>{vegTasks}</strong>
          </p>
          <p>
            Tamamlananlar: <strong>{vegDone}</strong>
          </p>
          <p>
            Kalan:{' '}
            <strong>
              {Math.max(vegTasks - vegDone, 0)}
            </strong>
          </p>

          {/* 🎯 Grafik: Sebzeler için tamamlanma barı */}
          <div className="home-progress">
            <div className="home-progress-label-row">
              <span>Tamamlanma oranı</span>
              <span>%{vegPercent}</span>
            </div>
            <div className="home-progress-bar">
              <div
                className="home-progress-fill"
                style={{ width: `${vegPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="home-charts">
        <div className="home-card chart-card">
          <h3>Genel Tamamlanma Oranı</h3>
          <p className="muted" style={{ marginBottom: 4 }}>
            Toplam {totalDone}/{totalTasks} görev tamamlandı.
          </p>
          <div className="chart-wrapper chart-wrapper-donut">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="chart-center-label">
              %{overallPercent}
            </div>
          </div>

        </div>

        <div className="home-card chart-card">
          <h3>Ağaç vs Sebze Tamamlanma</h3>
          <p className="muted" style={{ marginBottom: 4 }}>
            Yüzdelik bazda karşılaştırma
          </p>
          <div className="chart-wrapper chart-wrapper-bar">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

    </div>
  );
}

/* -------------------- AYARLAR -------------------- */


function Settings({ token }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [testingAutoTask, setTestingAutoTask] = useState(false);
  const [testingHarvest, setTestingHarvest] = useState(false);
  const [testingReminder, setTestingReminder] = useState(false);
  const [testingWeather, setTestingWeather] = useState(false);
  const [clearingLog, setClearingLog] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Profil için geçici state (manuel kaydetme için)
  const [tempProfileSettings, setTempProfileSettings] = useState(null);
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Ayarları API'den yükle
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          // API'den gelen ayarları localStorage'a da kaydet
          saveSettings(data);
          // Şehir bilgisini de ayrıca kaydet (Hava durumu için)
          if (data.weather?.city) {
            try {
              localStorage.setItem('sg_city', data.weather.city);
            } catch (e) {
              console.warn('sg_city kaydedilemedi:', e);
            }
          }
        } else {
          console.error('Ayarlar yüklenemedi');
          // Hata durumunda varsayılan ayarları kullan
          setSettings(loadSettings());
        }
      } catch (err) {
        console.error('Ayarlar yüklenirken hata:', err);
        // Hata durumunda localStorage'dan yükle
        setSettings(loadSettings());
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  // Settings yüklendiğinde tempProfileSettings'i başlat
  useEffect(() => {
    if (settings?.profile) {
      setTempProfileSettings({ ...settings.profile });
      setHasProfileChanges(false);
    }
  }, [settings]);

  // Profil alanlarını geçici state'e kaydet (otomatik kaydetme YAPMA)
  const handleProfileChange = (field, value) => {
    setTempProfileSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasProfileChanges(true);
    setProfileMessage('');
  };

  // Profil ayarlarını kaydet
  const handleSaveProfileSettings = async () => {
    if (!hasProfileChanges || !tempProfileSettings) return;

    setSavingProfile(true);
    setProfileMessage('');

    try {
      // Tüm profil alanlarını tek seferde güncelle
      const updatedSettings = {
        ...settings,
        profile: tempProfileSettings
      };

      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedSettings)
      });

      if (res.ok) {
        setSettings(updatedSettings);
        saveSettings(updatedSettings);
        setHasProfileChanges(false);
        setProfileMessage('✅ Profil ayarları kaydedildi!');
        setTimeout(() => setProfileMessage(''), 3000);
      } else {
        throw new Error('Kaydetme başarısız');
      }
    } catch (err) {
      console.error('Profil kaydetme hatası:', err);
      setProfileMessage('❌ Kaydetme başarısız. Lütfen tekrar deneyin.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Profil değişikliklerini iptal et
  const handleCancelProfileChanges = useCallback(() => {
    if (settings?.profile) {
      setTempProfileSettings({ ...settings.profile });
      setHasProfileChanges(false);
      setProfileMessage('');
    }
  }, [settings, setTempProfileSettings, setHasProfileChanges, setProfileMessage]);

  // Ayarları anında uygula (CSS sınıfları vb.)
  const applySettingsImmediately = useCallback((settings) => {
    if (!settings || !settings.appearance) return;

    // Tema ayarı
    if (settings.appearance.theme) {
      const theme = settings.appearance.theme;
      document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');

      if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
      } else {
        document.body.classList.add(`theme-${theme}`);
      }
    }

    // Renk şeması
    if (settings.appearance.colorScheme) {
      document.body.classList.remove('color-green', 'color-blue', 'color-brown', 'color-purple');
      document.body.classList.add(`color-${settings.appearance.colorScheme}`);
    }

    // Yazı boyutu
    if (settings.appearance.fontSize) {
      document.body.classList.remove('font-small', 'font-medium', 'font-large');
      document.body.classList.add(`font-${settings.appearance.fontSize}`);
    }
  }, []); // Bağımlılık yok

  // Ayarları API'ye kaydet


  // Tek bir ayarı güncelle (PATCH)
  const updateSingleSetting = useCallback(async (path, value) => {
    // Optimistic update
    let updatedSettings;
    setSettings((prev) => {
      const next = { ...prev };
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      updatedSettings = next;
      return next;
    });

    // localStorage'a da kaydet
    if (updatedSettings) {
      saveSettings(updatedSettings);

      // Ayarları hemen uygula (event sistemine ek olarak)
      applySettingsImmediately(updatedSettings);

      // Ayarların uygulanması için event gönder
      window.dispatchEvent(new Event('sg-settings-changed'));
    }

    setSaving(true);

    try {
      await fetch(`${API_URL}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ path, value })
      });

      setTimeout(() => setSaving(false), 400);

      // Görünüm modu değiştiğinde sayfayı yenile
      if (path === 'appearance.viewMode') {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      console.error('Ayar kaydedilemedi:', err);
      setSaving(false);
    }
  }, [settings, token, setSettings, setSaving, applySettingsImmediately]);

  const handleToggle = (path) => {
    if (!settings) return;

    const keys = path.split('.');
    let current = settings;
    for (const key of keys) {
      current = current[key];
    }

    updateSingleSetting(path, !current);
  };

  const handleSelectChange = (path, value) => {
    if (!settings) return;
    updateSingleSetting(path, value);
  };

  const handleNumberChange = (path, value) => {
    if (!settings) return;
    updateSingleSetting(path, Number(value));
  };

  const handleExportJson = async () => {
    if (!token) {
      setMessage('Önce giriş yapmalısın.');
      return;
    }
    setExporting(true);
    setMessage('');
    try {
      const [treeRes, vegRes] = await Promise.all([
        fetch(`${API_URL}/trees`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/vegetables`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const [trees, vegetables] = await Promise.all([
        treeRes.json().catch(() => []),
        vegRes.json().catch(() => [])
      ]);

      if (!treeRes.ok) {
        throw new Error(
          (trees && trees.message) || 'Ağaç verileri alınamadı.'
        );
      }
      if (!vegRes.ok) {
        throw new Error(
          (vegetables && vegetables.message) || 'Sebze verileri alınamadı.'
        );
      }

      const payload = {
        exportedAt: new Date().toISOString(),
        settings,
        trees,
        vegetables
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `akilli-bahce-yedek-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage('Yedek dosyası indirildi.');
    } catch (err) {
      console.error('Yedek alma hatası:', err);
      setMessage(err.message || 'Yedek alınamadı.');
    } finally {
      setExporting(false);
    }
  };
  const handleCityChange = (value) => {
    updateSingleSetting('weather.city', value);
    // localStorage'a da kaydet (WeatherTab ve WeatherWidget bundan okuyor)
    try {
      localStorage.setItem('sg_city', value);
    } catch (e) {
      console.warn('localStorage kaydedilemedi:', e);
    }
    // Hava durumu widget'ına haber ver
    window.dispatchEvent(new Event('sg-city-changed'));
  };

  // Test fonksiyonları
  const handleTestAutoTask = async () => {
    if (!token) {
      setMessage('Önce giriş yapmalısın.');
      return;
    }
    setTestingAutoTask(true);
    setMessage('');
    setTestResults(null);
    try {
      const res = await fetch(`${API_URL}/test/auto-task`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Test başarısız');
      }

      setTestResults({
        type: 'auto-task',
        success: true,
        data: data
      });
      setMessage(data.message);
    } catch (err) {
      console.error('Otomatik görev testi hatası:', err);
      setMessage(err.message || 'Test başarısız');
      setTestResults({
        type: 'auto-task',
        success: false,
        error: err.message
      });
    } finally {
      setTestingAutoTask(false);
    }
  };

  const handleTestHarvestReminder = async () => {
    if (!token) {
      setMessage('Önce giriş yapmalısın.');
      return;
    }
    setTestingHarvest(true);
    setMessage('');
    setTestResults(null);
    try {
      const res = await fetch(`${API_URL}/test/harvest-reminder`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Test başarısız');
      }

      setTestResults({
        type: 'harvest',
        success: true,
        data: data
      });
      setMessage(data.message);
    } catch (err) {
      console.error('Hasat hatırlatma testi hatası:', err);
      setMessage(err.message || 'Test başarısız');
      setTestResults({
        type: 'harvest',
        success: false,
        error: err.message
      });
    } finally {
      setTestingHarvest(false);
    }
  };

  const handleTestDailyReminder = async () => {
    if (!token) {
      setMessage('Önce giriş yapmalısın.');
      return;
    }
    setTestingReminder(true);
    setMessage('');
    setTestResults(null);
    try {
      const res = await fetch(`${API_URL}/test/daily-reminder`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Test başarısız');
      }

      setTestResults({
        type: 'daily-reminder',
        success: true,
        data: data
      });
      setMessage(data.message);
    } catch (err) {
      console.error('Günlük hatırlatma testi hatası:', err);
      setMessage(err.message || 'Test başarısız');
      setTestResults({
        type: 'daily-reminder',
        success: false,
        error: err.message
      });
    } finally {
      setTestingReminder(false);
    }
  };

  const handleTestWeatherAlert = async () => {
    if (!token) {
      setMessage('Önce giriş yapmalısın.');
      return;
    }
    setTestingWeather(true);
    setMessage('');
    setTestResults(null);
    try {
      const res = await fetch(`${API_URL}/test-weather-alert`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Test başarısız');
      }

      setTestResults({
        type: 'weather',
        success: true,
        data: data
      });
      setMessage(data.message);
    } catch (err) {
      console.error('Hava durumu testi hatası:', err);
      setMessage(err.message || 'Test başarısız');
      setTestResults({
        type: 'weather',
        success: false,
        error: err.message
      });
    } finally {
      setTestingWeather(false);
    }
  };

  const handleClearReminderLog = async () => {
    if (!token) {
      setMessage('Önce giriş yapmalısın.');
      return;
    }
    setClearingLog(true);
    setMessage('');
    setTestResults(null);
    try {
      const res = await fetch(`${API_URL}/test/daily-reminder-log`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Temizleme başarısız');
      }

      setTestResults({
        type: 'clear-log',
        success: true,
        data: data
      });
      setMessage(data.message);
    } catch (err) {
      console.error('Log temizleme hatası:', err);
      setMessage(err.message || 'Temizleme başarısız');
      setTestResults({
        type: 'clear-log',
        success: false,
        error: err.message
      });
    } finally {
      setClearingLog(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="settings-page">
        <h2>Ayarlar</h2>
        <p>Ayarlar yükleniyor...</p>
      </div>
    );
  }

  // Settings henüz yüklenmediyse
  if (!settings) {
    return (
      <div className="settings-page">
        <h2>Ayarlar</h2>
        <p>Ayarlar yüklenemedi. Lütfen giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header-row">
        <div>
          <h2>Ayarlar</h2>
          <p className="muted">
            Uygulamanın tüm ayarlarını burada özelleştirebilirsin. Ayarlar veritabanında saklanır ve tüm cihazlarında senkronize olur.
          </p>
        </div>
        {saving && <span className="settings-status">Kaydedildi ✓</span>}
      </div>

      <div className="settings-grid">
        {/* Profil & Kişiselleştirme */}
        <section className="settings-section settings-section-wide">
          <h3>👤 Profil &amp; Kişiselleştirme</h3>
          <p className="settings-section-desc">
            Bahçe bilgilerini ve deneyim seviyeni belirle.
          </p>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Bahçe adı</div>
              <div className="settings-item-desc">
                Bahçene özel bir isim ver
              </div>
            </div>
            <input
              type="text"
              className="settings-select"
              placeholder="örn: Köy Bahçesi, Balkon Bahçesi"
              value={tempProfileSettings?.gardenName || ''}
              onChange={(e) => handleProfileChange('gardenName', e.target.value)}
              maxLength="50"
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Bahçe büyüklüğü (m²)</div>
              <div className="settings-item-desc">
                Bahçenin toplam alanı
              </div>
            </div>
            <input
              type="number"
              className="settings-select"
              placeholder="örn: 500"
              value={tempProfileSettings?.gardenSize || 0}
              onChange={(e) => handleProfileChange('gardenSize', Number(e.target.value))}
              min="0"
              max="100000"
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Deneyim seviyesi</div>
              <div className="settings-item-desc">
                Bahçecilik deneyimini belirle (önerileri buna göre ayarlarız)
              </div>
            </div>
            <select
              className="settings-select"
              value={tempProfileSettings?.experienceLevel || 'beginner'}
              onChange={(e) => handleProfileChange('experienceLevel', e.target.value)}
            >
              <option value="beginner">Yeni Başlayan</option>
              <option value="intermediate">Orta Seviye</option>
              <option value="advanced">İleri Seviye</option>
            </select>
          </div>

          <div className="settings-divider"></div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Site Başlığı</div>
              <div className="settings-item-desc">
                Footer ve header'da görünecek site başlığı
              </div>
            </div>
            <input
              type="text"
              className="settings-select"
              placeholder="örn: Akıllı Bahçe"
              value={tempProfileSettings?.siteTitle || ''}
              onChange={(e) => handleProfileChange('siteTitle', e.target.value)}
              maxLength="50"
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Site Açıklaması</div>
              <div className="settings-item-desc">
                Footer'da görünecek site açıklaması
              </div>
            </div>
            <textarea
              className="settings-select-area "
              placeholder="Bahçenizi dijital dünyada yönetin..."
              value={tempProfileSettings?.siteDescription || ''}
              onChange={(e) => handleProfileChange('siteDescription', e.target.value)}
              rows="3"
              maxLength="200"
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">E-posta Adresi</div>
              <div className="settings-item-desc">
                Footer ve canlı destekte görünecek e-posta
              </div>
            </div>
            <input
              type="email"
              className="settings-select"
              placeholder="örn: info@akillibahce.com"
              value={tempProfileSettings?.siteEmail || ''}
              onChange={(e) => handleProfileChange('siteEmail', e.target.value)}
              maxLength="100"
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Web Sitesi</div>
              <div className="settings-item-desc">
                Footer'da görünecek web sitesi adresi
              </div>
            </div>
            <input
              type="text"
              className="settings-select"
              placeholder="örn: www.akillibahce.com"
              value={tempProfileSettings?.siteWebsite || ''}
              onChange={(e) => handleProfileChange('siteWebsite', e.target.value)}
              maxLength="100"
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">WhatsApp Numarası</div>
              <div className="settings-item-desc">
                Canlı destekte görünecek WhatsApp numarası (örn: 905551234567)
              </div>
            </div>
            <input
              type="text"
              className="settings-select"
              placeholder="örn: 905551234567"
              value={tempProfileSettings?.siteWhatsApp || ''}
              onChange={(e) => handleProfileChange('siteWhatsApp', e.target.value)}
              maxLength="20"
            />
          </div>

          {/* Kaydet / İptal Butonları */}
          <div className="profile-save-row">
            {profileMessage && (
              <span className="profile-save-message">{profileMessage}</span>
            )}
            {hasProfileChanges && (
              <>
                <button
                  type="button"
                  className="btn"
                  onClick={handleCancelProfileChanges}
                  disabled={savingProfile}
                >
                  İptal
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={handleSaveProfileSettings}
                  disabled={savingProfile}
                >
                  {savingProfile ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </>
            )}
          </div>
        </section>


        {/* Görünüm & Tema */}
        <section className="settings-section">
          <h3>🎨 Görünüm &amp; Tema</h3>
          <p className="settings-section-desc">
            Uygulamanın görünümünü özelleştir.
          </p>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Tema modu</div>
              <div className="settings-item-desc">
                Aydınlık, karanlık veya otomatik tema seç
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.appearance.theme}
              onChange={(e) => handleSelectChange('appearance.theme', e.target.value)}
            >
              <option value="light">Aydınlık</option>
              <option value="dark">Karanlık</option>
              <option value="auto">Otomatik (sistem ayarı)</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Renk teması</div>
              <div className="settings-item-desc">
                Ana renk paletini seç
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.appearance.colorScheme}
              onChange={(e) => handleSelectChange('appearance.colorScheme', e.target.value)}
            >
              <option value="green">Yeşil (Varsayılan)</option>
              <option value="blue">Mavi</option>
              <option value="brown">Kahverengi</option>
              <option value="purple">Mor</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Yazı boyutu</div>
              <div className="settings-item-desc">
                Uygulama genelinde yazı boyutunu ayarla
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.appearance.fontSize}
              onChange={(e) => handleSelectChange('appearance.fontSize', e.target.value)}
            >
              <option value="small">Küçük</option>
              <option value="medium">Normal</option>
              <option value="large">Büyük</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Görünüm modu</div>
              <div className="settings-item-desc">
                Ağaç ve sebzeleri kart veya liste olarak göster
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.appearance.viewMode}
              onChange={(e) => handleSelectChange('appearance.viewMode', e.target.value)}
            >
              <option value="card">Kart Görünümü</option>
              <option value="list">Liste Görünümü</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Grafikler varsayılan açık</div>
              <div className="settings-item-desc">
                Rapor sayfasında grafikler başlangıçta açık olsun
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.appearance.chartsDefaultOpen}
                onChange={() => handleToggle('appearance.chartsDefaultOpen')}
              />
              <span className="slider" />
            </label>
          </div>
        </section>


        {/* Bildirim & Hatırlatma */}
        <section className="settings-section settings-section-wide">
          <h3>📬 Bildirim &amp; Hatırlatma</h3>
          <p className="settings-section-desc">
            Bildirim ve hatırlatma tercihlerini ayarla.
          </p>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Email bildirimleri</div>
              <div className="settings-item-desc">
                Bakım zamanı geldiğinde email ile bildirim al
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.notifications.emailEnabled}
                onChange={() => handleToggle('notifications.emailEnabled')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Push bildirimleri</div>
              <div className="settings-item-desc">
                Tarayıcı bildirimleri ile anında haberdar ol
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.notifications.pushEnabled}
                onChange={() => handleToggle('notifications.pushEnabled')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Haftalık özet maili</div>
              <div className="settings-item-desc">
                Her hafta özet rapor email ile gönderilsin
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.notifications.weeklyDigest}
                onChange={() => handleToggle('notifications.weeklyDigest')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Kritik görev uyarıları</div>
              <div className="settings-item-desc">
                Budama, hasat gibi önemli görevler için özel bildirim
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.notifications.criticalTaskAlerts}
                onChange={() => handleToggle('notifications.criticalTaskAlerts')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Hatırlatma saati</div>
              <div className="settings-item-desc">
                Günlük hatırlatmaların hangi saatte gönderileceği
              </div>
            </div>
            <input
              type="time"
              className="settings-select"
              value={settings.notifications.reminderTime}
              onChange={(e) => handleSelectChange('notifications.reminderTime', e.target.value)}
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">
                Önemli ağaç görevleri öncelikli
              </div>
              <div className="settings-item-desc">
                Hatırlatma ekranında varsayılan olarak sadece önemli görevleri göster
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.reminders.treeOnlyImportantDefault}
                onChange={() => handleToggle('reminders.treeOnlyImportantDefault')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">
                Önemli sebze görevleri öncelikli
              </div>
              <div className="settings-item-desc">
                Sebze hatırlatmalarında da varsayılan filtreyi sadece önemli görevlere ayarla
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.reminders.vegOnlyImportantDefault}
                onChange={() => handleToggle('reminders.vegOnlyImportantDefault')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">
                Bakım önerileri otomatik açılsın
              </div>
              <div className="settings-item-desc">
                Hatırlatmalar sayfasına girdiğinde otomatik olarak öneriler paneli açık olsun
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.reminders.autoOpenSuggestions}
                onChange={() => handleToggle('reminders.autoOpenSuggestions')}
              />
              <span className="slider" />
            </label>
          </div>
        </section>
        {/* Hava Durumu */}
        <section className="settings-section">
          <h3>🌤️ Hava Durumu & Tarih/Saat</h3>
          <p className="settings-section-desc">
            Hava durumu ayarlarını ve tarih/saat formatlarını özelleştir.
          </p>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Varsayılan şehir</div>
              <div className="settings-item-desc">
                Header ve hava durumu sayfasında hangi şehrin bilgileri gösterilsin
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.weather.city}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="Elazig">Elazığ</option>
              <option value="Istanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="Izmir">İzmir</option>
              <option value="Bursa">Bursa</option>
              <option value="Antalya">Antalya</option>
              <option value="Adana">Adana</option>
              <option value="Gaziantep">Gaziantep</option>
              <option value="Konya">Konya</option>
              <option value="Mersin">Mersin</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Sıcaklık birimi</div>
              <div className="settings-item-desc">
                Celsius veya Fahrenheit
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.weather.unit}
              onChange={(e) => handleSelectChange('weather.unit', e.target.value)}
            >
              <option value="metric">Celsius (°C)</option>
              <option value="imperial">Fahrenheit (°F)</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Güncelleme sıklığı</div>
              <div className="settings-item-desc">
                Hava durumu bilgisi ne sıklıkla güncellensin (dakika)
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.weather.updateFrequency}
              onChange={(e) => handleNumberChange('weather.updateFrequency', e.target.value)}
            >
              <option value="15">15 dakika</option>
              <option value="30">30 dakika</option>
              <option value="60">1 saat</option>
              <option value="120">2 saat</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Yağış uyarıları</div>
              <div className="settings-item-desc">
                Yağmur yağacağında bildirim gönder
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.weather.rainAlerts}
                onChange={() => handleToggle('weather.rainAlerts')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Aşırı sıcaklık uyarıları</div>
              <div className="settings-item-desc">
                Belirlenen sıcaklığın üzerine çıkınca bildirim gönder
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.weather.heatAlerts}
                onChange={() => handleToggle('weather.heatAlerts')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Sıcaklık eşiği (°C)</div>
              <div className="settings-item-desc">
                Bu sıcaklığın üzerinde uyarı ver
              </div>
            </div>
            <input
              type="number"
              className="settings-select"
              value={settings.weather.heatThreshold}
              onChange={(e) => handleNumberChange('weather.heatThreshold', e.target.value)}
              min="25"
              max="45"
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Don uyarıları</div>
              <div className="settings-item-desc">
                Sıcaklık 0°C altına düşeceğinde bildirim gönder
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.weather.frostAlerts}
                onChange={() => handleToggle('weather.frostAlerts')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-divider"></div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Tarih formatı</div>
              <div className="settings-item-desc">
                Tarih gösterimlerinde kullanılacak format
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.ui.dateFormat}
              onChange={(e) => handleSelectChange('ui.dateFormat', e.target.value)}
            >
              <option value="dd.MM.yyyy">27.11.2025</option>
              <option value="yyyy-MM-dd">2025-11-27</option>
              <option value="dd MMMM yyyy">27 Kasım 2025</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Saat formatı</div>
              <div className="settings-item-desc">
                Saat gösterimlerinde kullanılacak format
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.ui.timeFormat}
              onChange={(e) => handleSelectChange('ui.timeFormat', e.target.value)}
            >
              <option value="HH:mm">24 saat (14:30)</option>
              <option value="hh:mm">12 saat (02:30)</option>
            </select>
          </div>
        </section>

        {/* Bakım Planlama */}
        <section className="settings-section settings-section-widel">
          <h3>🌱 Bakım Planlama</h3>
          <p className="settings-section-desc">
            Otomatik bakım planlama, sulama ve gübreleme ayarlarını düzenle.
          </p>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Varsayılan sulama sıklığı (gün)</div>
              <div className="settings-item-desc">
                Yeni eklenen bitkiler için otomatik sulama aralığı
              </div>
            </div>
            <input
              type="number"
              className="settings-select"
              value={settings.maintenance.defaultWateringFrequency}
              onChange={(e) => handleNumberChange('maintenance.defaultWateringFrequency', e.target.value)}
              min="1"
              max="30"
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Sulama sezonu başlangıç ayı</div>
              <div className="settings-item-desc">
                Sulama sezonunun başladığı ay
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.maintenance.wateringSeasonStart}
              onChange={(e) => handleNumberChange('maintenance.wateringSeasonStart', e.target.value)}
            >
              <option value="1">Ocak</option>
              <option value="2">Şubat</option>
              <option value="3">Mart</option>
              <option value="4">Nisan</option>
              <option value="5">Mayıs</option>
              <option value="6">Haziran</option>
              <option value="7">Temmuz</option>
              <option value="8">Ağustos</option>
              <option value="9">Eylül</option>
              <option value="10">Ekim</option>
              <option value="11">Kasım</option>
              <option value="12">Aralık</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Sulama sezonu bitiş ayı</div>
              <div className="settings-item-desc">
                Sulama sezonunun bittiği ay
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.maintenance.wateringSeasonEnd}
              onChange={(e) => handleNumberChange('maintenance.wateringSeasonEnd', e.target.value)}
            >
              <option value="1">Ocak</option>
              <option value="2">Şubat</option>
              <option value="3">Mart</option>
              <option value="4">Nisan</option>
              <option value="5">Mayıs</option>
              <option value="6">Haziran</option>
              <option value="7">Temmuz</option>
              <option value="8">Ağustos</option>
              <option value="9">Eylül</option>
              <option value="10">Ekim</option>
              <option value="11">Kasım</option>
              <option value="12">Aralık</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Varsayılan gübreleme periyodu (gün)</div>
              <div className="settings-item-desc">
                Yeni eklenen bitkiler için otomatik gübreleme aralığı
              </div>
            </div>
            <input
              type="number"
              className="settings-select"
              value={settings.maintenance.defaultFertilizingPeriod}
              onChange={(e) => handleNumberChange('maintenance.defaultFertilizingPeriod', e.target.value)}
              min="7"
              max="365"
            />
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Gübreleme sezonu başlangıç ayı</div>
              <div className="settings-item-desc">
                Gübreleme sezonunun başladığı ay
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.maintenance.fertilizingSeasonStart}
              onChange={(e) => handleNumberChange('maintenance.fertilizingSeasonStart', e.target.value)}
            >
              <option value="1">Ocak</option>
              <option value="2">Şubat</option>
              <option value="3">Mart</option>
              <option value="4">Nisan</option>
              <option value="5">Mayıs</option>
              <option value="6">Haziran</option>
              <option value="7">Temmuz</option>
              <option value="8">Ağustos</option>
              <option value="9">Eylül</option>
              <option value="10">Ekim</option>
              <option value="11">Kasım</option>
              <option value="12">Aralık</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Gübreleme sezonu bitiş ayı</div>
              <div className="settings-item-desc">
                Gübreleme sezonunun bittiği ay
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.maintenance.fertilizingSeasonEnd}
              onChange={(e) => handleNumberChange('maintenance.fertilizingSeasonEnd', e.target.value)}
            >
              <option value="1">Ocak</option>
              <option value="2">Şubat</option>
              <option value="3">Mart</option>
              <option value="4">Nisan</option>
              <option value="5">Mayıs</option>
              <option value="6">Haziran</option>
              <option value="7">Temmuz</option>
              <option value="8">Ağustos</option>
              <option value="9">Eylül</option>
              <option value="10">Ekim</option>
              <option value="11">Kasım</option>
              <option value="12">Aralık</option>
            </select>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Otomatik görev oluşturma</div>
              <div className="settings-item-desc">
                Yeni bitki eklendiğinde otomatik bakım planı oluştur
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.maintenance.autoTaskCreation}
                onChange={() => handleToggle('maintenance.autoTaskCreation')}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Hasat hatırlatmaları</div>
              <div className="settings-item-desc">
                Meyve ve sebzelerin hasat zamanı geldiğinde bildirim gönder
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.maintenance.harvestReminders}
                onChange={() => handleToggle('maintenance.harvestReminders')}
              />
              <span className="slider" />
            </label>
          </div>
        </section>







        {/* Test Özellikleri */}
        <section className="settings-section settings-section-wide">
          <h3>🧪 Test Özellikleri</h3>
          <p className="settings-section-desc">
            Bakım planlama özelliklerini test et ve sonuçları gör.
          </p>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Otomatik görev oluşturma testi</div>
              <div className="settings-item-desc">
                Test ağacı oluşturur ve otomatik görevlerin çalışıp çalışmadığını kontrol eder
              </div>
            </div>
            <button
              type="button"
              className="btn primary"
              onClick={handleTestAutoTask}
              disabled={testingAutoTask}
            >
              {testingAutoTask ? 'Test ediliyor...' : 'Test Et'}
            </button>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Hasat hatırlatmaları testi</div>
              <div className="settings-item-desc">
                Test sebze oluşturur ve hasat görevlerinin eklenip eklenmediğini kontrol eder
              </div>
            </div>
            <button
              type="button"
              className="btn primary"
              onClick={handleTestHarvestReminder}
              disabled={testingHarvest}
            >
              {testingHarvest ? 'Test ediliyor...' : 'Test Et'}
            </button>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Günlük hatırlatma testi</div>
              <div className="settings-item-desc">
                Hatırlatma saati ayarını test eder ve bildirim gönderir (bugünkü log otomatik temizlenir)
              </div>
            </div>
            <button
              type="button"
              className="btn primary"
              onClick={handleTestDailyReminder}
              disabled={testingReminder}
            >
              {testingReminder ? 'Test ediliyor...' : 'Test Et'}
            </button>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Hava durumu uyarısı testi</div>
              <div className="settings-item-desc">
                Yağmur, aşırı sıcaklık ve don uyarılarını manuel tetikle (ve logu temizle)
              </div>
            </div>
            <button
              type="button"
              className="btn primary"
              onClick={handleTestWeatherAlert}
              disabled={testingWeather}
            >
              {testingWeather ? 'Test ediliyor...' : 'Test Et'}
            </button>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Hatırlatma logunu temizle</div>
              <div className="settings-item-desc">
                Bugünkü hatırlatma logunu siler, gerçek zamanda test için kullanın
              </div>
            </div>
            <button
              type="button"
              className="btn secondary"
              onClick={handleClearReminderLog}
              disabled={clearingLog}
            >
              {clearingLog ? 'Temizleniyor...' : 'Logu Temizle'}
            </button>
          </div>

          {testResults && testResults.success && (
            <div className="test-results-box">
              <h4>📊 Test Sonuçları</h4>
              {testResults.type === 'auto-task' && (
                <div>
                  <p><strong>✅ {testResults.data.message}</strong></p>
                  <ul>
                    <li>Oluşturulan görev sayısı: <strong>{testResults.data.createdTasks}</strong></li>
                    <li>Sulama sıklığı: {testResults.data.settings.wateringFrequency} gün</li>
                    <li>Gübreleme periyodu: {testResults.data.settings.fertilizingPeriod} gün</li>
                    <li>Sulama sezonu: Ay {testResults.data.settings.wateringSeason}</li>
                  </ul>
                  <p className="test-note">
                    💡 Ağaçlar sekmesinde "Test Ağacı" isimli bitkiyi kontrol edin.
                  </p>
                </div>
              )}
              {testResults.type === 'harvest' && (
                <div>
                  <p><strong>✅ {testResults.data.message}</strong></p>
                  <ul>
                    <li>Toplam görev: <strong>{testResults.data.totalTasks}</strong></li>
                    <li>Hasat görevi: <strong>{testResults.data.harvestTasks}</strong></li>
                    <li>Hasat ayları: {testResults.data.harvestMonths.join(', ')}</li>
                  </ul>
                  <p className="test-note">
                    💡 Sebzeler sekmesinde "Test Domates" isimli bitkiyi kontrol edin.
                  </p>
                </div>
              )}
              {testResults.type === 'daily-reminder' && (
                <div>
                  <p><strong>✅ {testResults.data.message}</strong></p>
                  <p className="test-note">
                    💡 Server konsol loglarını kontrol edin. Hatırlatma saati ayarınıza göre bildirim gönderildi mi görebilirsiniz.
                  </p>
                </div>
              )}
              {testResults.type === 'clear-log' && (
                <div>
                  <p><strong>✅ {testResults.data.message}</strong></p>
                  {testResults.data.cleared && (
                    <p className="test-note">
                      💡 Artık Cron job bir sonraki 10 dakikada çalıştığında (hatırlatma saati uygunsa) bildirim alabilirsiniz.
                    </p>
                  )}
                </div>
              )}
              {testResults.type === 'weather' && (
                <div>
                  <p><strong>✅ {testResults.data.message}</strong></p>
                  <p className="test-note">
                    {testResults.data.info}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
        {/* Veri yönetimi */}
        <section className="settings-section">
          <h3>📦 Veri Yönetimi</h3>
          <p className="settings-section-desc">
            Ağaç ve sebze kayıtlarını JSON formatında bilgisayarına
            indirebilirsin.
          </p>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">
                Yedek al (JSON indir)
              </div>
              <div className="settings-item-desc">
                Ağaç ve sebze listesini, bakım planlarıyla birlikte tek
                bir yedek dosyasına kaydeder.
              </div>
            </div>
            <button
              type="button"
              className="btn primary"
              onClick={handleExportJson}
              disabled={exporting}
            >
              {exporting ? 'Hazırlanıyor...' : 'JSON indir'}
            </button>
          </div>

          {message && <p className="settings-message">{message}</p>}
        </section>


      </div>
    </div>
  );
}


/* -------------------- RAPORLAR -------------------- */



function Reports({ token }) {
  // 📌 Aylık özet için durumlar
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 📌 Geçmiş bakım raporu için durumlar
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [historyVisible, setHistoryVisible] = useState(false); // 🆕 Added for toggle

  // 📊 Grafik görünümü
  const [showCharts, setShowCharts] = useState(true);

  // ====== AYLIK RAPOR OLUŞTURMA ======
  const generateReport = async () => {
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const res = await fetch(`${API_URL}/reports/monthly?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Rapor oluşturulamadı.');
      setReport(data);
    } catch (err) {
      setError(err.message || 'Rapor alınırken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // ====== GEÇMİŞ BAKIM RAPORU YÜKLE ======
  const loadHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const res = await fetch(`${API_URL}/reports/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Rapor alınamadı.');
      setHistoryItems(data.items || data.months || []); // eski / yeni endpoint uyumu
    } catch (err) {
      setHistoryError(err.message || 'Bir hata oluştu.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // ====== CSV İNDİR ======
  const handleDownloadCSV = () => {
    if (!report) return;

    const rows = [
      ['Kategori', 'Toplam', 'Tamamlanan', 'Kalan', 'Yüzde'],
      ['Ağaçlar', report.tree.total, report.tree.done, report.tree.remaining, report.tree.percent],
      ['Sebzeler', report.veg.total, report.veg.done, report.veg.remaining, report.veg.percent],
      [
        'Toplam',
        report.total.total,
        report.total.done,
        report.total.remaining,
        report.total.percent
      ]
    ];

    const csvContent = rows.map((r) => r.join(';')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aylik-ozet-raporu-${month}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ====== PDF / YAZDIR (print-to-PDF) ======
  const handleDownloadPDF = () => {
    if (!report) return;

    const win = window.open('', '_blank');
    if (!win) return;

    const html = `
      <html>
        <head>
          <title>Aylık Özet Raporu - ${month}. Ay</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; }
            h1 { font-size: 20px; margin-bottom: 16px; }
            table { border-collapse: collapse; width: 100%; margin-top: 12px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: center; font-size: 13px; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>${month}. Ay Aylık Özet Raporu</h1>
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Toplam</th>
                <th>Tamamlanan</th>
                <th>Kalan</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ağaçlar</td>
                <td>${report.tree.total}</td>
                <td>${report.tree.done}</td>
                <td>${report.tree.remaining}</td>
                <td>%${report.tree.percent}</td>
              </tr>
              <tr>
                <td>Sebzeler</td>
                <td>${report.veg.total}</td>
                <td>${report.veg.done}</td>
                <td>${report.veg.remaining}</td>
                <td>%${report.veg.percent}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Toplam</th>
                <th>${report.total.total}</th>
                <th>${report.total.done}</th>
                <th>${report.total.remaining}</th>
                <th>%${report.total.percent}</th>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print(); // Kullanıcı "PDF olarak kaydet" seçebilir
  };

  // ====== Grafik verileri ======
  const chartData = report
    ? {
      labels: ['Ağaçlar', 'Sebzeler', 'Toplam'],
      datasets: [
        {
          label: 'Tamamlanma (%)',
          data: [report.tree.percent, report.veg.percent, report.total.percent],
          backgroundColor: ['#22c55e', '#3b82f6', '#6366f1'],
          borderRadius: 10,
          maxBarThickness: 45
        }
      ]
    }
    : null;

  const doughnutData = report
    ? {
      labels: ['Tamamlanan', 'Kalan'],
      datasets: [
        {
          data: [report.total.done, report.total.remaining],
          backgroundColor: ['#22c55e', '#e5e7eb'],
          borderWidth: 0
        }
      ]
    }
    : null;

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } }
    }
  };

  const doughnutOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 14, font: { size: 11 } } }
    },
    cutout: '70%',
    radius: '90%'
  };

  return (
    <div className="page reports-page">
      <h2>Raporlar</h2>

      {/* ===================== AYLIK RAPOR ===================== */}
      <div className="card report-card">
        <div className="section-header report-header">
          <div>
            <h3>Aylık Özet Raporu</h3>
            <p className="muted" style={{ marginTop: 4 }}>
              Seçtiğin ay için ağaç ve sebze bakımlarının kısa özeti.
            </p>
          </div>

          <div className="report-header-right">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="report-month-select"
            >
              <option value={0}>Tüm Aylar</option>
              {monthNames.map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {idx + 1}. {m}
                </option>
              ))}
            </select>

            <button
              className="btn"
              type="button"
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? 'Hazırlanıyor...' : 'Raporu Oluştur'}
            </button>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        {/* Rapor tablosu */}
        {report && !loading && (
          <>
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Toplam</th>
                    <th>Tamamlanan</th>
                    <th>Kalan</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ağaçlar</td>
                    <td>{report.tree.total}</td>
                    <td>{report.tree.done}</td>
                    <td>{report.tree.remaining}</td>
                    <td>%{report.tree.percent}</td>
                  </tr>
                  <tr>
                    <td>Sebzeler</td>
                    <td>{report.veg.total}</td>
                    <td>{report.veg.done}</td>
                    <td>{report.veg.remaining}</td>
                    <td>%{report.veg.percent}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th>Toplam</th>
                    <th>{report.total.total}</th>
                    <th>{report.total.done}</th>
                    <th>{report.total.remaining}</th>
                    <th>%{report.total.percent}</th>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Export & grafik butonları */}
            <div className="report-actions-row">
              <button className="btn" type="button" onClick={handleDownloadCSV}>
                CSV olarak indir
              </button>
              <button className="btn" type="button" onClick={handleDownloadPDF}>
                PDF olarak indir
              </button>
              <button
                className="btn secondary-btn"
                type="button"
                onClick={() => setShowCharts((v) => !v)}
              >
                {showCharts ? 'Grafikleri gizle' : 'Grafikleri göster'}
              </button>
            </div>

            {/* Grafikler */}
            {showCharts && (
              <div className="report-charts">
                <div className="report-chart-card">
                  <h4>Genel Tamamlanma</h4>
                  <p className="muted" style={{ marginBottom: 4 }}>
                    {report.total.done}/{report.total.total} görev tamamlandı.
                  </p>
                  <div className="chart-wrapper chart-wrapper-sm">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                    <div className="chart-center-label">
                      %{report.total.percent}
                    </div>
                  </div>
                </div>

                <div className="report-chart-card">
                  <h4>Kategori Bazlı Tamamlanma</h4>
                  <p className="muted" style={{ marginBottom: 4 }}>
                    Ağaç – Sebze – Toplam karşılaştırması
                  </p>
                  <div className="chart-wrapper chart-wrapper-sm">
                    <Bar data={chartData} options={barOptions} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!report && !loading && !error && (
          <p className="muted">
            Bir ay seçip <strong>“Raporu Oluştur”</strong> butonuna basarak
            özet raporu görebilirsin.
          </p>
        )}
      </div>

      {/* ===================== GEÇMİŞ RAPOR ===================== */}
      <div className="card report-card">
        <div className="section-header">
          <h3>GEÇMİŞ BAKIM RAPORU (Ağaç + Sebze)</h3>
          <button
            className="btn"
            type="button"
            onClick={() => {
              const next = !historyVisible;
              setHistoryVisible(next);
              if (next && historyItems.length === 0) loadHistory();
            }}
            disabled={historyLoading}
          >
            {historyLoading ? 'Yükleniyor...' : (historyVisible ? 'Raporu Gizle' : 'Raporu Getir')}
          </button>
        </div>

        {historyVisible && (
          <>
            {historyError && <p className="error-text">{historyError}</p>}

            {historyItems.length === 0 && !historyLoading && !historyError && (
              <p className="muted">Tamamlanmış bakım kaydı bulunamadı.</p>
            )}

            {historyItems.length > 0 && historyItems[0].type && (
              <ul className="history-list">
                {historyItems.map((h, i) => (
                  <li key={i} className="history-item">
                    <span className="history-type">{h.type}</span>
                    <span className="history-name">
                      {h.kind} – {h.name}
                    </span>
                    <span className="history-task">{h.task}</span>
                    <span className="history-month">{h.month}. Ay</span>
                    <span className="history-date">
                      {h.completedAt
                        ? new Date(h.completedAt).toLocaleDateString('tr-TR')
                        : '-'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}







/* -------------------- ANA APP -------------------- */

/* -------------------- ANA APP -------------------- */

function App() {
  const [token, setToken] = useState(null);
  const [, setUsername] = useState(''); // username unused, keeping setUsername
  const [tab, setTab] = useState(() => {
    // Sayfa yüklenirken localStorage'dan tab değerini oku
    const savedTab = localStorage.getItem('sg_current_tab');
    return savedTab || 'home';
  });
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false); // 👈 yeni
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushError, setPushError] = useState('');
  const [reminderMonth, setReminderMonth] = useState(
    new Date().getMonth() + 1
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('sg_token');
    const storedUser = localStorage.getItem('sg_username');
    if (storedToken) setToken(storedToken);
    if (storedUser) setUsername(storedUser);

    if (typeof Notification !== 'undefined') {
      if (Notification.permission === 'granted') {
        setPushEnabled(true);
      }
    }
  }, []);

  // Ayarları yükle ve uygula
  useEffect(() => {
    const applySettings = () => {
      const settings = loadSettings();

      // Tema ayarı
      if (settings.appearance?.theme) {
        const theme = settings.appearance.theme;
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');

        if (theme === 'auto') {
          // Sistem tercihini kontrol et
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        } else {
          document.body.classList.add(`theme-${theme}`);
        }
      }

      // Renk şeması
      if (settings.appearance?.colorScheme) {
        document.body.classList.remove('color-green', 'color-blue', 'color-brown', 'color-purple');
        document.body.classList.add(`color-${settings.appearance.colorScheme}`);
      }

      // Yazı boyutu
      if (settings.appearance?.fontSize) {
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${settings.appearance.fontSize}`);
      }
    };

    applySettings();

    // Settings değiştiğinde tekrar uygula
    const handleSettingsChange = () => applySettings();
    window.addEventListener('storage', handleSettingsChange);
    window.addEventListener('sg-settings-changed', handleSettingsChange);

    return () => {
      window.removeEventListener('storage', handleSettingsChange);
      window.removeEventListener('sg-settings-changed', handleSettingsChange);
    };
  }, []);

  // Tab değiştiğinde localStorage'a kaydet ve yukarı kaydır
  useEffect(() => {
    localStorage.setItem('sg_current_tab', tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  // Scroll listener - "Yukarı Çık" butonunu göster/gizle
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (jwtToken, user) => {
    setToken(jwtToken);
    setUsername(user);
    localStorage.setItem('sg_token', jwtToken);
    localStorage.setItem('sg_username', user);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    localStorage.removeItem('sg_token');
    localStorage.removeItem('sg_username');
  };

  // Sayfayı yukarı kaydır
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tarayıcı tespiti
  const detectBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('edg/')) return 'edge';
    if (userAgent.includes('opr/') || userAgent.includes('opera')) return 'opera';
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
    if (userAgent.includes('firefox')) return 'firefox';
    return 'unknown';
  };

  const subscribeToPush = async () => {
    setPushError('');

    const browser = detectBrowser();
    console.log('Tespit edilen tarayıcı:', browser);

    // Tarayıcı desteği kontrolü
    if (!('serviceWorker' in navigator)) {
      setPushError('Tarayıcın Service Worker desteklemiyor.');
      return;
    }

    if (typeof Notification === 'undefined') {
      setPushError('Tarayıcın bildirim özelliğini desteklemiyor.');
      return;
    }

    // Safari özel kontrol
    if (browser === 'safari') {
      if (!('pushManager' in ServiceWorkerRegistration.prototype)) {
        setPushError('Safari tarayıcınızda Push API desteklenmiyor. macOS 12.1+ veya iOS 16.4+ gereklidir.');
        return;
      }
    }

    try {
      // Bildirim izni isteme (tarayıcıya özel)
      let permission;

      if (browser === 'safari') {
        // Safari için özel izin kontrolü
        if (window.safari && window.safari.pushNotification) {
          // Eski Safari push notification API
          setPushError('Safari için Web Push henüz tam desteklenmiyor. Lütfen Chrome, Firefox veya Edge kullanın.');
          return;
        }
        permission = await Notification.requestPermission();
      } else {
        // Chrome, Firefox, Edge, Opera için standart
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        setPushError('Bildirim izni verilmedi. Tarayıcı ayarlarından izin verebilirsiniz.');
        return;
      }

      // Service Worker kaydını bekle
      const registration = await navigator.serviceWorker.ready;

      // Mevcut aboneliği kontrol et
      let subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        console.log('Mevcut abonelik bulundu, güncelleniyor...');
      }

      // Push Manager aboneliği oluştur (tarayıcıya özel ayarlar)
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      };

      // Firefox için ek ayarlar
      if (browser === 'firefox') {
        console.log('Firefox için push ayarları yapılandırılıyor...');
      }

      // Chrome/Edge/Opera için ek ayarlar
      if (browser === 'chrome' || browser === 'edge' || browser === 'opera') {
        console.log(`${browser.toUpperCase()} için push ayarları yapılandırılıyor...`);
      }

      subscription = await registration.pushManager.subscribe(subscribeOptions);

      // Sunucuya gönder
      const res = await fetch(`${API_URL}/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...subscription.toJSON(),
          browser: browser,
          userAgent: navigator.userAgent
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.message || 'Sunucuya push aboneliği kaydedilemedi.'
        );
      }

      setPushEnabled(true);
      console.log(`${browser.toUpperCase()} için push bildirimleri başarıyla etkinleştirildi!`);

      // Toplam abonelik sayısı
      const totalSubs = data.totalSubscriptions || 1;
      console.log(`Toplam aktif abonelik: ${totalSubs}`);

      // Test bildirimi gönder (tarayıcıya özel)
      let successMessage = '';
      if (browser === 'firefox') {
        successMessage = `Firefox için bildirimler etkinleştirildi!`;
      } else if (browser === 'safari') {
        successMessage = `Safari için bildirimler etkinleştirildi!`;
      } else {
        successMessage = `${browser.toUpperCase()} için bildirimler etkinleştirildi!`;
      }

      if (totalSubs > 1) {
        successMessage += `\n\nToplam ${totalSubs} cihaz/tarayıcıda bildirimler aktif.`;
      }

      alert(successMessage);

    } catch (err) {
      console.error('Push abonelik hatası:', err);

      // Tarayıcıya özel hata mesajları
      let errorMessage = 'Push aboneliği yapılamadı.';

      if (browser === 'firefox' && err.message.includes('subscription')) {
        errorMessage = 'Firefox için push aboneliği oluşturulamadı. Tarayıcı ayarlarınızı kontrol edin.';
      } else if (browser === 'safari') {
        errorMessage = 'Safari için push desteği sınırlıdır. Chrome veya Firefox kullanmanızı öneririz.';
      } else if (err.message.includes('permissions')) {
        errorMessage = 'Bildirim izinleri reddedildi. Tarayıcı ayarlarından izin vermelisiniz.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setPushError(errorMessage);
    }
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-box" onClick={() => setTab('home')} style={{ cursor: 'pointer' }}>
            <img
              src={`${API_URL.replace('/api', '')}/uploads/logo.png`}
              alt={loadSettings().profile.siteTitle || 'Akıllı Bahçe'}
              className="app-logo"
            />
            <span className="app-title">{loadSettings().profile.siteTitle || 'Akıllı Bahçe'}</span>
          </div>

        </div>

        <div className="header-right">
          <div className="mobile-header-info">
            <WeatherWidgeth token={token} />
          </div>

          <button
            type="button"
            className="tabs-hamburger"
            onClick={() => setMobileTabsOpen((open) => !open)}
          >
            ☰
          </button>

          {/* --- HAVA DURUMU + SAAT YANYANA --- */}
          <div className="weather-clock-row">
            <WeatherWidget token={token} />


          </div>

          {/* --- Çıkış + Bildirimler Butonları --- */}
          <div className="user-controls-row">

            <button className="btn icon-btn" onClick={handleLogout}>
              <span className="btn-icon">🚪</span>
              <span>Çıkış Yap</span>
            </button>

            {typeof Notification !== 'undefined' && 'serviceWorker' in navigator && (
              <button
                className="btn icon-btn"
                onClick={subscribeToPush}
                disabled={pushEnabled}
              >
                <span className="btn-icon">🔔</span>
                <span>{pushEnabled ? 'Bildirimler açık' : 'Bildirimleri aç'}</span>
              </button>
            )}
          </div>
        </div>
      </header>


      {pushError && <p className="error-text">{pushError}</p>}

      <div className="tabs-wrapper">

        {/* Mobil açılır menü (sekme listesi + en altta çıkış/bildirim) */}
        {mobileTabsOpen && (
          <div className="tabs-mobile-menu">
            <div className="tabs-mobile-items">
              <button
                className={`tabs-mobile-item ${tab === 'home' ? 'active' : ''}`}
                onClick={() => {
                  setTab('home');
                  setMobileTabsOpen(false);
                }}
              >
                Home
              </button>
              <button
                className={`tabs-mobile-item ${tab === 'trees' ? 'active' : ''}`}
                onClick={() => {
                  setTab('trees');
                  setMobileTabsOpen(false);
                }}
              >
                Ağaçlar
              </button>
              <button
                className={`tabs-mobile-item ${tab === 'vegetables' ? 'active' : ''}`}
                onClick={() => {
                  setTab('vegetables');
                  setMobileTabsOpen(false);
                }}
              >
                Sebzeler
              </button>
              <button
                className={`tabs-mobile-item ${tab === 'reminders' ? 'active' : ''
                  }`}
                onClick={() => {
                  setTab('reminders');
                  setMobileTabsOpen(false);
                }}
              >
                Hatırlatmalar
              </button>
              <button
                className={`tabs-mobile-item ${tab === 'calendar' ? 'active' : ''
                  }`}
                onClick={() => {
                  setTab('calendar');
                  setMobileTabsOpen(false);
                }}
              >
                Takvim
              </button>
              <button
                className={`tabs-mobile-item ${tab === 'reports' ? 'active' : ''}`}
                onClick={() => {
                  setTab('reports');
                  setMobileTabsOpen(false);
                }}
              >
                Raporlar
              </button>
              <button
                className={`tabs-mobile-item ${tab === 'weather' ? 'active' : ''}`}
                onClick={() => {
                  setTab('weather');
                  setMobileTabsOpen(false);
                }}
              >
                Hava Durumu
              </button>
              {/* 🗺️ HARİTA TAB BUTONU */}
              <button
                className={`tabs-mobile-item ${tab === 'map' ? 'active' : ''}`}
                onClick={() => {
                  setTab('map');
                  setMobileTabsOpen(false);
                }}
              >
                Harita
              </button>

              <button
                className={`tabs-mobile-item ${tab === 'settings' ? 'active' : ''}`}
                onClick={() => {
                  setTab('settings');
                  setMobileTabsOpen(false);
                }}
              >
                Ayarlar
              </button>
            </div>

            {/* 👇 Mobilde MENÜN EN ALTINDA ÇIKIŞ & BİLDİRİM */}
            <div className="tabs-mobile-footer">
              <button
                className="btn icon-btn"
                onClick={() => {
                  handleLogout();
                  setMobileTabsOpen(false);
                }}
              >
                <span className="btn-icon">🚪</span>
                <span>Çıkış Yap</span>
              </button>

              {typeof Notification !== 'undefined' && 'serviceWorker' in navigator && (
                <button
                  className="btn icon-btn"
                  onClick={() => {
                    subscribeToPush();
                    setMobileTabsOpen(false);
                  }}
                  disabled={pushEnabled}
                >
                  <span className="btn-icon">🔔</span>
                  <span>
                    {pushEnabled ? 'Bildirimler açık' : 'Bildirimleri aç'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop’ta görünen normal sekmeler */}




      <nav className="tabs">
        <button
          className={`tab ${tab === 'home' ? 'active' : ''}`}
          onClick={() => setTab('home')}
        >
          Home
        </button>
        <button
          className={`tab ${tab === 'trees' ? 'active' : ''}`}
          onClick={() => setTab('trees')}
        >
          Ağaçlar
        </button>
        <button
          className={`tab ${tab === 'vegetables' ? 'active' : ''}`}
          onClick={() => setTab('vegetables')}
        >
          Sebzeler
        </button>
        <button
          className={`tab ${tab === 'reminders' ? 'active' : ''}`}
          onClick={() => setTab('reminders')}
        >
          Hatırlatmalar
        </button>
        <button
          className={`tab ${tab === 'calendar' ? 'active' : ''}`}
          onClick={() => setTab('calendar')}
        >
          Takvim
        </button>
        <button
          className={`tab ${tab === 'reports' ? 'active' : ''}`}
          onClick={() => setTab('reports')}
        >
          Raporlar
        </button>
        <button
          className={`tab ${tab === 'weather' ? 'active' : ''}`}
          onClick={() => setTab('weather')}
        >
          Hava Durumu
        </button>
        <button
          className={`tab ${tab === 'map' ? 'active' : ''}`}
          onClick={() => setTab('map')}
        >
          Harita
        </button>
        <button
          className={`tab ${tab === 'settings' ? 'active' : ''}`}
          onClick={() => setTab('settings')}
        >
          Ayarlar
        </button>
      </nav>

      <main className="app-main">
        {tab === 'home' && (
          <div className="tab-panel">
            <Home token={token} />
          </div>
        )}
        {tab === 'trees' && (
          <div className="tab-panel">
            <TreeManager token={token} />
          </div>
        )}
        {tab === 'vegetables' && (
          <div className="tab-panel">
            <VegetableManager token={token} />
          </div>
        )}
        {tab === 'reminders' && (
          <div className="tab-panel">
            <Reminders
              token={token}
              month={reminderMonth}
              onChangeMonth={setReminderMonth}
            />
          </div>
        )}
        {tab === 'calendar' && (
          <div className="tab-panel">
            <CalendarView
              token={token}
              onSelectMonth={(m) => {
                setReminderMonth(m);
                setTab('reminders');
              }}
            />
          </div>
        )}
        {tab === 'reports' && (
          <div className="tab-panel">
            <Reports token={token} />
          </div>
        )}
        {tab === 'weather' && (
          <div className="tab-panel">
            <WeatherTab token={token} />
          </div>
        )}

        {/* 🗺️ HARİTA TAB İÇERİĞİ */}
        {tab === 'map' && (
          <div className="tab-panel map-view" style={{ overflow: 'hidden', height: 'calc(100vh - 80px)' }}>
            <GardenMapTab token={token} />
          </div>
        )}

        {tab === 'settings' && (
          <div className="tab-panel">
            <Settings token={token} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-title">🌱 {loadSettings().profile.siteTitle || 'Akıllı Bahçe'}</h3>
              <p className="footer-desc">
                {loadSettings().profile.siteDescription || 'Bahçenizi dijital dünyada yönetin. Ağaçlarınızı, sebzelerinizi takip edin, bakım zamanlarını kaçırmayın.'}
              </p>
              <p className="footer-version">v1.0.0</p>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Hızlı Erişim</h4>
              <ul className="footer-links">
                <li onClick={() => setTab('home')} style={{ cursor: 'pointer' }}>🏠 Ana Sayfa</li>
                <li onClick={() => setTab('trees')} style={{ cursor: 'pointer' }}>🌳 Ağaçlar</li>
                <li onClick={() => setTab('vegetables')} style={{ cursor: 'pointer' }}>🥕 Sebzeler</li>
                <li onClick={() => setTab('calendar')} style={{ cursor: 'pointer' }}>📅 Takvim</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Araçlar</h4>
              <ul className="footer-links">
                <li onClick={() => setTab('reminders')} style={{ cursor: 'pointer' }}>🔔 Hatırlatmalar</li>
                <li onClick={() => setTab('weather')} style={{ cursor: 'pointer' }}>🌤️ Hava Durumu</li>
                <li onClick={() => setTab('reports')} style={{ cursor: 'pointer' }}>📊 Raporlar</li>
                <li onClick={() => setTab('settings')} style={{ cursor: 'pointer' }}>⚙️ Ayarlar</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">İletişim</h4>
              <ul className="footer-links">
                <li>
                  <a href={`mailto:${loadSettings().profile.siteEmail || 'info@akillibahce.com'}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    📧 {loadSettings().profile.siteEmail || 'info@akillibahce.com'}
                  </a>
                </li>
                <li>
                  <a href={`https://${loadSettings().profile.siteWebsite || 'www.akillibahce.com'}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    🌐 {loadSettings().profile.siteWebsite || 'www.akillibahce.com'}
                  </a>
                </li>
                {(() => {
                  const whatsappNumber = loadSettings().profile.siteWhatsApp;
                  if (whatsappNumber && whatsappNumber.trim()) {
                    const cleanNumber = whatsappNumber.replace(/[\s\-()]/g, '');
                    const message = encodeURIComponent(`Merhaba! ${loadSettings().profile.siteTitle || 'Akıllı Bahçe'} hakkında bilgi almak istiyorum.`);
                    return (
                      <li>
                        <a href={`https://wa.me/${cleanNumber}?text=${message}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                          📱 WhatsApp Destek
                        </a>
                      </li>
                    );
                  } else {
                    return (
                      <li style={{ cursor: 'pointer' }} onClick={() => setTab('settings')}>
                        💬 Destek Talebi
                      </li>
                    );
                  }
                })()}
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 {loadSettings().profile.siteTitle || 'Akıllı Bahçe'} Yönetim Sistemi. Tüm hakları saklıdır.</p>
            <p className="footer-credits">Doğayla uyum içinde yaşamak için tasarlandı 🌿</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Butonu */}
      {showScrollTop && (
        <button
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          title="Yukarı Çık"
          aria-label="Yukarı Çık"
        >
          ⬆️
        </button>
      )}

      {/* Sohbet Widget Butonu */}
      <button
        className="chat-widget-btn"
        onClick={() => setShowChatWidget(!showChatWidget)}
        title="Canlı Destek"
        aria-label="Canlı Destek"
      >
        💬
      </button>

      {/* Sohbet Widget Modal */}
      {showChatWidget && (
        <div className="chat-widget-modal">
          <div className="chat-widget-header">
            <h3>💬 Canlı Destek</h3>
            <button
              className="chat-close-btn"
              onClick={() => setShowChatWidget(false)}
              aria-label="Kapat"
            >
              ✕
            </button>
          </div>
          <div className="chat-widget-body">
            <p className="chat-welcome">Merhaba! 👋</p>
            <p className="chat-info">{loadSettings().profile.siteTitle || 'Akıllı Bahçe'} destek ekibine hoş geldiniz.</p>
            <p className="chat-info">Size nasıl yardımcı olabiliriz?</p>
            <div className="chat-contact-options">
              <a href={`mailto:${loadSettings().profile.siteEmail || 'info@akillibahce.com'}`} className="chat-option">
                📧 E-posta Gönder
              </a>
              {(() => {
                const whatsappNumber = loadSettings().profile.siteWhatsApp;
                if (whatsappNumber && whatsappNumber.trim()) {
                  // Numaradan boşluk, tire vb. karakterleri temizle
                  const cleanNumber = whatsappNumber.replace(/[\s\-\(\)]/g, '');
                  // Önceden tanımlı mesaj
                  const message = encodeURIComponent(`Merhaba! ${loadSettings().profile.siteTitle || 'Akıllı Bahçe'} hakkında bilgi almak istiyorum.`);
                  return (
                    <a
                      href={`https://wa.me/${cleanNumber}?text=${message}`}
                      className="chat-option"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📱 WhatsApp ile İletişim
                    </a>
                  );
                } else {
                  return (
                    <a href="#" className="chat-option" onClick={(e) => { e.preventDefault(); alert('WhatsApp numarası ayarlardan eklenebilir! (Ayarlar → Profil & Kişiselleştirme)'); }}>
                      📱 WhatsApp
                    </a>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default App;
