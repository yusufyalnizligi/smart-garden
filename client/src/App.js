import React, { useState, useEffect } from 'react';
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


const API_URL = 'http://localhost:3000/api';
// GEÇİCİ / KOLAY ÇÖZÜM: Env yerine direkt sabit key kullan
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
  weather: {
    // İleride API tarafında şehir/birim desteği gelirse buradan yönetebiliriz
    city: 'Elazig',
    unit: 'metric'
  },
  reminders: {
    treeOnlyImportantDefault: false,
    vegOnlyImportantDefault: false,
    autoOpenSuggestions: true
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
      weather: { ...DEFAULT_SETTINGS.weather, ...(parsed.weather || {}) },
      reminders: { ...DEFAULT_SETTINGS.reminders, ...(parsed.reminders || {}) },
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
  } catch {}

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

  const handleCitySelectChange = (e) => {
    const value = e.target.value;
    setCity(value);
    try {
      localStorage.setItem('sg_city', value);
      // Header’daki widget’ı da güncelle
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
  } catch {}

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

  const dayNames = [
    'Pazar',
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi'
  ];

  

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

  const dayNames = [
    'Pazar',
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi'
  ];

  

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

function VegetableForm({ initialVeg, onSave, onCancel, token }) {
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
      setName(initialVeg.name || '');
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
      setCount(1);
      setNotes('');
      setImageUrl('');
      setImageFile(null);
      setMonthlyTasks(Array(12).fill(''));
      setCategory('genel');
    }
  }, [initialVeg]);
  
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

    let finalImageUrl = imageUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const uploadData = await uploadRes.json().catch(() => ({}));
      if (uploadRes.ok && uploadData.url) {
        finalImageUrl = uploadData.url;
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
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>{initialVeg ? 'Sebzeyi Düzenle' : 'Yeni Sebze Ekle'}</h3>

      <label>
        Sebze Adı
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: Domates"
          required
        />
      </label>

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
          <option value="yaprakli">Yapraklı (Marul, Ispanak...)</option>
          <option value="kök">Kök Sebze (Havuç, Pancar...)</option>
          <option value="meyve">Meyve Sebze (Domates, Biber...)</option>
          <option value="baklagil">Baklagil</option>
          <option value="diger">Diğer</option>
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
      src={`https://oguzemrecakil.com.tr${imageUrl}`}
      alt="Önizleme"
      loading="lazy"
       onError={(e) => {
        e.target.src = 'https://oguzemrecakil.com.tr/uploads/noimage.png';
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

function TreeForm({ initialTree, onSave, onCancel, token }) {
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
      setName(initialTree.name || '');
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
      setCount(1);
      setNotes('');
      setImageUrl('');
      setImageFile(null);
      setMonthlyTasks(Array(12).fill(''));

      // 🆕
      setCategory('genel');
    }
  }, [initialTree]);

  const handleTaskChange = (index, value) => {
    const copy = [...monthlyTasks];
    copy[index] = value;
    setMonthlyTasks(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = imageUrl;

    // Yeni dosya seçildiyse sunucuya yükle
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const uploadData = await uploadRes.json().catch(() => ({}));
      if (uploadRes.ok && uploadData.url) {
        finalImageUrl = uploadData.url;
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
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>{initialTree ? 'Ağacı Düzenle' : 'Yeni Ağaç Ekle'}</h3>

      <label>
        Ağaç Adı
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: Elma Ağacı"
          required
        />
      </label>

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
        Ağaç Kategorisi
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="meyve">Meyve Ağacı</option>
          <option value="sus">Süs Ağacı</option>
          <option value="igne-yaprakli">İğne Yapraklı</option>
          <option value="diger">Diğer</option>
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
      src={`https://oguzemrecakil.com.tr${imageUrl}`}
      alt="Önizleme"
      loading="lazy" 
      onError={(e) => {
        e.target.src = 'https://oguzemrecakil.com.tr/uploads/noimage.jpg';
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

  const fetchVeggies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/vegetables`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Sebzeler alınamadı.');
      }
      setVeggies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeggies();
  }, [token]);

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

  const handleSave = async (vegData) => {
    try {
      let url = `${API_URL}/vegetables`;
      let method = 'POST';

      if (editingVeg) {
        url = `${API_URL}/vegetables/${editingVeg._id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(vegData)
      });

      const data = await res.json().catch(() => ({}));

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

      const updatedVeg = data.vegetable || data;

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

  return (
    <div>
      <div className="section-header">
        <h2>Sebzeler</h2>
        <button className="btn primary" onClick={handleCreate}>
          + Yeni Sebze
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="cards-grid">
        {veggies.map((veg) => {
          const totalTasks = veg.maintenance?.length || 0;
          const doneTasks =
            veg.maintenance?.filter((m) => m.completed).length || 0;
          const completion = totalTasks
            ? Math.round((doneTasks / totalTasks) * 100)
            : 0;

          return (
            <div
              key={veg._id}
              className="tree-card"
              onClick={() => setSelectedVeg(veg)}
            >
              <div className="tree-card-image-wrapper">
                <img
  src={`https://oguzemrecakil.com.tr${
    veg.imageUrl || '/uploads/noimage.png'
  }`}
  alt={veg.name}
  className="tree-card-image"
  loading="lazy"
  onError={(e) => {
    e.target.src =
      'https://oguzemrecakil.com.tr/uploads/noimage.png';
  }}
/>
              </div>

              <div className="tree-card-body">
                <div className="tree-card-header-row">
                  <h3>{veg.name}</h3>

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
            <p>
              <strong>Adet:</strong> {selectedVeg.count}
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
              <ul className="maintenance-list">
               {selectedVeg.maintenance.map((m) => {
  const text = m.tasks || 'Görev girilmemiş';
  const isImportant = /budama|ilaç|sulama|gübre/i.test(text);
  const tag = classifyMaintenanceTask(text);

  return (
    <li
      key={m._id || `${selectedVeg._id}-${m.month}`}
      className={
        'maintenance-item ' +
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
      {m.completed && (
        <span className="maintenance-check">✅</span>
      )}
      <span className="maintenance-month-chip">
        {monthNames[m.month - 1]}
      </span>
      <span className={`maintenance-tag ${tag.className}`}>
        {tag.label}
      </span>
      <span className="maintenance-task">{text}</span>
    </li>
  );
})}

              </ul>
            ) : (
              <p className="maintenance-empty">
                Bakım planı girilmemiş.
              </p>
            )}

            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => handleEdit(selectedVeg)}
              >
                Düzenle
              </button>
              <button
                className="btn danger"
                onClick={() => handleDelete(selectedVeg._id)}
              >
                Sil
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

  const fetchTrees = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/trees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Ağaçlar alınamadı.');
      }
      setTrees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrees();
  }, [token]);

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

  const handleSave = async (treeData) => {
    try {
      let url = `${API_URL}/trees`;
      let method = 'POST';

      if (editingTree) {
        url = `${API_URL}/trees/${editingTree._id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(treeData)
      });

      const data = await res.json().catch(() => ({}));

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

  return (
    <div>
      <div className="section-header">
        <h2>Ağaçlar</h2>
        <button className="btn primary" onClick={handleCreate}>
          + Yeni Ağaç
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="cards-grid">
        {trees.map((tree) => {
          const totalTasks = tree.maintenance?.length || 0;
          const doneTasks =
            tree.maintenance?.filter((m) => m.completed).length || 0;
          const completion = totalTasks
            ? Math.round((doneTasks / totalTasks) * 100)
            : 0;

          return (
            <div
              key={tree._id}
              className="tree-card"
              onClick={() => setSelectedTree(tree)}
            >
              <div className="tree-card-image-wrapper">
             <img
  src={`https://oguzemrecakil.com.tr${
    tree.imageUrl || '/uploads/noimage.jpg'
  }`}
  alt={tree.name}
  className="tree-card-image"
  loading="lazy"
  onError={(e) => {
    e.target.src =
      'https://oguzemrecakil.com.tr/uploads/noimage.jpg';
  }}
/>
              </div>

              <div className="tree-card-body">
                <div className="tree-card-header-row">
                  <h3>{tree.name}</h3>

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
            <p>
              <strong>Adet:</strong> {selectedTree.count}
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
              <ul className="maintenance-list">
                {selectedTree.maintenance.map((m) => {
  const text = m.tasks || 'Görev girilmemiş';
  const isImportant = /budama|ilaç|sulama|gübre/i.test(text);
  const tag = classifyMaintenanceTask(text);

  return (
    <li
      key={m._id || `${selectedTree._id}-${m.month}`}
      className={
        'maintenance-item ' +
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
      {m.completed && (
        <span className="maintenance-check">✅</span>
      )}
      <span className="maintenance-month-chip">
        {monthNames[m.month - 1]}
      </span>
      <span className={`maintenance-tag ${tag.className}`}>
        {tag.label}
      </span>
      <span className="maintenance-task">{text}</span>
    </li>
  );
})}

              </ul>
            ) : (
              <p className="maintenance-empty">Bakım planı girilmemiş.</p>
            )}

            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => handleEdit(selectedTree)}
              >
                Düzenle
              </button>
              <button
                className="btn danger"
                onClick={() => handleDelete(selectedTree._id)}
              >
                Sil
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

  
    const fetchSuggestions = async () => {
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
      setSuggestionsVisible(true); // 🆕 getirince otomatik göster
    } catch (err) {
      setSuggestionsError(err.message || 'Öneriler alınırken hata oluştu.');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  
  
  
  
  const fetchTreeReminders = async (m) => {
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
  };

  const fetchVegReminders = async (m) => {
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
  };

  useEffect(() => {
    fetchTreeReminders(month);
    fetchVegReminders(month);

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
  }, [month, token]);
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
    } catch (err) {
      console.error('Sebze kart tamamla hatası:', err);
      alert('Sunucu hatası.');
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
        <div className="section-header">
          <h3>{monthNames[month - 1]} ayı için bildirim gönder (Ağaçlar)</h3>
        </div>

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

      <hr style={{ margin: '24px 0' }} />

      {/* Sebze bildirim butonları */}
      <div className="card">
        <div className="section-header">
          <h3>{monthNames[month - 1]} ayı için bildirim gönder (Sebzeler)</h3>
        </div>
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
    </div>
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

  let treeTasks = 0;
  let treeDone = 0;
  let vegTasks = 0;
  let vegDone = 0;
  

  trees.forEach((t) => {
    (t.maintenance || []).forEach((m) => {
      if (m.month === currentMonth) {
        treeTasks++;
        if (m.completed) treeDone++;
      }
    });
  });

  veggies.forEach((v) => {
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

  const dateStr = `${dayNames[now.getDay()]} ${now.getDate()} ${
    monthNames[now.getMonth()]
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

  return (
    <div className="home-page">
      <div className="home-header-row">
        <div className="home-card">
          <h2>Bugünün Özeti</h2>
          <p className="home-date-line">
            📅 {dateStr} · ⏰ {timeStr}
          </p>
          <p className="muted">
            {monthNames[currentMonth - 1]} ayı için görevlerinin özetini
            aşağıda görebilirsin.
          </p>
        </div>

        <div className="home-card">
          <h3>Bahçe Genel Durum</h3>
          {loading && <p>Yükleniyor...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && (
            <ul className="home-stats-list">
              <li>
                🌳 Toplam ağaç: <strong>{trees.length}</strong>
              </li>
              <li>
                🥬 Toplam sebze: <strong>{veggies.length}</strong>
              </li>
            </ul>
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
  const [settings, setSettings] = useState(() => loadSettings());
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');

  const updateSettings = (updater) => {
    setSettings((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveSettings(next);
      return next;
    });
    setSaving(true);
    setTimeout(() => setSaving(false), 400);
  };

  const handleToggle = (path) => {
    updateSettings((prev) => {
      const next = { ...prev };
      const [section, key] = path.split('.');
      next[section] = { ...next[section], [key]: !next[section][key] };
      return next;
    });
  };

  const handleSelectChange = (path, value) => {
    updateSettings((prev) => {
      const next = { ...prev };
      const [section, key] = path.split('.');
      next[section] = { ...next[section], [key]: value };
      return next;
    });
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
 const [city, setCity] = useState(() => {
    try {
      return localStorage.getItem('sg_city') || 'Elazig';
    } catch {
      return 'Elazig';
    }
  });

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    try {
      localStorage.setItem('sg_city', value);
      // Hava durumu widget'ına haber ver
      window.dispatchEvent(new Event('sg-city-changed'));
    } catch (err) {
      console.warn('Şehir ayarı kaydedilemedi:', err);
    }
  };
  return (
    <div className="settings-page">
      <div className="settings-header-row">
        <div>
          <h2>Ayarlar</h2>
          <p className="muted">
            Uygulamanın bazı varsayılan davranışlarını burada
            özelleştirebilirsin.
          </p>
        </div>
        {saving && <span className="settings-status">Kaydedildi ✓</span>}
      </div>

      <div className="settings-grid">
        {/* Bildirim & Hatırlatma */}
        <section className="settings-section">
          <h3>Bildirim &amp; Hatırlatma</h3>
          <p className="settings-section-desc">
            Aylık bakım hatırlatmalarının varsayılan davranışlarını ayarla.
          </p>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">
                Önemli ağaç görevleri öncelikli olsun
              </div>
              <div className="settings-item-desc">
                Hatırlatma ekranına girdiğinde varsayılan olarak sadece
                budama, ilaçlama, gübreleme gibi <strong>önemli</strong>{' '}
                ağaç görevleri seçili gelsin.
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.reminders.treeOnlyImportantDefault}
                onChange={() =>
                  handleToggle('reminders.treeOnlyImportantDefault')
                }
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">
                Önemli sebze görevleri öncelikli olsun
              </div>
              <div className="settings-item-desc">
                Sebze hatırlatmalarında da varsayılan filtreyi sadece
                önemli görevlere ayarla.
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.reminders.vegOnlyImportantDefault}
                onChange={() =>
                  handleToggle('reminders.vegOnlyImportantDefault')
                }
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
                Hatırlatmalar sayfasına girdiğinde otomatik olarak
                &quot;Otomatik Bakım Önerileri&quot; paneli açık olsun.
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

        {/* Tarih & Saat */}
        <section className="settings-section">
          <h3>Tarih &amp; Saat</h3>
          <p className="settings-section-desc">
            Uygulama içinde görünen tarih ve saat biçimini belirle.
          </p>

          <div className="settings-item">
            <div>
              <div className="settings-item-title">Tarih formatı</div>
              <div className="settings-item-desc">
                Şimdilik sadece bilgi amaçlı; tarih gösterimleri
                ileride bu seçime göre ayarlanacak.
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.ui.dateFormat}
              onChange={(e) =>
                handleSelectChange('ui.dateFormat', e.target.value)
              }
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
                Saat satırlarının nasıl gösterileceğini belirle.
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.ui.timeFormat}
              onChange={(e) =>
                handleSelectChange('ui.timeFormat', e.target.value)
              }
            >
              <option value="HH:mm">24 saat (14:30)</option>
              <option value="hh:mm">12 saat (02:30)</option>
            </select>
          </div>

<div className="settings-item">
            <div>
              <div className="settings-item-title">Varsayılan il</div>
              <div className="settings-item-desc">
                 Header&apos;daki hava durumu ve şehir bilgisini bu il üzerinden
            göster.
              </div>
            </div>
             <select
          className="settings-select"
          value={city}
          onChange={handleCityChange}
        >
          <option value="Elazig">Elazığ</option>
          <option value="Istanbul">İstanbul</option>
          <option value="Ankara">Ankara</option>
          <option value="Izmir">İzmir</option>
          <option value="Bursa">Bursa</option>
          <option value="Antalya">Antalya</option>
        </select>
          </div>


        </section>

        {/* Veri yönetimi */}
        <section className="settings-section">
          <h3>Veri Yönetimi</h3>
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
            onClick={loadHistory}
            disabled={historyLoading}
          >
            {historyLoading ? 'Yükleniyor...' : 'Raporu Getir'}
          </button>
        </div>

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
      </div>
    </div>
  );
}


 




/* -------------------- ANA APP -------------------- */

/* -------------------- ANA APP -------------------- */

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [tab, setTab] = useState('home'); // varsayılan HOME
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false); // 👈 yeni
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushError, setPushError] = useState('');
  const [reminderMonth, setReminderMonth] = useState(
    new Date().getMonth() + 1
  );

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

  const subscribeToPush = async () => {
    setPushError('');

    if (
      !('serviceWorker' in navigator) ||
      typeof Notification === 'undefined'
    ) {
      setPushError('Tarayıcın push bildirimlerini desteklemiyor.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushError('Bildirim izni verilmedi.');
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      const res = await fetch(`${API_URL}/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(subscription)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.message || 'Sunucuya push aboneliği kaydedilemedi.'
        );
      }

      setPushEnabled(true);
    } catch (err) {
      console.error(err);
      setPushError(err.message || 'Push aboneliği yapılamadı.');
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
  alt="Akıllı Bahçe"
  className="app-logo"
/>
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
          className={`tabs-mobile-item ${
            tab === 'reminders' ? 'active' : ''
          }`}
          onClick={() => {
            setTab('reminders');
            setMobileTabsOpen(false);
          }}
        >
          Hatırlatmalar
        </button>
        <button
          className={`tabs-mobile-item ${
            tab === 'calendar' ? 'active' : ''
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



  {tab === 'settings' && (
    <div className="tab-panel">
      <Settings token={token} />
    </div>
  )}
</main>
    </div>
  );
}


export default App;
