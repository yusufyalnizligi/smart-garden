# Akıllı Bahçe Yönetim Sistemi

Modern bahçe ve tarımsal alan yönetimi için geliştirilmiş full-stack web uygulaması.

## Özellikler

- 🌳 Ağaç ve sebze envanteri yönetimi
- 📅 Otomatik bakım planlama ve hatırlatmalar
- 🌤️ Hava durumu entegrasyonu (OpenWeatherMap)
- 📊 İstatistik ve raporlama (Chart.js)
- 📧 E-posta bildirimleri
- 🔔 Push bildirimleri (PWA)
- 📱 Responsive ve mobile-friendly tasarım
- 🌙 Dark mode desteği
- 📴 Offline çalışma desteği

## Teknoloji Stack

### Frontend
- React 19.2.0
- Chart.js 4.5.1
- Progressive Web App (PWA)
- Service Worker

### Backend
- Node.js + Express.js 4.18.0
- MongoDB + Mongoose 7.6.3
- JWT Authentication
- Multer (dosya yükleme)
- Nodemailer (e-posta)
- Web-push (push bildirimleri)

## Kurulum

### Gereksinimler
- Node.js 16 veya üzeri
- MongoDB Atlas hesabı
- OpenWeatherMap API key
- Gmail hesabı (SMTP için)

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/yusufyalnizligi/smart-garden.git
cd smart-garden
```

2. **Server kurulumu**
```bash
cd server
npm install
```

3. **Client kurulumu**
```bash
cd ../client
npm install
```

4. **Environment variables**

`server/.env` dosyası oluşturun:
```bash
cp server/.env.example server/.env
```

Gerekli değişkenleri doldurun:
- `MONGO_URI`: MongoDB bağlantı URL'i
- `JWT_SECRET`: JWT için secret key
- `WEATHER_API_KEY`: OpenWeatherMap API key
- `SMTP_USER`, `SMTP_PASS`: Gmail SMTP bilgileri
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`: Web push için VAPID keys

`client/.env` dosyası oluşturun:
```bash
cp client/.env.example client/.env
```

5. **Uygulamayı çalıştırın**

Backend:
```bash
cd server
npm run dev
```

Frontend (yeni terminal):
```bash
cd client
npm start
```

Uygulama `http://localhost:3001` adresinde açılacaktır.

## Varsayılan Giriş

- **Kullanıcı Adı:** admin
- **Şifre:** admin123

## Proje Yapısı

```
smart-garden/
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express backend
│   ├── server.js
│   ├── .env
│   └── package.json
├── static/          # Derlenmiş assets
└── README.md
```

## API Endpoints

- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/trees` - Ağaçları listele
- `POST /api/trees` - Yeni ağaç ekle
- `GET /api/vegetables` - Sebzeleri listele
- `POST /api/vegetables` - Yeni sebze ekle
- `GET /api/weather` - Hava durumu
- `GET /api/reminders/:month` - Aylık hatırlatmalar
- `POST /api/push/subscribe` - Push bildirim aboneliği

## Lisans

MIT

## Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açın.
