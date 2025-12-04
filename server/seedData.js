const mongoose = require('mongoose');
require('dotenv').config();

// Schema tanımları
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
    imageUrl: { type: String, default: '/uploads/noimage.png' },
    category: { type: String, default: 'genel' },
    maintenance: [maintenanceSchema]
  },
  { timestamps: true }
);

const Tree = mongoose.model('Tree', treeSchema);
const Vegetable = mongoose.model('Vegetable', vegetableSchema);

// AĞAÇ VERİLERİ
const treeData = [
  // MEYVE AĞAÇLARI
  {
    name: 'Elma',
    category: 'meyve',
    notes: 'Soğuk iklime dayanıklı, verimli meyve ağacı',
    maintenance: [
      { month: 1, tasks: 'Kış budaması, kuru dal temizliği, kış ilaçlaması' },
      { month: 2, tasks: 'Budama işlemlerinin tamamlanması, organik gübre uygulaması' },
      { month: 3, tasks: 'İlkbahar ilaçlaması, toprak işleme, zararlı kontrolü' },
      { month: 4, tasks: 'Çiçeklenme dönemi takibi, arı faaliyeti kontrolü, sulama başlangıcı' },
      { month: 5, tasks: 'Meyve seyreltme, düzenli sulama, yeşil ilaçlama' },
      { month: 6, tasks: 'Düzenli sulama, zararlı takibi, ot kontrolü' },
      { month: 7, tasks: 'Hasat başlangıcı (erken çeşitler), sulama devam' },
      { month: 8, tasks: 'Ana hasat dönemi, düzenli toplama, depolama' },
      { month: 9, tasks: 'Geç hasat, hasat sonrası budama, gübre uygulaması' },
      { month: 10, tasks: 'Sonbahar ilaçlaması, toprak hazırlığı, kış hazırlığı' },
      { month: 11, tasks: 'Kış öncesi son kontroller, organik materyal örtüsü' },
      { month: 12, tasks: 'Kış koruma önlemleri, kuru dal temizliği başlangıcı' }
    ]
  },
  {
    name: 'Armut',
    category: 'meyve',
    notes: 'Hassas meyve yapısı, dikkatli bakım gerektirir',
    maintenance: [
      { month: 1, tasks: 'Kış budaması, hastalık kontrolü, ilaçlama' },
      { month: 2, tasks: 'Budama tamamlama, gübreleme, toprak hazırlığı' },
      { month: 3, tasks: 'Çiçek tomurcuğu takibi, don koruması, ilaçlama' },
      { month: 4, tasks: 'Çiçeklenme kontrolü, tozlaşma desteği, zararlı önleme' },
      { month: 5, tasks: 'Meyve tutumu takibi, seyreltme, düzenli sulama' },
      { month: 6, tasks: 'Gelişim takibi, sulama, hastalık önleme' },
      { month: 7, tasks: 'Meyve büyüklük kontrolü, sulama artırma, destek kontrolü' },
      { month: 8, tasks: 'Erken hasat (yaz armutları), kalite kontrolü' },
      { month: 9, tasks: 'Ana hasat sezonu, dikkatli toplama, depolama' },
      { month: 10, tasks: 'Hasat tamamlama, temizlik, kış hazırlığı' },
      { month: 11, tasks: 'Yaprak dökümü kontrolü, temel bakım' },
      { month: 12, tasks: 'Kış koruma, yapı kontrolü' }
    ]
  },
  {
    name: 'Kiraz',
    category: 'meyve',
    notes: 'Erken meyve veren, yüksek ekonomik değerli ağaç',
    maintenance: [
      { month: 1, tasks: 'Hafif budama, don koruması, kış bakımı' },
      { month: 2, tasks: 'Budama tamamlama, organik gübre, toprak işleme' },
      { month: 3, tasks: 'Erken çiçeklenme takibi, don alarm sistemi, ilaçlama' },
      { month: 4, tasks: 'Çiçeklenme dönemi, tozlaşma, zararlı kontrolü' },
      { month: 5, tasks: 'Meyve gelişimi, kuş koruma ağları, sulama başlangıcı' },
      { month: 6, tasks: 'Hasat başlangıcı, düzenli toplama, meyve sineği mücadelesi' },
      { month: 7, tasks: 'Hasat sonu, hastalık önleme, sulama devam' },
      { month: 8, tasks: 'Hasat sonrası bakım, hafif budama, gübreleme' },
      { month: 9, tasks: 'Toprak bakımı, ot kontrolü, kış hazırlığı' },
      { month: 10, tasks: 'Yaprak dökümü takibi, temel bakım' },
      { month: 11, tasks: 'Kış öncesi ilaçlama, koruma önlemleri' },
      { month: 12, tasks: 'Kış dinlenme dönemi, yapı kontrolü' }
    ]
  },
  {
    name: 'Şeftali',
    category: 'meyve',
    notes: 'Hassas yapraklı, sık budama gerektiren meyve ağacı',
    maintenance: [
      { month: 1, tasks: 'Yoğun budama, yaprak kıvırcıklığı önleme ilaçlaması' },
      { month: 2, tasks: 'Budama tamamlama, organik gübre, toprak hazırlığı' },
      { month: 3, tasks: 'Erken çiçeklenme, don koruması, hastalık önleme' },
      { month: 4, tasks: 'Çiçeklenme ve meyve tutumu, seyreltme başlangıcı' },
      { month: 5, tasks: 'Yoğun meyve seyreltme, düzenli sulama, zararlı kontrolü' },
      { month: 6, tasks: 'Meyve gelişimi takibi, sulama artırma, hastalık önleme' },
      { month: 7, tasks: 'Erken hasat başlangıcı, düzenli toplama, kalite kontrolü' },
      { month: 8, tasks: 'Ana hasat dönemi, günlük toplama, pazarlama' },
      { month: 9, tasks: 'Geç hasat, hasat sonrası budama, gübreleme' },
      { month: 10, tasks: 'Yaprak dökümü kontrolü, toprak bakımı' },
      { month: 11, tasks: 'Kış hazırlığı, koruma önlemleri' },
      { month: 12, tasks: 'Kış dinlenme, yapı sağlamlığı kontrolü' }
    ]
  },
  {
    name: 'Kayısı',
    category: 'meyve',
    notes: 'Erken çiçeklenen, don riskine hassas ağaç',
    maintenance: [
      { month: 1, tasks: 'Dinlenme dönemi, hafif budama, kış koruması' },
      { month: 2, tasks: 'Budama tamamlama, gübreleme, toprak işleme' },
      { month: 3, tasks: 'Çok erken çiçeklenme, don alarm, tozlaşma desteği' },
      { month: 4, tasks: 'Meyve tutumu, seyreltme, zararlı mücadelesi' },
      { month: 5, tasks: 'Hızlı meyve gelişimi, sulama başlangıcı, hastalık önleme' },
      { month: 6, tasks: 'Erken hasat, günlük toplama, kalite kontrolü' },
      { month: 7, tasks: 'Hasat tamamlama, budama, gübreleme' },
      { month: 8, tasks: 'Hasat sonrası bakım, sulama devam, zararlı kontrolü' },
      { month: 9, tasks: 'Toprak iyileştirme, ot temizliği' },
      { month: 10, tasks: 'Sonbahar bakımı, kış hazırlığı' },
      { month: 11, tasks: 'Yaprak dökümü, koruma önlemleri' },
      { month: 12, tasks: 'Kış dinlenme, don koruması' }
    ]
  },
  {
    name: 'Erik',
    category: 'meyve',
    notes: 'Dayanıklı, çeşit çeşitliliği fazla meyve ağacı',
    maintenance: [
      { month: 1, tasks: 'Kış budaması, kuru dal temizliği' },
      { month: 2, tasks: 'Budama sonu, organik gübre uygulaması' },
      { month: 3, tasks: 'Çiçeklenme başlangıcı, ilaçlama' },
      { month: 4, tasks: 'Tozlaşma dönemi, meyve tutumu takibi' },
      { month: 5, tasks: 'Meyve seyreltme, sulama başlangıcı' },
      { month: 6, tasks: 'Meyve gelişimi, düzenli sulama' },
      { month: 7, tasks: 'Erken hasat (bazı çeşitler), meyve sineği kontrolü' },
      { month: 8, tasks: 'Ana hasat sezonu, günlük toplama' },
      { month: 9, tasks: 'Geç hasat, hasat sonrası temizlik' },
      { month: 10, tasks: 'Sonbahar ilaçlaması, toprak bakımı' },
      { month: 11, tasks: 'Kış öncesi hazırlık, temel bakım' },
      { month: 12, tasks: 'Kış dinlenme dönemi' }
    ]
  },
  {
    name: 'Vişne',
    category: 'meyve',
    notes: 'Dayanıklı, soğuğa toleranslı meyve ağacı',
    maintenance: [
      { month: 1, tasks: 'Hafif budama, kış bakımı' },
      { month: 2, tasks: 'Budama tamamlama, gübreleme' },
      { month: 3, tasks: 'Çiçek tomurcukları takibi, don koruması' },
      { month: 4, tasks: 'Çiçeklenme dönemi, tozlaşma kontrolü' },
      { month: 5, tasks: 'Meyve tutumu, kuş koruma ağları hazırlığı' },
      { month: 6, tasks: 'Hasat başlangıcı, kuş koruması, düzenli toplama' },
      { month: 7, tasks: 'Hasat sonu, hasat sonrası budama' },
      { month: 8, tasks: 'Yaz bakımı, sulama, hastalık önleme' },
      { month: 9, tasks: 'Toprak iyileştirme, ot kontrolü' },
      { month: 10, tasks: 'Sonbahar bakımı, kış hazırlığı' },
      { month: 11, tasks: 'Yaprak dökümü kontrolü' },
      { month: 12, tasks: 'Kış dinlenme, yapı kontrolü' }
    ]
  },
  {
    name: 'İncir',
    category: 'meyve',
    notes: 'Sıcak iklim seven, lezzetli meyve ağacı',
    maintenance: [
      { month: 1, tasks: 'Kış koruması, don hassasiyeti kontrolü' },
      { month: 2, tasks: 'Hafif budama, zayıf dal temizliği' },
      { month: 3, tasks: 'Sürgün kontrolü, toprak işleme' },
      { month: 4, tasks: 'İlk meyve oluşumu (yaz inciri), sulama başlangıcı' },
      { month: 5, tasks: 'Sürgün yönetimi, düzenli sulama' },
      { month: 6, tasks: 'Yaz inciri hasat, ana incir gelişimi takibi' },
      { month: 7, tasks: 'Yaz inciri hasat devam, sulama artırma' },
      { month: 8, tasks: 'Ana incir hasat başlangıcı, günlük toplama' },
      { month: 9, tasks: 'Ana incir hasat devam, kalite kontrolü' },
      { month: 10, tasks: 'Hasat sonu, toprak iyileştirme' },
      { month: 11, tasks: 'Yaprak dökümü, kış hazırlığı' },
      { month: 12, tasks: 'Kış koruması, don önlemleri' }
    ]
  },

  // NARENGİYE
  {
    name: 'Portakal',
    category: 'narenciye',
    notes: 'Subtropikal iklim isteyen, C vitamini deposu',
    maintenance: [
      { month: 1, tasks: 'Hasat devam (kış portakalları), düzenli toplama' },
      { month: 2, tasks: 'Hasat sonu, budama başlangıcı, gübreleme' },
      { month: 3, tasks: 'Çiçeklenme başlangıcı, zararlı kontrolü, sulama' },
      { month: 4, tasks: 'Yoğun çiçeklenme, tozlaşma, meyve tutumu' },
      { month: 5, tasks: 'Meyve gelişimi başlangıcı, düzenli sulama, ilaçlama' },
      { month: 6, tasks: 'Genç meyve gelişimi, sulama artırma, zararlı takibi' },
      { month: 7, tasks: 'Meyve büyümesi, yoğun sulama, hastalık önleme' },
      { month: 8, tasks: 'Meyve gelişimi devam, düzenli bakım' },
      { month: 9, tasks: 'Meyve renk değişimi başlangıcı, sulama azaltma' },
      { month: 10, tasks: 'Meyve olgunlaşma, hasat hazırlığı' },
      { month: 11, tasks: 'Erken hasat başlangıcı (bazı çeşitler)' },
      { month: 12, tasks: 'Hasat sezonu, düzenli toplama, kalite kontrolü' }
    ]
  },
  {
    name: 'Mandalina',
    category: 'narenciye',
    notes: 'Portakaldan daha dayanıklı, erken olgunlaşan',
    maintenance: [
      { month: 1, tasks: 'Hasat devam, günlük toplama, pazarlama' },
      { month: 2, tasks: 'Hasat sonu, budama, gübreleme' },
      { month: 3, tasks: 'Bahar sürgünleri, çiçek tomurcukları, ilaçlama' },
      { month: 4, tasks: 'Çiçeklenme dönemi, tozlaşma desteği' },
      { month: 5, tasks: 'Meyve tutumu, seyreltme, sulama başlangıcı' },
      { month: 6, tasks: 'Genç meyve gelişimi, düzenli sulama' },
      { month: 7, tasks: 'Meyve büyümesi, zararlı kontrolü' },
      { month: 8, tasks: 'Gelişim devam, sulama devam' },
      { month: 9, tasks: 'Meyve renklenmesi başlangıcı, sulama azaltma' },
      { month: 10, tasks: 'Erken çeşit hasat başlangıcı, kalite kontrolü' },
      { month: 11, tasks: 'Ana hasat sezonu, günlük toplama' },
      { month: 12, tasks: 'Hasat devam, depolama, pazarlama' }
    ]
  },
  {
    name: 'Limon',
    category: 'narenciye',
    notes: 'Yıl boyunca meyve veren, hassas ağaç',
    maintenance: [
      { month: 1, tasks: 'Kış hasadı, don koruması (sıcak bölgeler dışında)' },
      { month: 2, tasks: 'Budama, şekillendirme, gübreleme' },
      { month: 3, tasks: 'İlkbahar çiçeklenmesi, sulama başlangıcı' },
      { month: 4, tasks: 'Çiçek ve genç meyve kontrolü, zararlı önleme' },
      { month: 5, tasks: 'Meyve gelişimi, düzenli sulama, ilaçlama' },
      { month: 6, tasks: 'Sürekli meyve tutumu, sulama artırma' },
      { month: 7, tasks: 'Yaz hasadı, meyve gelişimi takibi' },
      { month: 8, tasks: 'Sürekli hasat, düzenli bakım' },
      { month: 9, tasks: 'Sonbahar hasadı, gübreleme' },
      { month: 10, tasks: 'Hasat devam, kış hazırlığı' },
      { month: 11, tasks: 'Kış hasadı başlangıcı, don koruması' },
      { month: 12, tasks: 'Kış hasadı, koruma önlemleri' }
    ]
  },

  // SERT KABUKLU MEYVELER
  {
    name: 'Ceviz',
    category: 'sert-kabuklu',
    notes: 'Uzun ömürlü, değerli kereste ve meyve ağacı',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, yapı kontrolü' },
      { month: 2, tasks: 'Budama (genç ağaçlar), gübreleme' },
      { month: 3, tasks: 'Tomurcuk patlaması, toprak işleme' },
      { month: 4, tasks: 'Yapraklanma, çiçeklenme başlangıcı, zararlı kontrolü' },
      { month: 5, tasks: 'Erkek ve dişi çiçek uyumu, tozlaşma, meyve tutumu' },
      { month: 6, tasks: 'Genç meyve gelişimi, sulama (gerekirse)' },
      { month: 7, tasks: 'Meyve büyümesi, kabuk gelişimi takibi' },
      { month: 8, tasks: 'Meyve olgunlaşma, yeşil kabuk çatlaması başlangıcı' },
      { month: 9, tasks: 'Hasat başlangıcı, düşen cevizleri toplama' },
      { month: 10, tasks: 'Ana hasat, kabuk soyma, kurutma' },
      { month: 11, tasks: 'Hasat tamamlama, depolama, yaprak dökümü' },
      { month: 12, tasks: 'Kış dinlenme, ağaç sağlığı kontrolü' }
    ]
  },
  {
    name: 'Fındık',
    category: 'sert-kabuklu',
    notes: 'Türkiye\'nin önemli ihracat ürünü',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, erkek çiçek (salkım) oluşumu' },
      { month: 2, tasks: 'Rüzgar tozlaşması, dişi çiçek başlangıcı' },
      { month: 3, tasks: 'Tomurcuk patlaması, sürgün başlangıcı, toprak işleme' },
      { month: 4, tasks: 'Yapraklanma, genç sürgün gelişimi, gübreleme' },
      { month: 5, tasks: 'Meyve tutumu, fidan gelişimi kontrolü' },
      { month: 6, tasks: 'Meyve gelişimi, zararlı kontrolü (fındık kurdu)' },
      { month: 7, tasks: 'Kabuk sertleşmesi, iç gelişimi, zararlı mücadelesi' },
      { month: 8, tasks: 'Hasat başlangıcı, erken çeşit toplama, kurutma' },
      { month: 9, tasks: 'Ana hasat sezonu, günlük toplama, kurutma' },
      { month: 10, tasks: 'Hasat tamamlama, kalite ayırma, depolama' },
      { month: 11, tasks: 'Hasat sonrası toprak bakımı, ot temizliği' },
      { month: 12, tasks: 'Kış hazırlığı, fidan temizliği (dip sürgünleri)' }
    ]
  },
  {
    name: 'Badem',
    category: 'sert-kabuklu',
    notes: 'Erken çiçeklenen, don hassas, kıymetli ağaç',
    maintenance: [
      { month: 1, tasks: 'Çok erken çiçeklenme (bölgeye göre), don koruması' },
      { month: 2, tasks: 'Çiçeklenme dönemi, tozlaşma, arı aktivitesi' },
      { month: 3, tasks: 'Meyve tutumu, yapraklanma, gübreleme' },
      { month: 4, tasks: 'Genç meyve gelişimi, zararlı kontrolü, sulama başlangıcı' },
      { month: 5, tasks: 'Meyve büyümesi, düzenli sulama, hastalık önleme' },
      { month: 6, tasks: 'Kabuk sertleşmesi, içi gelişimi' },
      { month: 7, tasks: 'Yeşil kabuk çatlaması başlangıcı, hasat hazırlığı' },
      { month: 8, tasks: 'Hasat başlangıcı, kabuk açma, kurutma' },
      { month: 9, tasks: 'Ana hasat, günlük toplama, kabuk soyma' },
      { month: 10, tasks: 'Hasat tamamlama, kurutma, kalite kontrolü' },
      { month: 11, tasks: 'Budama başlangıcı, toprak iyileştirme' },
      { month: 12, tasks: 'Kış budaması, kuru dal temizliği' }
    ]
  },
  {
    name: 'Antep Fıstığı',
    category: 'sert-kabuklu',
    notes: 'Yüksek ekonomik değer, kurak alanlara uygun',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, budama (gerekirse)' },
      { month: 2, tasks: 'Kış sonu bakım, toprak hazırlığı' },
      { month: 3, tasks: 'Tomurcuk patlaması, erkek çiçek gelişimi' },
      { month: 4, tasks: 'Çiçeklenme, rüzgar tozlaşması, dişi çiçek kontrolü' },
      { month: 5, tasks: 'Meyve tutumu, gübreleme, sulama başlangıcı' },
      { month: 6, tasks: 'Meyve gelişimi, düzenli sulama, zararlı takibi' },
      { month: 7, tasks: 'İç gelişimi, sulama devam' },
      { month: 8, tasks: 'Kabuk açılması başlangıcı, hasat hazırlığı' },
      { month: 9, tasks: 'Hasat sezonu, günlük toplama, kurutma' },
      { month: 10, tasks: 'Hasat tamamlama, işleme, kalite ayırma' },
      { month: 11, tasks: 'Hasat sonrası toprak bakımı' },
      { month: 12, tasks: 'Kış dinlenme, ağaç sağlığı kontrolü' }
    ]
  },

  // SÜS AĞAÇLARI
  {
    name: 'Akçaağaç',
    category: 'sus-agaci',
    notes: 'Sonbahar renkleri muhteşem, dekoratif ağaç',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, kar kontrolü' },
      { month: 2, tasks: 'Kış sonu budama, kuru dal temizliği' },
      { month: 3, tasks: 'Tomurcuk patlaması, toprak havalandırma' },
      { month: 4, tasks: 'Yapraklanma, ilkbahar gübreleme' },
      { month: 5, tasks: 'Tam yaprak örtüsü, genç sürgün kontrolü' },
      { month: 6, tasks: 'Yaz bakımı, kuraklık takibi, sulama (gerekirse)' },
      { month: 7, tasks: 'Zararlı kontrolü, yaprak sağlığı takibi' },
      { month: 8, tasks: 'Yaz sonrası bakım, su stresi önleme' },
      { month: 9, tasks: 'Sonbahar renklenmesi başlangıcı, gübre uygulaması' },
      { month: 10, tasks: 'Sonbahar gösterisi, yaprak dökümü başlangıcı' },
      { month: 11, tasks: 'Yaprak toplama, toprak örtüsü' },
      { month: 12, tasks: 'Kış hazırlığı, yapı sağlamlığı kontrolü' }
    ]
  },
  {
    name: 'Meşe',
    category: 'sus-agaci',
    notes: 'Uzun ömürlü, güçlü yapılı asil ağaç',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, fırtına hasarı kontrolü' },
      { month: 2, tasks: 'Kış sonu kontrolü, ölü dal temizliği' },
      { month: 3, tasks: 'Tomurcuk patlaması gecikmeli, toprak işleme' },
      { month: 4, tasks: 'Yapraklanma başlangıcı, erkek çiçek (salkım)' },
      { month: 5, tasks: 'Tam yapraklanma, meşe palamudu oluşumu' },
      { month: 6, tasks: 'Yoğun yaprak örtüsü, zararlı kontrolü' },
      { month: 7, tasks: 'Palamut gelişimi, su stresi önleme' },
      { month: 8, tasks: 'Palamut olgunlaşması, yaz bakımı' },
      { month: 9, tasks: 'Palamut düşüşü, sonbahar hazırlığı' },
      { month: 10, tasks: 'Yaprak renklenmesi, palamut toplama' },
      { month: 11, tasks: 'Yaprak dökümü, toprak örtüsü oluşturma' },
      { month: 12, tasks: 'Kış dinlenme, yapısal dayanıklılık kontrolü' }
    ]
  },
  {
    name: 'Ihlamur',
    category: 'sus-agaci',
    notes: 'Kokulu çiçekli, gölge yapan, tıbbi değerli ağaç',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, kar yükü kontrolü' },
      { month: 2, tasks: 'Budama (gerekirse), şekillendirme' },
      { month: 3, tasks: 'Tomurcuk patlaması, toprak hazırlığı' },
      { month: 4, tasks: 'Yapraklanma, gübreleme, yeni sürgün kontrolü' },
      { month: 5, tasks: 'Yoğun yeşil örtü, sulama (kuru dönemlerde)' },
      { month: 6, tasks: 'Çiçeklenme başlangıcı, koku yayılımı, arı aktivitesi' },
      { month: 7, tasks: 'Çiçek toplama (tıbbi kullanım), kurutma' },
      { month: 8, tasks: 'Çiçek sonrası bakım, zararlı kontrolü' },
      { month: 9, tasks: 'Tohum gelişimi, sonbahar hazırlığı' },
      { month: 10, tasks: 'Yaprak renklenmesi, dökülme başlangıcı' },
      { month: 11, tasks: 'Yaprak dökümü, toprak örtüsü' },
      { month: 12, tasks: 'Kış dinlenme, yapı kontrolü' }
    ]
  },
  {
    name: 'Japon Gülü (Sakura)',
    category: 'sus-agaci',
    notes: 'Muhteşem çiçek açan, dekoratif süs ağacı',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, çiçek tomurcuğu oluşumu' },
      { month: 2, tasks: 'Hafif budama, kuru dal temizliği' },
      { month: 3, tasks: 'Erken çiçeklenme başlangıcı (bölgeye göre), gübreleme' },
      { month: 4, tasks: 'Tam çiçeklenme, görsel şölen, fotoğraf sezonu' },
      { month: 5, tasks: 'Çiçek dökümü, yapraklanma, sulama başlangıcı' },
      { month: 6, tasks: 'Yoğun yeşil örtü, zararlı takibi' },
      { month: 7, tasks: 'Yaz bakımı, düzenli sulama, hastalık önleme' },
      { month: 8, tasks: 'Yaz sonrası bakım, su kontrolü' },
      { month: 9, tasks: 'Sonbahar hazırlığı, gübreleme' },
      { month: 10, tasks: 'Yaprak renklenmesi, sonbahar güzelliği' },
      { month: 11, tasks: 'Yaprak dökümü, toprak örtüsü' },
      { month: 12, tasks: 'Kış dinlenme, çiçek tomurcuğu gelişimi' }
    ]
  },

  // İĞNE YAPRAKLI
  {
    name: 'Çam',
    category: 'igne-yaprakli',
    notes: 'Dayanıklı, her mevsim yeşil kalan iğne yapraklı',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, kar hasarı kontrolü' },
      { month: 2, tasks: 'Kış sonu kontrol, ölü dal temizliği' },
      { month: 3, tasks: 'Yeni sürgün başlangıcı (mum dönemi)' },
      { month: 4, tasks: 'Polen yayılımı, genç kozalak oluşumu' },
      { month: 5, tasks: 'Yoğun büyüme, yeni iğne yaprak gelişimi' },
      { month: 6, tasks: 'Sürgün uzaması, zararlı kontrolü (çam kese böceği)' },
      { month: 7, tasks: 'Yaz bakımı, kuraklık dayanımı yüksek' },
      { month: 8, tasks: 'Kozalak gelişimi, reçine üretimi' },
      { month: 9, tasks: 'Kozalak olgunlaşması, tohum gelişimi' },
      { month: 10, tasks: 'Kozalak açılması, tohum dağılımı' },
      { month: 11, tasks: 'Sonbahar bakımı, kese böceği kontrolü' },
      { month: 12, tasks: 'Kış dinlenme, yapısal sağlamlık kontrolü' }
    ]
  },
  {
    name: 'Sedir',
    category: 'igne-yaprakli',
    notes: 'Görkemli, uzun ömürlü, değerli iğne yapraklı',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, kar kontrolü' },
      { month: 2, tasks: 'Kış sonu bakım, yapı kontrolü' },
      { month: 3, tasks: 'Yeni sürgün başlangıcı, toprak havalandırma' },
      { month: 4, tasks: 'Yeni iğne yaprak gelişimi, gübreleme (genç ağaçlar)' },
      { month: 5, tasks: 'Kozalak oluşumu (olgun ağaçlar), büyüme dönemi' },
      { month: 6, tasks: 'Yoğun gelişim, zararlı takibi' },
      { month: 7, tasks: 'Yaz bakımı, minimal su ihtiyacı' },
      { month: 8, tasks: 'Kozalak gelişimi, reçine akışı' },
      { month: 9, tasks: 'Kozalak olgunlaşması başlangıcı' },
      { month: 10, tasks: 'Kozalak dağılımı, tohum yayılımı' },
      { month: 11, tasks: 'Sonbahar bakımı, toprak kontrolü' },
      { month: 12, tasks: 'Kış dinlenme, doğal dayanıklılık' }
    ]
  },
  {
    name: 'Ladin',
    category: 'igne-yaprakli',
    notes: 'Piramit şekilli, Noel ağacı olarak popüler',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, kar yükü kontrolü' },
      { month: 2, tasks: 'Kış sonu kontrol, don koruması' },
      { month: 3, tasks: 'Tomurcuk patlaması başlangıcı' },
      { month: 4, tasks: 'Yeni sürgün gelişimi, açık yeşil renk' },
      { month: 5, tasks: 'Hızlı büyüme, yeni dal oluşumu' },
      { month: 6, tasks: 'Polen yayılımı, genç kozalak oluşumu' },
      { month: 7, tasks: 'Yaz büyümesi, sulama (genç ağaçlar)' },
      { month: 8, tasks: 'Kozalak gelişimi, reçine üretimi' },
      { month: 9, tasks: 'Kozalak olgunlaşması, kahverengiye dönüş' },
      { month: 10, tasks: 'Kozalak açılması, tohum dağılımı' },
      { month: 11, tasks: 'Sonbahar bakımı, zararlı kontrolü' },
      { month: 12, tasks: 'Noel sezonu (kesilecekse), kış dinlenme' }
    ]
  },
  {
    name: 'Servi',
    category: 'igne-yaprakli',
    notes: 'Siluet güzelliği, mezarlık ve park ağacı',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, fırtına kontrolü' },
      { month: 2, tasks: 'Kış sonu budama (şekillendirme için)' },
      { month: 3, tasks: 'Yeni büyüme başlangıcı, toprak hazırlığı' },
      { month: 4, tasks: 'Sürgün gelişimi, gübreleme (genç ağaçlar)' },
      { month: 5, tasks: 'Yoğun yeşil büyüme, şekil kontrolü' },
      { month: 6, tasks: 'Yaz bakımı, sulama (kuru dönemlerde)' },
      { month: 7, tasks: 'Zararlı kontrolü, hastalık önleme' },
      { month: 8, tasks: 'Minimal bakım, kuraklık dayanımı' },
      { month: 9, tasks: 'Şekillendirme budama (gerekirse)' },
      { month: 10, tasks: 'Sonbahar bakımı, yapı kontrolü' },
      { month: 11, tasks: 'Kış öncesi hazırlık, rüzgar koruması' },
      { month: 12, tasks: 'Kış dinlenme, kar ve rüzgar takibi' }
    ]
  },

  // DİĞER YAYGIM AĞAÇLAR
  {
    name: 'Zeytin',
    category: 'meyve',
    notes: 'Akdeniz bölgesinin simgesi, uzun ömürlü ağaç',
    maintenance: [
      { month: 1, tasks: 'Kış budaması, havalandırma budaması, gübreleme' },
      { month: 2, tasks: 'Budama tamamlama, toprak işleme, zararlı önleme' },
      { month: 3, tasks: 'Tomurcuk patlaması, bahar sürgünleri, ilaçlama' },
      { month: 4, tasks: 'Çiçek tomurcuğu oluşumu, sulama başlangıcı' },
      { month: 5, tasks: 'Çiçeklenme dönemi, tozlaşma, zeytin sineği önleme' },
      { month: 6, tasks: 'Meyve tutumu, genç zeytin gelişimi, sulama' },
      { month: 7, tasks: 'Meyve büyümesi, düzenli sulama, zararlı kontrolü' },
      { month: 8, tasks: 'Renk değişimi başlangıcı, sulama devam' },
      { month: 9, tasks: 'Yeşil zeytin hasat (salamura için), siyah zeytin gelişimi' },
      { month: 10, tasks: 'Sofralık zeytin hasat, erken hasat (soğuk sıkım)' },
      { month: 11, tasks: 'Ana hasat sezonu, yağlık zeytin toplama' },
      { month: 12, tasks: 'Hasat tamamlama, yağ üretimi, budama başlangıcı' }
    ]
  },
  {
    name: 'Nar',
    category: 'meyve',
    notes: 'Antioksidan deposu, süs ve meyve ağacı',
    maintenance: [
      { month: 1, tasks: 'Kış budaması, kuru dal temizliği' },
      { month: 2, tasks: 'Budama tamamlama, organik gübre uygulaması' },
      { month: 3, tasks: 'Tomurcuk patlaması, yeni sürgün başlangıcı' },
      { month: 4, tasks: 'Yapraklanma, ilk çiçek tomurcukları' },
      { month: 5, tasks: 'Çiçeklenme başlangıcı, kırmızı çiçekler, tozlaşma' },
      { month: 6, tasks: 'Yoğun çiçeklenme, meyve tutumu, seyreltme' },
      { month: 7, tasks: 'Genç meyve gelişimi, sulama başlangıcı' },
      { month: 8, tasks: 'Meyve büyümesi, düzenli sulama, zararlı kontrolü' },
      { month: 9, tasks: 'Meyve renklenmesi, şekerleme başlangıcı' },
      { month: 10, tasks: 'Hasat başlangıcı, olgunluk kontrolü, tat testi' },
      { month: 11, tasks: 'Ana hasat sezonu, günlük toplama' },
      { month: 12, tasks: 'Hasat sonu, temizlik, kış hazırlığı' }
    ]
  },
  {
    name: 'Üzüm Asması',
    category: 'meyve',
    notes: 'Tırmanıcı yapı, sofralık ve şaraplık üzüm',
    maintenance: [
      { month: 1, tasks: 'Kış budaması, asma budama teknikleri, şekillendirme' },
      { month: 2, tasks: 'Budama tamamlama, bağlama telleri kontrolü, gübreleme' },
      { month: 3, tasks: 'Göz patlaması, yeni sürgün başlangıcı, toprak işleme' },
      { month: 4, tasks: 'Sürgün gelişimi, yeşil budama, tellere bağlama' },
      { month: 5, tasks: 'Çiçeklenme dönemi, tozlaşma, asma küllemesi önleme' },
      { month: 6, tasks: 'Salkım oluşumu, meyve tutumu, yeşil budama devam' },
      { month: 7, tasks: 'Tane büyümesi, sulama, yaprak seyreltme, zararlı kontrolü' },
      { month: 8, tasks: 'Renk değişimi (ben düşme), şekerleme başlangıcı' },
      { month: 9, tasks: 'Hasat başlangıcı, şeker ölçümü, olgunluk kontrolü' },
      { month: 10, tasks: 'Hasat devam, günlük toplama, üzüm işleme' },
      { month: 11, tasks: 'Hasat sonu, yaprak dökümü, toprak iyileştirme' },
      { month: 12, tasks: 'Kış dinlenme, budama hazırlığı' }
    ]
  }
];

// SEBZE VERİLERİ
const vegetableData = [
  // YAPRAKLI SEBZELER
  {
    name: 'Marul',
    category: 'yaprakli',
    notes: 'Hızlı büyüyen, serin mevsim sebzesi',
    maintenance: [
      { month: 1, tasks: 'Sera veya ev içi ekim, ışık kontrolü, sıcaklık takibi' },
      { month: 2, tasks: 'Sera yetiştiriciliği, fide gelişimi, sulama' },
      { month: 3, tasks: 'Açık alan ekim başlangıcı, toprak hazırlığı, organik gübre' },
      { month: 4, tasks: 'Fide dikimi, düzenli sulama, ot kontrolü' },
      { month: 5, tasks: 'Büyüme dönemi, hasat başlangıcı (erken çeşitler), yeni ekim' },
      { month: 6, tasks: 'Hasat devam, sıcağa dayanıklı çeşit ekimi, sulama artırma' },
      { month: 7, tasks: 'Yaz ekimi, sıcaklık stresi önleme, gölgeleme' },
      { month: 8, tasks: 'Sonbahar ekimi başlangıcı, hasat devam' },
      { month: 9, tasks: 'Sonbahar yetiştiriciliği, hasat, yeni ekim' },
      { month: 10, tasks: 'Hasat devam, kış öncesi son ekim' },
      { month: 11, tasks: 'Sera yetiştiriciliğine geçiş, açık alan hasat sonu' },
      { month: 12, tasks: 'Sera üretimi, ışık desteği, sıcaklık kontrolü' }
    ]
  },
  {
    name: 'Ispanak',
    category: 'yaprakli',
    notes: 'Soğuğa dayanıklı, besleyici yapraklı sebze',
    maintenance: [
      { month: 1, tasks: 'Sera yetiştiriciliği, don koruması (açık alan)' },
      { month: 2, tasks: 'Sera üretimi devam, ilkbahar ekimi hazırlığı' },
      { month: 3, tasks: 'Açık alan ilkbahar ekimi, toprak hazırlığı, organik gübre' },
      { month: 4, tasks: 'Fide gelişimi, sulama, ot kontrolü, seyreltme' },
      { month: 5, tasks: 'Hasat başlangıcı, sürekli ekim (taze tüketim için)' },
      { month: 6, tasks: 'Son ilkbahar hasadı, sıcakta tohuma kaçma riski' },
      { month: 7, tasks: 'Yaz molası (sıcak bölgelerde), sonbahar hazırlığı' },
      { month: 8, tasks: 'Sonbahar ekimi başlangıcı, toprak hazırlığı' },
      { month: 9, tasks: 'Ana sonbahar ekimi, fide gelişimi, sulama' },
      { month: 10, tasks: 'Büyüme dönemi, hasat başlangıcı, yeni ekim' },
      { month: 11, tasks: 'Hasat devam, kış ekimi (ılıman bölgelerde)' },
      { month: 12, tasks: 'Kış hasadı, don koruması, sera üretimi' }
    ]
  },
  {
    name: 'Roka',
    category: 'yaprakli',
    notes: 'Hızlı büyüyen, acımsı lezzetli yapraklı sebze',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, soğuğa dayanıklı' },
      { month: 2, tasks: 'Sera yetiştiriciliği, ilkbahar hazırlığı' },
      { month: 3, tasks: 'Açık alan ilk ekim, toprak hazırlığı' },
      { month: 4, tasks: 'Hızlı büyüme, 3-4 hafta sonra hasat, sürekli ekim' },
      { month: 5, tasks: 'Hasat ve yeni ekim döngüsü, düzenli sulama' },
      { month: 6, tasks: 'Sıcakta tohuma kaçma riski, sık hasat' },
      { month: 7, tasks: 'Yaz molası veya gölgeli alan ekimi' },
      { month: 8, tasks: 'Sonbahar ekimi başlangıcı' },
      { month: 9, tasks: 'Yoğun sonbahar ekimi, ideal büyüme mevsimi' },
      { month: 10, tasks: 'Hasat ve ekim döngüsü devam' },
      { month: 11, tasks: 'Kış ekimi, örtü altı yetiştiriciliği' },
      { month: 12, tasks: 'Sera üretimi, kış hasadı' }
    ]
  },
  {
    name: 'Lahana',
    category: 'yaprakli',
    notes: 'Soğuğa dayanıklı, uzun ömürlü sebze',
    maintenance: [
      { month: 1, tasks: 'Kış çeşidi hasat devam, depolama kontrolü' },
      { month: 2, tasks: 'İlkbahar çeşidi fide hazırlığı, sera ekimi' },
      { month: 3, tasks: 'Fide dikimi, toprak hazırlığı, gübreleme' },
      { month: 4, tasks: 'Fide büyümesi, sulama, zararlı kontrolü (lahana kelebeği)' },
      { month: 5, tasks: 'Baş oluşumu başlangıcı, düzenli sulama, gübreleme' },
      { month: 6, tasks: 'Baş gelişimi, zararlı mücadelesi, ot kontrolü' },
      { month: 7, tasks: 'Yaz çeşidi hasat başlangıcı, sonbahar fide hazırlığı' },
      { month: 8, tasks: 'Sonbahar-kış çeşidi fide dikimi, toprak hazırlığı' },
      { month: 9, tasks: 'Fide büyümesi, sulama, zararlı kontrolü' },
      { month: 10, tasks: 'Baş oluşumu, gübreleme, sulama' },
      { month: 11, tasks: 'Kış çeşidi gelişimi devam, don dayanımı' },
      { month: 12, tasks: 'Kış hasadı başlangıcı, taze tüketim veya depolama' }
    ]
  },
  {
    name: 'Pazı',
    category: 'yaprakli',
    notes: 'Kolay yetişen, sürekli hasat edilebilen sebze',
    maintenance: [
      { month: 1, tasks: 'Sera yetiştiriciliği, don koruması' },
      { month: 2, tasks: 'İlkbahar ekimi hazırlığı, fide yetiştirme' },
      { month: 3, tasks: 'Açık alan ekimi, toprak hazırlığı, organik gübre' },
      { month: 4, tasks: 'Fide gelişimi, seyreltme, sulama' },
      { month: 5, tasks: 'Hasat başlangıcı, dış yaprakları koparma' },
      { month: 6, tasks: 'Sürekli hasat, yeni ekim, düzenli sulama' },
      { month: 7, tasks: 'Yaz yetiştiriciliği, sulama artırma, gölgeleme' },
      { month: 8, tasks: 'Hasat devam, sonbahar ekimi' },
      { month: 9, tasks: 'Sonbahar yetiştiriciliği, ideal büyüme dönemi' },
      { month: 10, tasks: 'Hasat devam, kış ekimi hazırlığı' },
      { month: 11, tasks: 'Kış ekimi, örtü altı yetiştirme' },
      { month: 12, tasks: 'Sera hasadı, soğuğa dayanıklı' }
    ]
  },

  // KÖK SEBZELER
  {
    name: 'Havuç',
    category: 'kok',
    notes: 'Derin toprak seven, uzun ömürlü kök sebze',
    maintenance: [
      { month: 1, tasks: 'Sera veya örtü altı ekim' },
      { month: 2, tasks: 'İlkbahar ekimi hazırlığı, toprak derin işleme' },
      { month: 3, tasks: 'İlk açık alan ekimi, tohum yayımı, hafif örtü' },
      { month: 4, tasks: 'Fide çıkışı, seyreltme (4-5 cm aralık), ot kontrolü' },
      { month: 5, tasks: 'Kök gelişimi başlangıcı, sulama, gübreleme' },
      { month: 6, tasks: 'Kök büyümesi, düzenli sulama, toprak nemli tutma' },
      { month: 7, tasks: 'İlkbahar ekimi hasat, yaz ekimi başlangıcı' },
      { month: 8, tasks: 'Sonbahar ekimi, toprak hazırlığı' },
      { month: 9, tasks: 'Fide gelişimi, seyreltme, sulama' },
      { month: 10, tasks: 'Kök büyümesi, hasat başlangıcı (genç havuç)' },
      { month: 11, tasks: 'Ana hasat sezonu, depolama hazırlığı' },
      { month: 12, tasks: 'Hasat tamamlama, kum içinde depolama' }
    ]
  },
  {
    name: 'Turp',
    category: 'kok',
    notes: 'Hızlı yetişen, taze tüketilen kök sebze',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, soğuğa dayanıklı' },
      { month: 2, tasks: 'Sera yetiştiriciliği, ilkbahar hazırlığı' },
      { month: 3, tasks: 'İlk açık alan ekimi, toprak gevşetme' },
      { month: 4, tasks: 'Hızlı büyüme, 20-30 gün sonra hasat, sürekli ekim' },
      { month: 5, tasks: 'Hasat ve ekim döngüsü, taze tüketim' },
      { month: 6, tasks: 'Yaz turpları, sıcağa dayanıklı çeşitler' },
      { month: 7, tasks: 'Hafif yaz molası, sulama önemli' },
      { month: 8, tasks: 'Sonbahar ekimi başlangıcı, kış turpları' },
      { month: 9, tasks: 'Yoğun ekim, ideal büyüme dönemi' },
      { month: 10, tasks: 'Hasat ve ekim devam' },
      { month: 11, tasks: 'Kış turpu ekimi, uzun ömürlü çeşitler' },
      { month: 12, tasks: 'Sera üretimi, örtü altı yetiştirme' }
    ]
  },
  {
    name: 'Pancar',
    category: 'kok',
    notes: 'Soğuğa dayanıklı, hem yaprak hem kök kullanılır',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, kış üretimi' },
      { month: 2, tasks: 'İlkbahar ekimi hazırlığı, toprak hazırlığı' },
      { month: 3, tasks: 'İlk açık alan ekimi, tohum yayımı' },
      { month: 4, tasks: 'Fide çıkışı, seyreltme (10 cm aralık), sulama' },
      { month: 5, tasks: 'Kök şişkinliği başlangıcı, gübreleme, sulama' },
      { month: 6, tasks: 'Kök gelişimi, düzenli sulama' },
      { month: 7, tasks: 'İlkbahar ekimi hasat, yaz ekimi' },
      { month: 8, tasks: 'Sonbahar ekimi, toprak hazırlığı' },
      { month: 9, tasks: 'Fide gelişimi, seyreltme' },
      { month: 10, tasks: 'Kök büyümesi, hasat başlangıcı' },
      { month: 11, tasks: 'Ana hasat, depolama (soğuk ortam)' },
      { month: 12, tasks: 'Kış hasadı, sera üretimi' }
    ]
  },
  {
    name: 'Kereviz (Kök)',
    category: 'kok',
    notes: 'Uzun yetişme süreli, aromalı kök sebze',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme başlangıcı' },
      { month: 2, tasks: 'Fide gelişimi, sıcaklık kontrolü (15-20°C)' },
      { month: 3, tasks: 'Fide büyütme devam, sertleştirme' },
      { month: 4, tasks: 'Açık alana fide dikimi, zengin toprak, gübreleme' },
      { month: 5, tasks: 'Yaprak gelişimi, düzenli sulama (nem önemli)' },
      { month: 6, tasks: 'Kök oluşumu başlangıcı, toprak nemli tutma' },
      { month: 7, tasks: 'Kök büyümesi, sulama devam, ot kontrolü' },
      { month: 8, tasks: 'Kök gelişimi devam, gübreleme' },
      { month: 9, tasks: 'Kök şişkinliği, hasat yaklaşıyor' },
      { month: 10, tasks: 'Hasat başlangıcı, kök büyüklüğü kontrolü' },
      { month: 11, tasks: 'Ana hasat sezonu, dikkatli söküm' },
      { month: 12, tasks: 'Hasat tamamlama, kış depolaması' }
    ]
  },

  // MEYVELİ SEBZELER
  {
    name: 'Domates',
    category: 'meyveli',
    notes: 'En popüler sebze, sıcak iklim sever',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme başlangıcı, ışık desteği' },
      { month: 2, tasks: 'Fide gelişimi, pikaj (aktarma), sertleştirme' },
      { month: 3, tasks: 'Sera dikimi (erken üretim), açık alan hazırlığı' },
      { month: 4, tasks: 'Açık alan fide dikimi, destek kazıkları, mulch' },
      { month: 5, tasks: 'Çiçeklenme, yan dal alma, düzenli sulama, bağlama' },
      { month: 6, tasks: 'Meyve tutumu, yeşil domates gelişimi, gübreleme' },
      { month: 7, tasks: 'Meyve olgunlaşması, hasat başlangıcı, zararlı kontrolü' },
      { month: 8, tasks: 'Yoğun hasat, günlük toplama, hastalık önleme' },
      { month: 9, tasks: 'Hasat devam, sonbahar üretimi' },
      { month: 10, tasks: 'Son hasat, bitkiler temizliği' },
      { month: 11, tasks: 'Sera sonbahar-kış ekimi (ılıman bölgelerde)' },
      { month: 12, tasks: 'Sera üretimi devam, sıcaklık kontrolü' }
    ]
  },
  {
    name: 'Biber',
    category: 'meyveli',
    notes: 'Sıcak sever, renkli ve lezzetli sebze',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme, yüksek sıcaklık gerekir (25-28°C)' },
      { month: 2, tasks: 'Fide gelişimi, pikaj, sertleştirme' },
      { month: 3, tasks: 'Sera dikimi, açık alan için fide büyütme devam' },
      { month: 4, tasks: 'Açık alan fide dikimi (don riski geçince), mulch' },
      { month: 5, tasks: 'Bitki gelişimi, ilk çiçekler, destek, sulama' },
      { month: 6, tasks: 'Çiçeklenme yoğun, meyve tutumu, gübreleme' },
      { month: 7, tasks: 'Yeşil biber hasat başlangıcı, büyüme devam' },
      { month: 8, tasks: 'Yoğun hasat, renk değişimi (kırmızı, sarı), günlük toplama' },
      { month: 9, tasks: 'Hasat devam, olgun renkli biberler' },
      { month: 10, tasks: 'Son hasat, kurutmalık biber' },
      { month: 11, tasks: 'Bitkiler temizliği, toprak iyileştirme' },
      { month: 12, tasks: 'Sera kış üretimi (sıcak bölgelerde)' }
    ]
  },
  {
    name: 'Patlıcan',
    category: 'meyveli',
    notes: 'Çok sıcak seven, hassas sebze',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme, yüksek sıcaklık (25-30°C)' },
      { month: 2, tasks: 'Fide gelişimi, pikaj, ışık kontrolü' },
      { month: 3, tasks: 'Sera dikimi, açık alan fide büyütme' },
      { month: 4, tasks: 'Sertleştirme, açık alan dikimi (don riski tamamen geçince)' },
      { month: 5, tasks: 'Bitki gelişimi, çiçeklenme başlangıcı, destek kazıkları' },
      { month: 6, tasks: 'Çiçeklenme, meyve tutumu, düzenli sulama, gübreleme' },
      { month: 7, tasks: 'Meyve büyümesi, hasat başlangıcı, zararlı kontrolü (pire)' },
      { month: 8, tasks: 'Yoğun hasat, günlük toplama, parlak cilt kontrolü' },
      { month: 9, tasks: 'Hasat devam, kalite takibi' },
      { month: 10, tasks: 'Son hasat, sıcaklık düşünce üretim sonu' },
      { month: 11, tasks: 'Bitkiler temizliği, toprak hazırlığı' },
      { month: 12, tasks: 'Sera üretimi (özel koşullarda)' }
    ]
  },
  {
    name: 'Kabak',
    category: 'kabakgil',
    notes: 'Hızlı büyüyen, verimli sebze',
    maintenance: [
      { month: 1, tasks: 'Sera erken fide yetiştirme' },
      { month: 2, tasks: 'Sera fide gelişimi, sertleştirme' },
      { month: 3, tasks: 'İlk açık alan ekimi (ılıman bölgelerde)' },
      { month: 4, tasks: 'Ana ekim dönemi, doğrudan tohum veya fide' },
      { month: 5, tasks: 'Hızlı büyüme, çiçeklenme, dişi çiçek kontrolü, sulama' },
      { month: 6, tasks: 'Hasat başlangıcı (genç kabak), günlük toplama, sürekli ekim' },
      { month: 7, tasks: 'Yoğun hasat, her gün kontrol, gübreleme' },
      { month: 8, tasks: 'Hasat devam, kış kabağı ekimi' },
      { month: 9, tasks: 'Yaz kabağı son hasat, kış kabağı büyümesi' },
      { month: 10, tasks: 'Kış kabağı hasat, kabuk sertleşmesi bekleme' },
      { month: 11, tasks: 'Kış kabağı depolama, uzun ömürlü' },
      { month: 12, tasks: 'Depolama kontrolü, sera üretimi' }
    ]
  },
  {
    name: 'Salatalık',
    category: 'kabakgil',
    notes: 'Su seven, taze tüketilen sebze',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme (sıcak seralarda)' },
      { month: 2, tasks: 'Sera üretimi, fide gelişimi' },
      { month: 3, tasks: 'Açık alan fide hazırlığı, sertleştirme' },
      { month: 4, tasks: 'Açık alan dikimi (don riski geçince), destek teli' },
      { month: 5, tasks: 'Hızlı büyüme, çiçeklenme, meyve tutumu, yoğun sulama' },
      { month: 6, tasks: 'Hasat başlangıcı, günlük toplama (8-15 cm), sürekli toplama' },
      { month: 7, tasks: 'Yoğun hasat, her gün kontrol, gübreleme, sulama' },
      { month: 8, tasks: 'Hasat devam, yeni ekim (sonbahar için)' },
      { month: 9, tasks: 'Sonbahar hasadı, sıcaklık düşünce yavaşlama' },
      { month: 10, tasks: 'Son hasat, sera ekimi' },
      { month: 11, tasks: 'Sera üretimi, sıcaklık kontrolü' },
      { month: 12, tasks: 'Sera hasadı devam (sıcak seralarda)' }
    ]
  },

  // BAKLAGİLLER
  {
    name: 'Fasulye',
    category: 'baklagil',
    notes: 'Toprağa azot bağlayan, protein kaynağı',
    maintenance: [
      { month: 1, tasks: 'Sera erken ekim (sıcak seralarda)' },
      { month: 2, tasks: 'Sera yetiştiriciliği, ilkbahar hazırlığı' },
      { month: 3, tasks: 'İlk açık alan ekimi (ılıman bölgelerde), toprak 10°C üstü' },
      { month: 4, tasks: 'Ana ekim dönemi, bodur veya sırık çeşit seçimi' },
      { month: 5, tasks: 'Fide çıkışı, çapalama, sırık fasulyeye destek, sulama' },
      { month: 6, tasks: 'Çiçeklenme, bakla tutumu, düzenli sulama' },
      { month: 7, tasks: 'Hasat başlangıcı (taze fasulye), sürekli toplama' },
      { month: 8, tasks: 'Yoğun hasat, kuru fasulye için olgunlaştırma' },
      { month: 9, tasks: 'Kuru fasulye hasat, kabuk kurutma' },
      { month: 10, tasks: 'Hasat tamamlama, tohum saklama' },
      { month: 11, tasks: 'Bitki atıklarını toprağa karıştırma (azot kaynağı)' },
      { month: 12, tasks: 'Toprak dinlenme, sonraki yıl planlaması' }
    ]
  },
  {
    name: 'Bezelye',
    category: 'baklagil',
    notes: 'Soğuk mevsim baklagili, tatlı lezzetli',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, soğuğa dayanıklı' },
      { month: 2, tasks: 'İlkbahar ekimi başlangıcı (ılıman bölgelerde)' },
      { month: 3, tasks: 'Ana ilkbahar ekimi, toprak sıcaklığı 5°C üstü yeterli' },
      { month: 4, tasks: 'Fide çıkışı, destek teli veya çubuklar, sulama' },
      { month: 5, tasks: 'Tırmanma, çiçeklenme, bakla tutumu' },
      { month: 6, tasks: 'Hasat başlangıcı, taze bezelye toplama, günlük kontrol' },
      { month: 7, tasks: 'Hasat devam, sıcakta kalite düşer' },
      { month: 8, tasks: 'Yaz sonu hasat, kuru bezelye için bekleme' },
      { month: 9, tasks: 'Sonbahar ekimi (kış bezelyesi), soğuk bölgelerde' },
      { month: 10, tasks: 'Sonbahar fide gelişimi' },
      { month: 11, tasks: 'Kış bezelyesi yavaş büyüme' },
      { month: 12, tasks: 'Kış dinlenme, ilkbaharda hızlı büyüme' }
    ]
  },
  {
    name: 'Nohut',
    category: 'baklagil',
    notes: 'Kuraklığa dayanıklı, protein deposu',
    maintenance: [
      { month: 1, tasks: 'Dinlenme dönemi' },
      { month: 2, tasks: 'Ekim hazırlığı, toprak işleme' },
      { month: 3, tasks: 'Ana ekim dönemi, tohum inokulasyonu (azot bakterisi)' },
      { month: 4, tasks: 'Fide çıkışı, ilk çapalama, yabancı ot kontrolü' },
      { month: 5, tasks: 'Bitki gelişimi, çiçeklenme başlangıcı' },
      { month: 6, tasks: 'Çiçeklenme, bakla tutumu, minimal sulama' },
      { month: 7, tasks: 'Bakla dolum dönemi, kuraklığa dayanıklı' },
      { month: 8, tasks: 'Olgunlaşma, sararmaya başlama, sulama kesme' },
      { month: 9, tasks: 'Hasat, bitkiler tamamen kururken, harman' },
      { month: 10, tasks: 'Kurutma, ayıklama, depolama' },
      { month: 11, tasks: 'Uzun süreli depolama, kuru ve serin ortam' },
      { month: 12, tasks: 'Depolama devam, toprak dinlenme' }
    ]
  },
  {
    name: 'Mercimek',
    category: 'baklagil',
    notes: 'Soğuğa dayanıklı, kışlık baklagil',
    maintenance: [
      { month: 1, tasks: 'Kış mercimeği tarlada, yavaş büyüme' },
      { month: 2, tasks: 'Kış dinlenme devam' },
      { month: 3, tasks: 'İlkbahar mercimek ekimi (bazı bölgelerde)' },
      { month: 4, tasks: 'Hızlı büyüme başlangıcı, çapalama' },
      { month: 5, tasks: 'Çiçeklenme, mor-beyaz çiçekler, bakla tutumu' },
      { month: 6, tasks: 'Bakla dolum dönemi, minimal sulama' },
      { month: 7, tasks: 'Olgunlaşma, sararmaya başlama' },
      { month: 8, tasks: 'Hasat zamanı, bitkiler kurumuş, harman' },
      { month: 9, tasks: 'Kurutma, temizleme, ayıklama' },
      { month: 10, tasks: 'Kış mercimeği ekim zamanı (ana sezon)' },
      { month: 11, tasks: 'Fide çıkışı, yavaş büyüme' },
      { month: 12, tasks: 'Kış dinlenme, soğuğa dayanıklı' }
    ]
  },

  // SOĞANSI BİTKİLER
  {
    name: 'Soğan',
    category: 'sogansi',
    notes: 'Uzun ömürlü, temel mutfak malzemesi',
    maintenance: [
      { month: 1, tasks: 'Kışlık soğan tarlada, yavaş büyüme' },
      { month: 2, tasks: 'İlkbahar soğan fide yetiştirme, sera ekimi' },
      { month: 3, tasks: 'Soğan seti veya fide dikimi, toprak hazırlığı' },
      { month: 4, tasks: 'Yaprak gelişimi, çapalama, ot kontrolü, sulama' },
      { month: 5, tasks: 'Soğan başı oluşumu başlangıcı, düzenli sulama' },
      { month: 6, tasks: 'Soğan büyümesi, gübreleme, sulama azaltma (hasat yaklaşırken)' },
      { month: 7, tasks: 'Yapraklar yatmaya başlar, sulama kesme, hasat yaklaşıyor' },
      { month: 8, tasks: 'Hasat zamanı, güneşte kurutma, kök ve yaprak kesme' },
      { month: 9, tasks: 'Kurutma tamamlama, depolama hazırlığı' },
      { month: 10, tasks: 'Kış soğan ekimi (ılıman bölgelerde), set dikimi' },
      { month: 11, tasks: 'Kışlık soğan fide gelişimi' },
      { month: 12, tasks: 'Kış dinlenme, don koruması' }
    ]
  },
  {
    name: 'Sarımsak',
    category: 'sogansi',
    notes: 'Kışlık ekim, şifalı lezzetli',
    maintenance: [
      { month: 1, tasks: 'Tarlada kış dinlenme, kök gelişimi' },
      { month: 2, tasks: 'Kış dinlenme devam, soğuğa ihtiyaç var' },
      { month: 3, tasks: 'Sürgün çıkışı başlangıcı, ilk yeşillik' },
      { month: 4, tasks: 'Hızlı yaprak gelişimi, çapalama, gübreleme' },
      { month: 5, tasks: 'Baş oluşumu başlangıcı, çiçek sapı çıkarsa koparma, sulama' },
      { month: 6, tasks: 'Diş oluşumu ve dolum, sulama devam' },
      { month: 7, tasks: 'Yaprak sararmaya başlar, hasat zamanı yaklaşır' },
      { month: 8, tasks: 'Hasat (yapraklar 1/3 sarı), güneşte kurutma, kökler kesme' },
      { month: 9, tasks: 'Kurutma tamamlama, örgü yapma veya depolama' },
      { month: 10, tasks: 'Ekim zamanı, diş ayırma, en iri dişleri seçme' },
      { month: 11, tasks: 'Ekim devam, toprak kapama, malç örtü' },
      { month: 12, tasks: 'Köklenme dönemi, kış dinlenme başlangıcı' }
    ]
  },
  {
    name: 'Pırasa',
    category: 'sogansi',
    notes: 'Soğuğa dayanıklı, kışlık sebze',
    maintenance: [
      { month: 1, tasks: 'Tarlada kış hasadı, çok dayanıklı' },
      { month: 2, tasks: 'Kış hasadı devam, ilkbahar fide yetiştirme başlangıcı' },
      { month: 3, tasks: 'Sera fide yetiştirme, pikaj' },
      { month: 4, tasks: 'Açık alan fide dikimi, derin oluklara (beyazlatma için)' },
      { month: 5, tasks: 'Fide gelişimi, toprak çekme (beyaz kısım uzatma), sulama' },
      { month: 6, tasks: 'Büyüme devam, düzenli toprak çekme, ot kontrolü' },
      { month: 7, tasks: 'Sonbahar-kış için fide yetiştirme, yaz yetiştiriciliği' },
      { month: 8, tasks: 'Fide dikimi (kış hasadı için), toprak hazırlığı' },
      { month: 9, tasks: 'Büyüme dönemi, toprak çekme, gübreleme' },
      { month: 10, tasks: 'Gelişim devam, hasat başlangıcı (erken dikim)' },
      { month: 11, tasks: 'Kış hasadı başlangıcı, don sonrası daha tatlı' },
      { month: 12, tasks: 'Kış hasadı devam, soğuğa çok dayanıklı' }
    ]
  },

  // DİĞER YAYGIM SEBZELER
  {
    name: 'Brokoli',
    category: 'yaprakli',
    notes: 'Soğuk sever, besleyici sebze',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme (ilkbahar için)' },
      { month: 2, tasks: 'Fide gelişimi, sertleştirme' },
      { month: 3, tasks: 'Açık alan fide dikimi, toprak hazırlığı, gübreleme' },
      { month: 4, tasks: 'Bitki gelişimi, yaprak oluşumu, sulama, zararlı kontrolü' },
      { month: 5, tasks: 'Baş oluşumu başlangıcı, düzenli sulama, gübreleme' },
      { month: 6, tasks: 'Baş büyümesi, hasat başlangıcı (ana baş 15-20 cm)' },
      { month: 7, tasks: 'Ana baş hasat, yan sürgün hasat devam, yaz ekimi' },
      { month: 8, tasks: 'Sonbahar için fide dikimi, toprak hazırlığı' },
      { month: 9, tasks: 'Fide büyümesi, sulama, zararlı kontrolü' },
      { month: 10, tasks: 'Baş oluşumu, hasat başlangıcı' },
      { month: 11, tasks: 'Kış hasadı, don sonrası daha tatlı' },
      { month: 12, tasks: 'Kış hasadı devam, soğuğa dayanıklı' }
    ]
  },
  {
    name: 'Karnabahar',
    category: 'yaprakli',
    notes: 'Hassas baş oluşumu, beyaz renkli',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme' },
      { month: 2, tasks: 'Fide gelişimi, sertleştirme' },
      { month: 3, tasks: 'Açık alan fide dikimi, zengin toprak, gübreleme' },
      { month: 4, tasks: 'Bitki gelişimi, yaprak oluşumu, düzenli sulama' },
      { month: 5, tasks: 'Baş oluşumu başlangıcı, yaprakları bağlama (beyazlık için)' },
      { month: 6, tasks: 'Baş büyümesi, hasat başlangıcı, günlük kontrol' },
      { month: 7, tasks: 'İlkbahar hasadı sonu, sonbahar fide hazırlığı' },
      { month: 8, tasks: 'Sonbahar fide dikimi, toprak hazırlığı' },
      { month: 9, tasks: 'Fide büyümesi, zararlı kontrolü' },
      { month: 10, tasks: 'Baş oluşumu, yaprak bağlama' },
      { month: 11, tasks: 'Kış hasadı başlangıcı' },
      { month: 12, tasks: 'Kış hasadı devam, don koruması' }
    ]
  },
  {
    name: 'Kabak (Balkabağı)',
    category: 'kabakgil',
    notes: 'Büyük meyveli, dekoratif ve lezzetli',
    maintenance: [
      { month: 1, tasks: 'Ekim planlaması, çeşit seçimi' },
      { month: 2, tasks: 'Sera fide yetiştirme (erken üretim)' },
      { month: 3, tasks: 'İlk açık alan ekimi (ılıman bölgelerde)' },
      { month: 4, tasks: 'Ana ekim dönemi, geniş alan, zengin toprak, organik gübre' },
      { month: 5, tasks: 'Hızlı büyüme, asma yayılımı, çiçeklenme, tozlaşma' },
      { month: 6, tasks: 'Meyve tutumu, genç balkabağı gelişimi, sulama' },
      { month: 7, tasks: 'Meyve büyümesi, altına tahta koyma (çürüme önleme)' },
      { month: 8, tasks: 'Büyük meyve gelişimi, sulama devam, yaprak kontrolü' },
      { month: 9, tasks: 'Kabuk sertleşmesi, renk değişimi, hasat yaklaşıyor' },
      { month: 10, tasks: 'Hasat zamanı, sap kesilmeden önce kabuk tırnak testi' },
      { month: 11, tasks: 'Hasat tamamlama, güneşte kabuk sertleştirme, depolama' },
      { month: 12, tasks: 'Uzun süreli depolama, serin-kuru ortam, aylarca dayanır' }
    ]
  },
  {
    name: 'Enginar',
    category: 'yaprakli',
    notes: 'Çok yıllık, lezzetli tomurcuk sebzesi',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, soğuğa dayanıklı' },
      { month: 2, tasks: 'Yeni sürgün başlangıcı, eski yaprak temizliği' },
      { month: 3, tasks: 'Hızlı büyüme, gübreleme, sulama başlangıcı' },
      { month: 4, tasks: 'Tomurcuk oluşumu başlangıcı, zararlı kontrolü (yaprak biti)' },
      { month: 5, tasks: 'Ana tomurcuk gelişimi, hasat başlangıcı (tomurcuk sıkı)' },
      { month: 6, tasks: 'Hasat devam, yan tomurcuklar, sürekli toplama' },
      { month: 7, tasks: 'Hasat sonu, bazı tomurcukları çiçek açması için bırakma' },
      { month: 8, tasks: 'Yaz dinlenme, minimal sulama' },
      { month: 9, tasks: 'İkinci büyüme dönemi (bazı bölgelerde), sulama artırma' },
      { month: 10, tasks: 'Sonbahar tomurcukları (ılıman bölgelerde)' },
      { month: 11, tasks: 'Kış hazırlığı, toprak iyileştirme' },
      { month: 12, tasks: 'Kış dinlenme, don koruması (soğuk bölgelerde)' }
    ]
  },
  {
    name: 'Kereviz (Sap)',
    category: 'yaprakli',
    notes: 'Aromalı, gevrek saplı sebze',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme başlangıcı' },
      { month: 2, tasks: 'Fide gelişimi, yavaş büyüme, sabır gerekir' },
      { month: 3, tasks: 'Fide büyütme devam, pikaj' },
      { month: 4, tasks: 'Açık alan fide dikimi, zengin toprak, bol organik madde' },
      { month: 5, tasks: 'Bitki gelişimi, yoğun sulama (nem çok önemli)' },
      { month: 6, tasks: 'Sap gelişimi, düzenli sulama, gübreleme' },
      { month: 7, tasks: 'Büyüme devam, su stresi önleme' },
      { month: 8, tasks: 'Beyazlatma (toprak çekme veya mukavva), hasat yaklaşıyor' },
      { month: 9, tasks: 'Hasat başlangıcı, sap gevrekliği kontrolü' },
      { month: 10, tasks: 'Ana hasat sezonu, dikkatli söküm' },
      { month: 11, tasks: 'Hasat devam, hafif dona dayanır' },
      { month: 12, tasks: 'Son hasat, kış depolaması' }
    ]
  }
];

async function seedDatabase() {
  try {
    // MongoDB bağlantısı
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/garden-db';
    console.log('MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı\n');

    // Mevcut verileri temizle (isteğe bağlı)
    console.log('Mevcut ağaç ve sebze verileri kontrol ediliyor...');
    const existingTreeCount = await Tree.countDocuments();
    const existingVegCount = await Vegetable.countDocuments();

    console.log(`📊 Mevcut durum:`);
    console.log(`   - Ağaç sayısı: ${existingTreeCount}`);
    console.log(`   - Sebze sayısı: ${existingVegCount}\n`);

    // Command line argument ile temizleme kararı (otomatik mod)
    const shouldClear = process.argv.includes('--clear') || existingTreeCount === 0 && existingVegCount === 0;

    if (shouldClear && (existingTreeCount > 0 || existingVegCount > 0)) {
      console.log('🗑️  Mevcut veriler siliniyor...');
      await Tree.deleteMany({});
      await Vegetable.deleteMany({});
      console.log('✅ Mevcut veriler temizlendi\n');
    } else if (existingTreeCount === 0 && existingVegCount === 0) {
      console.log('✅ Veritabanı boş, yeni veriler eklenecek\n');
    } else {
      console.log('⚠️  Mevcut veriler korunacak, sadece yeni veriler eklenecek\n');
      console.log('💡 Tüm verileri silip yeniden eklemek için: node seedData.js --clear\n');
    }

    // Ağaçları ekle
    console.log('🌳 Ağaçlar ekleniyor...');
    let treeCount = 0;
    for (const tree of treeData) {
      try {
        await Tree.create(tree);
        treeCount++;
        console.log(`   ✓ ${tree.name} (${tree.category}) eklendi`);
      } catch (err) {
        console.log(`   ✗ ${tree.name} eklenemedi: ${err.message}`);
      }
    }
    console.log(`\n✅ Toplam ${treeCount} ağaç eklendi\n`);

    // Sebzeleri ekle
    console.log('🥬 Sebzeler ekleniyor...');
    let vegCount = 0;
    for (const veg of vegetableData) {
      try {
        await Vegetable.create(veg);
        vegCount++;
        console.log(`   ✓ ${veg.name} (${veg.category}) eklendi`);
      } catch (err) {
        console.log(`   ✗ ${veg.name} eklenemedi: ${err.message}`);
      }
    }
    console.log(`\n✅ Toplam ${vegCount} sebze eklendi\n`);

    // Özet
    console.log('📊 ÖZET:');
    console.log(`   🌳 Toplam ağaç türü: ${treeCount}`);
    console.log(`   🥬 Toplam sebze türü: ${vegCount}`);
    console.log(`   📦 Toplam: ${treeCount + vegCount} çeşit\n`);

    // Kategorilere göre dağılım
    console.log('📂 KATEGORİ DAĞILIMI:');

    console.log('\n🌳 AĞAÇLAR:');
    const treeCategories = {};
    treeData.forEach(t => {
      treeCategories[t.category] = (treeCategories[t.category] || 0) + 1;
    });
    Object.entries(treeCategories).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} çeşit`);
    });

    console.log('\n🥬 SEBZELER:');
    const vegCategories = {};
    vegetableData.forEach(v => {
      vegCategories[v.category] = (vegCategories[v.category] || 0) + 1;
    });
    Object.entries(vegCategories).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} çeşit`);
    });

    console.log('\n✅ Seed işlemi başarıyla tamamlandı!');

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB bağlantısı kapatıldı');
  }
}

// Script çalıştır
seedDatabase();
