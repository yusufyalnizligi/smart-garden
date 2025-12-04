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

const Tree = mongoose.model('Tree', treeSchema);

// EKSİK AĞAÇLAR
const missingTrees = [
  // MEYVE AĞAÇLARI - Rosaceae Ailesi
  {
    name: 'Ayva',
    category: 'meyve',
    notes: 'Dayanıklı, aromalı, reçel ve marmelat için ideal',
    maintenance: [
      { month: 1, tasks: 'Kış budaması, kuru dal temizliği' },
      { month: 2, tasks: 'Budama tamamlama, gübreleme' },
      { month: 3, tasks: 'Tomurcuk patlaması, toprak işleme' },
      { month: 4, tasks: 'Geç çiçeklenme (don riskinden uzak), tozlaşma' },
      { month: 5, tasks: 'Meyve tutumu, tüylü genç meyveler, sulama' },
      { month: 6, tasks: 'Meyve gelişimi, düzenli sulama' },
      { month: 7, tasks: 'Meyve büyümesi, yeşil renk' },
      { month: 8, tasks: 'Renk değişimi başlangıcı, aromalı koku' },
      { month: 9, tasks: 'Hasat başlangıcı, sarı renk, sert meyve' },
      { month: 10, tasks: 'Ana hasat, depolama (olgunlaşma için)' },
      { month: 11, tasks: 'Hasat sonrası toprak bakımı' },
      { month: 12, tasks: 'Kış dinlenme, budama başlangıcı' }
    ]
  },
  {
    name: 'Muşmula',
    category: 'meyve',
    notes: 'Geç hasat, don sonrası yenilebilir hale gelir',
    maintenance: [
      { month: 1, tasks: 'Hasat devam (don geçirdikten sonra)' },
      { month: 2, tasks: 'Budama, şekillendirme' },
      { month: 3, tasks: 'Tomurcuk patlaması, toprak hazırlığı' },
      { month: 4, tasks: 'Yapraklanma, gübreleme' },
      { month: 5, tasks: 'Geç çiçeklenme (beyaz çiçekler), tozlaşma' },
      { month: 6, tasks: 'Meyve tutumu, genç meyve gelişimi' },
      { month: 7, tasks: 'Meyve büyümesi, sulama' },
      { month: 8, tasks: 'Meyve gelişimi devam' },
      { month: 9, tasks: 'Meyve olgunlaşması başlangıcı' },
      { month: 10, tasks: 'Kahverengi meyve, henüz sert' },
      { month: 11, tasks: 'İlk donlar, meyve yumuşamaya başlar' },
      { month: 12, tasks: 'Hasat zamanı, don sonrası yumuşak ve tatlı' }
    ]
  },
  {
    name: 'Alıç',
    category: 'meyve',
    notes: 'Küçük meyveli, kırmızı, marmelat ve şerbet yapılır',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, budama (gerekirse)' },
      { month: 2, tasks: 'Kış sonu bakım' },
      { month: 3, tasks: 'Tomurcuk patlaması, dikenli dallar' },
      { month: 4, tasks: 'Beyaz çiçekler, bol çiçeklenme, arılar' },
      { month: 5, tasks: 'Meyve tutumu, küçük yeşil meyveler' },
      { month: 6, tasks: 'Meyve gelişimi, sulama (minimal)' },
      { month: 7, tasks: 'Meyve renklenmesi başlangıcı' },
      { month: 8, tasks: 'Kırmızı meyve, hasat başlangıcı' },
      { month: 9, tasks: 'Ana hasat, taze tüketim veya işleme' },
      { month: 10, tasks: 'Hasat sonu, yaprak dökümü' },
      { month: 11, tasks: 'Sonbahar bakımı' },
      { month: 12, tasks: 'Kış dinlenme, çok dayanıklı' }
    ]
  },
  {
    name: 'Yabani Elma',
    category: 'yabani-meyve',
    notes: 'Küçük ekşi meyveli, aşı anacı olarak kullanılır',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, doğal yaşam' },
      { month: 2, tasks: 'Minimal müdahale' },
      { month: 3, tasks: 'Doğal tomurcuk patlaması' },
      { month: 4, tasks: 'Çiçeklenme, tozlaşma (arılar için önemli)' },
      { month: 5, tasks: 'Küçük meyve tutumu' },
      { month: 6, tasks: 'Doğal gelişim' },
      { month: 7, tasks: 'Meyve büyümesi' },
      { month: 8, tasks: 'Yeşil-sarı küçük meyveler' },
      { month: 9, tasks: 'Hasat (aşı anacı veya marmelat için)' },
      { month: 10, tasks: 'Doğal döngü' },
      { month: 11, tasks: 'Yaprak dökümü' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Yenidünya',
    category: 'meyve',
    notes: 'Malta eriği, kışın çiçek açar, ilkbaharda hasat',
    maintenance: [
      { month: 1, tasks: 'Çiçeklenme devam, don koruması önemli' },
      { month: 2, tasks: 'Geç çiçekler, meyve tutumu başlangıcı' },
      { month: 3, tasks: 'Genç meyve gelişimi, zararlı kontrolü' },
      { month: 4, tasks: 'Meyve büyümesi, torbalaşma (koruma için)' },
      { month: 5, tasks: 'Hasat başlangıcı, turuncu renkli, tatlı' },
      { month: 6, tasks: 'Hasat tamamlanması, taze tüketim' },
      { month: 7, tasks: 'Hasat sonrası budama, gübreleme' },
      { month: 8, tasks: 'Yaz bakımı, yeni sürgün kontrolü' },
      { month: 9, tasks: 'Sonbahar gelişimi' },
      { month: 10, tasks: 'Çiçek tomurcuğu oluşumu' },
      { month: 11, tasks: 'Kış çiçeklenme başlangıcı' },
      { month: 12, tasks: 'Beyaz çiçekler, aromalı, don hassasiyeti' }
    ]
  },
  {
    name: 'Nektarin',
    category: 'meyve',
    notes: 'Tüysüz şeftali, parlak ciltli, tatlı',
    maintenance: [
      { month: 1, tasks: 'Yoğun budama, hastalık önleme ilaçlaması' },
      { month: 2, tasks: 'Budama tamamlama, gübreleme' },
      { month: 3, tasks: 'Erken çiçeklenme, don koruması' },
      { month: 4, tasks: 'Meyve tutumu, seyreltme başlangıcı' },
      { month: 5, tasks: 'Yoğun seyreltme, düzenli sulama' },
      { month: 6, tasks: 'Meyve gelişimi, parlak cilt kontrolü' },
      { month: 7, tasks: 'Erken hasat, günlük toplama' },
      { month: 8, tasks: 'Ana hasat, taze pazarlama' },
      { month: 9, tasks: 'Hasat sonu, budama, gübreleme' },
      { month: 10, tasks: 'Yaprak dökümü, toprak bakımı' },
      { month: 11, tasks: 'Kış hazırlığı' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Napolyon Kirazı',
    category: 'meyve',
    notes: 'İri taneli, sarı-kırmızı, tatlı kiraz çeşidi',
    maintenance: [
      { month: 1, tasks: 'Hafif budama, don koruması' },
      { month: 2, tasks: 'Budama tamamlama, gübreleme' },
      { month: 3, tasks: 'Erken çiçeklenme, don alarm' },
      { month: 4, tasks: 'Tozlaşma, meyve tutumu' },
      { month: 5, tasks: 'İri meyve gelişimi, kuş koruma ağları' },
      { month: 6, tasks: 'Hasat zamanı, sarı-kırmızı renkli, iri taneler' },
      { month: 7, tasks: 'Hasat sonu, hafif budama' },
      { month: 8, tasks: 'Hasat sonrası bakım' },
      { month: 9, tasks: 'Toprak bakımı' },
      { month: 10, tasks: 'Yaprak dökümü' },
      { month: 11, tasks: 'Kış öncesi ilaçlama' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },

  // NARENGİYE EKSİKLERİ
  {
    name: 'Greyfurt',
    category: 'narenciye',
    notes: 'İri meyveli, ekşi-acımsı, C vitamini deposu',
    maintenance: [
      { month: 1, tasks: 'Hasat devam, büyük sarı-pembe meyveler' },
      { month: 2, tasks: 'Hasat sonu, budama, gübreleme' },
      { month: 3, tasks: 'Çiçeklenme başlangıcı, beyaz kokulu çiçekler' },
      { month: 4, tasks: 'Tozlaşma, meyve tutumu' },
      { month: 5, tasks: 'Genç meyve gelişimi, sulama' },
      { month: 6, tasks: 'Meyve büyümesi, yeşil büyük meyveler' },
      { month: 7, tasks: 'İri meyve gelişimi, düzenli sulama' },
      { month: 8, tasks: 'Meyve olgunlaşması devam' },
      { month: 9, tasks: 'Renk değişimi başlangıcı' },
      { month: 10, tasks: 'Sarı renk, hasat hazırlığı' },
      { month: 11, tasks: 'Hasat başlangıcı, kalite kontrolü' },
      { month: 12, tasks: 'Ana hasat sezonu' }
    ]
  },
  {
    name: 'Altıntop',
    category: 'narenciye',
    notes: 'İri, sarı-turuncu, tatlı narenciye',
    maintenance: [
      { month: 1, tasks: 'Hasat devam, iri meyveler' },
      { month: 2, tasks: 'Hasat sonu, budama başlangıcı' },
      { month: 3, tasks: 'Bahar sürgünleri, çiçeklenme' },
      { month: 4, tasks: 'Çiçeklenme devam, tozlaşma' },
      { month: 5, tasks: 'Meyve tutumu, sulama başlangıcı' },
      { month: 6, tasks: 'Genç meyve gelişimi' },
      { month: 7, tasks: 'Meyve büyümesi, yeşil büyük meyveler' },
      { month: 8, tasks: 'İri meyve gelişimi' },
      { month: 9, tasks: 'Olgunlaşma başlangıcı' },
      { month: 10, tasks: 'Sarı-turuncu renk' },
      { month: 11, tasks: 'Hasat başlangıcı, tatlı lezzet' },
      { month: 12, tasks: 'Ana hasat' }
    ]
  },
  {
    name: 'Turunç',
    category: 'narenciye',
    notes: 'Acı portakal, marmelat ve reçel için, süs ağacı',
    maintenance: [
      { month: 1, tasks: 'Hasat (acı meyve), marmelat yapımı' },
      { month: 2, tasks: 'Budama, şekillendirme' },
      { month: 3, tasks: 'Çiçeklenme, çok kokulu beyaz çiçekler' },
      { month: 4, tasks: 'Yoğun çiçeklenme, arılar için değerli' },
      { month: 5, tasks: 'Meyve tutumu, çok sayıda meyve' },
      { month: 6, tasks: 'Genç meyve gelişimi' },
      { month: 7, tasks: 'Yeşil meyveler, süs değeri' },
      { month: 8, tasks: 'Meyve gelişimi devam' },
      { month: 9, tasks: 'Renk değişimi başlangıcı' },
      { month: 10, tasks: 'Turuncu renkli meyveler' },
      { month: 11, tasks: 'Olgunlaşma, süs ve hasat' },
      { month: 12, tasks: 'Kış meyvesi, ağaçta kalabilir' }
    ]
  },
  {
    name: 'Kan Portakalı',
    category: 'narenciye',
    notes: 'İçi kırmızı, antioksidan açısından zengin',
    maintenance: [
      { month: 1, tasks: 'Hasat devam, kırmızı iç renk' },
      { month: 2, tasks: 'Hasat sonu, budama, gübreleme' },
      { month: 3, tasks: 'Çiçeklenme başlangıcı' },
      { month: 4, tasks: 'Tozlaşma, meyve tutumu' },
      { month: 5, tasks: 'Genç meyve gelişimi, sulama' },
      { month: 6, tasks: 'Meyve büyümesi' },
      { month: 7, tasks: 'Yeşil meyveler, iç renk gelişimi başlangıcı' },
      { month: 8, tasks: 'Meyve gelişimi, antosiyanin birikimi' },
      { month: 9, tasks: 'Dış renk değişimi, iç kırmızılaşma' },
      { month: 10, tasks: 'Olgunlaşma, renk yoğunlaşması' },
      { month: 11, tasks: 'Hasat başlangıcı, koyu kırmızı iç' },
      { month: 12, tasks: 'Ana hasat, taze sıkım' }
    ]
  },
  {
    name: 'Kumkuat',
    category: 'narenciye',
    notes: 'Minyatür narenciye, kabuğuyla yenir, süs bitkisi',
    maintenance: [
      { month: 1, tasks: 'Hasat devam, turuncu mini meyveler' },
      { month: 2, tasks: 'Hasat sonu, hafif budama' },
      { month: 3, tasks: 'Çiçeklenme, beyaz mini çiçekler' },
      { month: 4, tasks: 'Tozlaşma, meyve tutumu' },
      { month: 5, tasks: 'Küçük yeşil meyveler, sulama' },
      { month: 6, tasks: 'Meyve gelişimi, saksıda yetiştirilebilir' },
      { month: 7, tasks: 'Meyve büyümesi (zeytin boyutunda)' },
      { month: 8, tasks: 'Olgunlaşma başlangıcı' },
      { month: 9, tasks: 'Renk değişimi, yeşilden turuncuya' },
      { month: 10, tasks: 'Turuncu renkli mini meyveler' },
      { month: 11, tasks: 'Hasat, kabuğuyla tüketim, tatlı kabuk-ekşi iç' },
      { month: 12, tasks: 'Kış hasadı, süs değeri yüksek' }
    ]
  },
  {
    name: 'Bergamot',
    category: 'narenciye',
    notes: 'Aromalı, parfüm ve Earl Grey çayı için kullanılır',
    maintenance: [
      { month: 1, tasks: 'Hasat devam, yağ ekstraksiyon' },
      { month: 2, tasks: 'Hasat sonu, budama' },
      { month: 3, tasks: 'Çiçeklenme, çok kokulu beyaz çiçekler' },
      { month: 4, tasks: 'Tozlaşma, meyve tutumu' },
      { month: 5, tasks: 'Genç meyve gelişimi, sulama' },
      { month: 6, tasks: 'Meyve büyümesi, yeşil armut şekilli' },
      { month: 7, tasks: 'Meyve gelişimi, aromalı yağ birikimi' },
      { month: 8, tasks: 'Kabukta esansiyel yağ yoğunlaşması' },
      { month: 9, tasks: 'Renk değişimi başlangıcı' },
      { month: 10, tasks: 'Sarı-yeşil renk, hasat hazırlığı' },
      { month: 11, tasks: 'Hasat başlangıcı, parfüm endüstrisi' },
      { month: 12, tasks: 'Ana hasat, yağ ekstraksiyon' }
    ]
  },

  // SERT KABUKLU EKSİKLERİ
  {
    name: 'Kestane',
    category: 'sert-kabuklu',
    notes: 'Dikenli kabuklı, pişirilerek yenen, nişastalı',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, yapısal kontrol' },
      { month: 2, tasks: 'Kış sonu budama (gerekirse)' },
      { month: 3, tasks: 'Tomurcuk patlaması, yeşil yapraklar' },
      { month: 4, tasks: 'Yapraklanma, gübreleme' },
      { month: 5, tasks: 'Geç çiçeklenme, sarı-beyaz salkımlar' },
      { month: 6, tasks: 'Çiçeklenme devam, tozlaşma, dikenli kabuk oluşumu' },
      { month: 7, tasks: 'Genç kestane gelişimi, yeşil dikenli kabuklar' },
      { month: 8, tasks: 'Kestane büyümesi, kabuk sertleşmesi' },
      { month: 9, tasks: 'Olgunlaşma, kahverengi parlak kestaneler' },
      { month: 10, tasks: 'Hasat, dikenli kabuklar açılır, kestaneler düşer' },
      { month: 11, tasks: 'Hasat tamamlama, pişirme, kestane şekeri' },
      { month: 12, tasks: 'Kış dinlenme, depolama kontrolü' }
    ]
  },
  {
    name: 'Pekan Cevizi',
    category: 'sert-kabuklu',
    notes: 'Amerikan cevizi, ince kabuklu, yağlı ve lezzetli',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, soğuk gereksinimi' },
      { month: 2, tasks: 'Budama (genç ağaçlar), gübreleme' },
      { month: 3, tasks: 'Tomurcuk patlaması, yapraklanma' },
      { month: 4, tasks: 'Çiçeklenme, erkek ve dişi çiçekler, rüzgar tozlaşması' },
      { month: 5, tasks: 'Meyve tutumu, genç pekan gelişimi' },
      { month: 6, tasks: 'Meyve büyümesi, yeşil kabuklar, sulama' },
      { month: 7, tasks: 'İç gelişimi, yağ birikimi' },
      { month: 8, tasks: 'Kabuk sertleşmesi, iç olgunlaşması' },
      { month: 9, tasks: 'Yeşil kabuk çatlaması başlangıcı' },
      { month: 10, tasks: 'Hasat başlangıcı, kabuklar açılır, pekanlar düşer' },
      { month: 11, tasks: 'Ana hasat, kabuk soyma, kurutma' },
      { month: 12, tasks: 'Kış dinlenme, depolama' }
    ]
  },

  // DİĞER MEYVE AĞAÇLARI
  {
    name: 'Trabzon Hurması',
    category: 'meyve',
    notes: 'Cennet hurması, ılık iklim seven, tatlı turuncu meyve',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, don hassasiyeti' },
      { month: 2, tasks: 'Budama, şekillendirme' },
      { month: 3, tasks: 'Tomurcuk patlaması, yapraklanma' },
      { month: 4, tasks: 'Yaprak gelişimi, gübreleme' },
      { month: 5, tasks: 'Çiçeklenme, küçük sarımsı çiçekler' },
      { month: 6, tasks: 'Meyve tutumu, genç yeşil meyveler, seyreltme' },
      { month: 7, tasks: 'Meyve büyümesi, sulama' },
      { month: 8, tasks: 'Meyve gelişimi devam' },
      { month: 9, tasks: 'Renk değişimi, yeşilden turuncuya' },
      { month: 10, tasks: 'Hasat başlangıcı, turuncu parlak meyveler' },
      { month: 11, tasks: 'Ana hasat, tatlı ve yumuşak' },
      { month: 12, tasks: 'Geç hasat (bazı çeşitler), yaprak dökümü' }
    ]
  },
  {
    name: 'Gavur Narı',
    category: 'meyve',
    notes: 'Sakız hurması, kırmızı içli tatlı meyve',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme' },
      { month: 2, tasks: 'Hafif budama' },
      { month: 3, tasks: 'Tomurcuk patlaması' },
      { month: 4, tasks: 'Yapraklanma, gübreleme' },
      { month: 5, tasks: 'Çiçeklenme, tozlaşma' },
      { month: 6, tasks: 'Meyve tutumu, genç meyveler' },
      { month: 7, tasks: 'Meyve gelişimi, sulama' },
      { month: 8, tasks: 'Meyve büyümesi devam' },
      { month: 9, tasks: 'Olgunlaşma başlangıcı' },
      { month: 10, tasks: 'Hasat, kırmızı-turuncu renkli' },
      { month: 11, tasks: 'Hasat devam, tatlı lezzet' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },

  // TROPİK MEYVELER (Türkiye'nin ılık bölgelerinde yetiştirilebilir)
  {
    name: 'Mango',
    category: 'tropik',
    notes: 'Sıcak iklim isteyen, tatlı ve aromalı tropik meyve',
    maintenance: [
      { month: 1, tasks: 'Kış bakımı (sıcak bölgelerde), don koruması' },
      { month: 2, tasks: 'Çiçeklenme başlangıcı (tropik bölgelerde)' },
      { month: 3, tasks: 'Çiçeklenme, tozlaşma, gübreleme' },
      { month: 4, tasks: 'Meyve tutumu, genç mango gelişimi' },
      { month: 5, tasks: 'Meyve büyümesi, sulama artırma' },
      { month: 6, tasks: 'Meyve gelişimi, yeşil büyük meyveler' },
      { month: 7, tasks: 'Olgunlaşma başlangıcı, renk değişimi' },
      { month: 8, tasks: 'Hasat başlangıcı, sarı-turuncu-kırmızı' },
      { month: 9, tasks: 'Ana hasat, taze tüketim' },
      { month: 10, tasks: 'Hasat sonu, toprak bakımı' },
      { month: 11, tasks: 'Sonbahar bakımı' },
      { month: 12, tasks: 'Kış koruması (Türkiye için sera gerekli)' }
    ]
  },
  {
    name: 'Avokado',
    category: 'tropik',
    notes: 'Sağlıklı yağlı meyve, subtropik iklim isteyen',
    maintenance: [
      { month: 1, tasks: 'Kış koruması, don hassasiyeti' },
      { month: 2, tasks: 'Budama, gübreleme' },
      { month: 3, tasks: 'Çiçeklenme başlangıcı, küçük sarı-yeşil çiçekler' },
      { month: 4, tasks: 'Tozlaşma (A ve B tipi uyumu), meyve tutumu' },
      { month: 5, tasks: 'Genç meyve gelişimi, sulama' },
      { month: 6, tasks: 'Meyve büyümesi, yeşil armut şekilli' },
      { month: 7, tasks: 'Meyve gelişimi devam' },
      { month: 8, tasks: 'Büyük yeşil meyveler' },
      { month: 9, tasks: 'Olgunlaşma (ağaçta olgunlaşmaz)' },
      { month: 10, tasks: 'Hasat başlangıcı, ağaçtan kopardıktan sonra olgunlaşır' },
      { month: 11, tasks: 'Ana hasat, yumuşama testi' },
      { month: 12, tasks: 'Hasat devam, kış koruması' }
    ]
  },
  {
    name: 'Muz',
    category: 'tropik',
    notes: 'Sıcak ve nemli iklim isteyen, Türkiye\'de Akdeniz\'de yetişir',
    maintenance: [
      { month: 1, tasks: 'Kış koruması (don hassas), sera örtüsü' },
      { month: 2, tasks: 'Yeni sürgün kontrolü, gübreleme' },
      { month: 3, tasks: 'Hızlı büyüme başlangıcı, sulama artırma' },
      { month: 4, tasks: 'Yaprak gelişimi, gövde kalınlaşması' },
      { month: 5, tasks: 'Çiçek sapı çıkışı, mor çiçek' },
      { month: 6, tasks: 'Meyve salkımı oluşumu, yeşil mini muzlar' },
      { month: 7, tasks: 'Meyve büyümesi, düzenli sulama' },
      { month: 8, tasks: 'Muzlar büyüyor, yeşil renkli' },
      { month: 9, tasks: 'Hasat öncesi, hala yeşil (yeşil toplanır)' },
      { month: 10, tasks: 'Hasat, salkım kesimi, olgunlaştırma odası' },
      { month: 11, tasks: 'Hasat sonrası bakım, yeni sürgün büyümesi' },
      { month: 12, tasks: 'Kış koruması, don önleme' }
    ]
  },

  // YUMUŞAK MEYVELİ (Berries)
  {
    name: 'Beyaz Dut',
    category: 'meyve',
    notes: 'Tatlı beyaz meyveli, gölge yapan, ipek böceği yaprağı',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, budama (gerekirse)' },
      { month: 2, tasks: 'Kış sonu bakım' },
      { month: 3, tasks: 'Tomurcuk patlaması, yapraklanma' },
      { month: 4, tasks: 'Çiçeklenme (göze çarpmaz), yaprak gelişimi' },
      { month: 5, tasks: 'Meyve tutumu, yeşil mini meyveler' },
      { month: 6, tasks: 'Meyve olgunlaşması, beyaz-krem renkli, tatlı' },
      { month: 7, tasks: 'Hasat devam, günlük toplama, çok yumuşak' },
      { month: 8, tasks: 'Hasat sonu, yaprak bakımı' },
      { month: 9, tasks: 'Sonbahar bakımı' },
      { month: 10, tasks: 'Yaprak dökümü' },
      { month: 11, tasks: 'Kış hazırlığı' },
      { month: 12, tasks: 'Kış dinlenme, çok dayanıklı' }
    ]
  },
  {
    name: 'Kara Dut',
    category: 'meyve',
    notes: 'Koyu mor-siyah tatlı meyveli, reçel ve şerbet için',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, budama' },
      { month: 2, tasks: 'Budama tamamlama' },
      { month: 3, tasks: 'Tomurcuk patlaması' },
      { month: 4, tasks: 'Yapraklanma, çiçeklenme' },
      { month: 5, tasks: 'Meyve tutumu, yeşil meyveler' },
      { month: 6, tasks: 'Renk değişimi, kırmızıdan siyaha, hasat başlangıcı' },
      { month: 7, tasks: 'Ana hasat, koyu mor-siyah, çok tatlı' },
      { month: 8, tasks: 'Hasat sonu' },
      { month: 9, tasks: 'Sonbahar bakımı' },
      { month: 10, tasks: 'Yaprak dökümü' },
      { month: 11, tasks: 'Kış hazırlığı' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Kızılcık',
    category: 'meyve',
    notes: 'Ekşi kırmızı meyve, şerbet ve pestil yapılır',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme' },
      { month: 2, tasks: 'Budama (gerekirse)' },
      { month: 3, tasks: 'Erken çiçeklenme, sarı çiçekler (yapraktan önce)' },
      { month: 4, tasks: 'Yapraklanma, meyve tutumu' },
      { month: 5, tasks: 'Genç yeşil meyveler' },
      { month: 6, tasks: 'Meyve büyümesi' },
      { month: 7, tasks: 'Renk değişimi, yeşilden kırmızıya' },
      { month: 8, tasks: 'Hasat, parlak kırmızı, ekşi lezzet' },
      { month: 9, tasks: 'Hasat devam, şerbet yapımı' },
      { month: 10, tasks: 'Sonbahar yaprak renklenmesi' },
      { month: 11, tasks: 'Yaprak dökümü' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Karayemiş',
    category: 'meyve',
    notes: 'Taflan, siyah kiraz benzeri, hoş kokulu çiçekli',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, soğuğa dayanıklı' },
      { month: 2, tasks: 'Kış sonu bakım' },
      { month: 3, tasks: 'Tomurcuk patlaması' },
      { month: 4, tasks: 'Çiçeklenme, beyaz salkım şeklinde kokulu çiçekler' },
      { month: 5, tasks: 'Tozlaşma, meyve tutumu, küçük yeşil meyveler' },
      { month: 6, tasks: 'Meyve renklenmesi, kırmızıdan siyaha' },
      { month: 7, tasks: 'Hasat, siyah parlak meyveler, tatlımsı' },
      { month: 8, tasks: 'Hasat sonu' },
      { month: 9, tasks: 'Sonbahar bakımı' },
      { month: 10, tasks: 'Yaprak dökümü' },
      { month: 11, tasks: 'Kış hazırlığı' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Keçiboynuzu',
    category: 'meyve',
    notes: 'Harnup, uzun kahverengi bakla, pekmez yapılır',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, ılık iklim sever' },
      { month: 2, tasks: 'Minimal bakım' },
      { month: 3, tasks: 'Tomurcuk patlaması' },
      { month: 4, tasks: 'Yapraklanma, daima yeşil (bazı çeşitler)' },
      { month: 5, tasks: 'Çiçeklenme, küçük kırmızımsı çiçekler' },
      { month: 6, tasks: 'Meyve tutumu, uzun yeşil baklalar' },
      { month: 7, tasks: 'Bakla gelişimi' },
      { month: 8, tasks: 'Bakla büyümesi, uzun ve düz' },
      { month: 9, tasks: 'Renk değişimi, yeşilden kahverengiye' },
      { month: 10, tasks: 'Hasat başlangıcı, koyu kahverengi, sert' },
      { month: 11, tasks: 'Ana hasat, tatlı içli baklalar' },
      { month: 12, tasks: 'Hasat devam, pekmez ve toz yapımı' }
    ]
  },
  {
    name: 'Sumak',
    category: 'baharat',
    notes: 'Ekşi kırmızı meyve, baharat olarak kullanılır',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, çok dayanıklı' },
      { month: 2, tasks: 'Budama (gerekirse)' },
      { month: 3, tasks: 'Tomurcuk patlaması' },
      { month: 4, tasks: 'Yapraklanma, tüylü yapraklar' },
      { month: 5, tasks: 'Çiçeklenme, sarı-yeşil salkım çiçekler' },
      { month: 6, tasks: 'Meyve tutumu, yeşil salkımlar' },
      { month: 7, tasks: 'Meyve gelişimi' },
      { month: 8, tasks: 'Renk değişimi, kırmızıya dönüş' },
      { month: 9, tasks: 'Hasat başlangıcı, koyu kırmızı salkımlar' },
      { month: 10, tasks: 'Ana hasat, kurutma, öğütme' },
      { month: 11, tasks: 'Sonbahar yaprak renklenmesi (kırmızı)' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Yaban Mersini',
    category: 'yabani-meyve',
    notes: 'Blueberry, siyah-mavi mini meyveler, antioksidan deposu',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, asitli toprak sevgisi' },
      { month: 2, tasks: 'Budama, kuru dal temizliği' },
      { month: 3, tasks: 'Tomurcuk patlaması, yapraklanma' },
      { month: 4, tasks: 'Çiçeklenme, beyaz-pembe çan şeklinde çiçekler' },
      { month: 5, tasks: 'Meyve tutumu, yeşil küçük meyveler, arı tozlaşması' },
      { month: 6, tasks: 'Meyve renklenmesi, pembe-mor-mavi, hasat başlangıcı' },
      { month: 7, tasks: 'Ana hasat, koyu mavi meyveler, günlük toplama' },
      { month: 8, tasks: 'Hasat devam, taze tüketim, dondurmak' },
      { month: 9, tasks: 'Hasat sonu, sonbahar yaprak renklenmesi (kırmızı)' },
      { month: 10, tasks: 'Yaprak dökümü, toprak bakımı' },
      { month: 11, tasks: 'Kış hazırlığı, asitli malç' },
      { month: 12, tasks: 'Kış dinlenme, soğuğa dayanıklı' }
    ]
  },
  {
    name: 'Ahududu',
    category: 'yumusak-meyveli',
    notes: 'Frambuaz, kırmızı yumuşak meyve, dikenli gövdeler',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, eski gövdelerin kesilmesi' },
      { month: 2, tasks: 'Budama tamamlama, desteklere bağlama' },
      { month: 3, tasks: 'Yeni sürgün çıkışı, gübreleme' },
      { month: 4, tasks: 'Hızlı büyüme, yaprak gelişimi' },
      { month: 5, tasks: 'Çiçeklenme, beyaz çiçekler, arı tozlaşması' },
      { month: 6, tasks: 'Meyve tutumu, yeşil mini meyveler, hasat başlangıcı' },
      { month: 7, tasks: 'Ana hasat, kırmızı yumuşak meyveler, günlük toplama' },
      { month: 8, tasks: 'Hasat devam, yaz çeşitleri, yeni sürgün gelişimi' },
      { month: 9, tasks: 'Sonbahar hasadı (bazı çeşitler), budama' },
      { month: 10, tasks: 'Meyve vermiş gövdelerin kesilmesi' },
      { month: 11, tasks: 'Kış hazırlığı, toprak örtüsü' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Böğürtlen',
    category: 'yumusak-meyveli',
    notes: 'Siyah yumuşak meyve, çok dikenli, yabani ve kültür çeşitleri',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, budama (dikenli-dikensiz)' },
      { month: 2, tasks: 'Eski gövdelerin kesilmesi, desteklere bağlama' },
      { month: 3, tasks: 'Yeni sürgün çıkışı, hızlı büyüme' },
      { month: 4, tasks: 'Yaprak gelişimi, gübreleme, sulama' },
      { month: 5, tasks: 'Çiçeklenme, beyaz-pembe çiçekler' },
      { month: 6, tasks: 'Meyve tutumu, yeşil meyveler, renk değişimi başlangıcı' },
      { month: 7, tasks: 'Hasat başlangıcı, kırmızıdan siyaha, günlük toplama' },
      { month: 8, tasks: 'Ana hasat, koyu siyah tatlı meyveler' },
      { month: 9, tasks: 'Hasat sonu, yeni sürgün büyümesi' },
      { month: 10, tasks: 'Meyve vermiş dalların budanması' },
      { month: 11, tasks: 'Kış hazırlığı' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Bektaşi Üzümü',
    category: 'yumusak-meyveli',
    notes: 'Frenk üzümü, kırmızı-beyaz şeffaf meyveler, ekşi',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, yapraklarını döker' },
      { month: 2, tasks: 'Budama, eski dalları kısaltma, gübreleme' },
      { month: 3, tasks: 'Tomurcuk patlaması, yapraklanma' },
      { month: 4, tasks: 'Çiçeklenme, küçük yeşilimsi çiçekler' },
      { month: 5, tasks: 'Meyve tutumu, küçük yeşil salkımlar' },
      { month: 6, tasks: 'Meyve büyümesi, şeffaflaşma başlangıcı, hasat yaklaşıyor' },
      { month: 7, tasks: 'Hasat, kırmızı veya beyaz şeffaf meyveler, ekşi' },
      { month: 8, tasks: 'Hasat devam, reçel yapımı' },
      { month: 9, tasks: 'Hasat sonu' },
      { month: 10, tasks: 'Yaprak dökümü' },
      { month: 11, tasks: 'Kış hazırlığı' },
      { month: 12, tasks: 'Kış dinlenme, soğuğa dayanıklı' }
    ]
  },

  // DİĞER TROPİK/EKZOTİK (Türkiye'de sera ile yetiştirilebilir)
  {
    name: 'Papaya',
    category: 'tropik',
    notes: 'Tropik meyve, ağaç gibi büyüyen otsu bitki',
    maintenance: [
      { month: 1, tasks: 'Sera koruması, sıcak ortam gerekli' },
      { month: 2, tasks: 'Gübreleme, sulama' },
      { month: 3, tasks: 'Hızlı büyüme, yaprak gelişimi' },
      { month: 4, tasks: 'Çiçeklenme başlangıcı, erkek-dişi-hermafrodit tipler' },
      { month: 5, tasks: 'Meyve tutumu, gövdede doğrudan meyve' },
      { month: 6, tasks: 'Genç yeşil meyveler, düzenli sulama' },
      { month: 7, tasks: 'Meyve büyümesi, yeşil büyük meyveler' },
      { month: 8, tasks: 'Olgunlaşma başlangıcı, renk değişimi' },
      { month: 9, tasks: 'Hasat, sarı-turuncu, yumuşak' },
      { month: 10, tasks: 'Hasat devam, taze tüketim' },
      { month: 11, tasks: 'Sera bakımı, sıcaklık kontrolü' },
      { month: 12, tasks: 'Kış sera koruması' }
    ]
  },
  {
    name: 'Liçi',
    category: 'tropik',
    notes: 'Lychee, kırmızı kabuklu, beyaz içli, tatlı tropik meyve',
    maintenance: [
      { month: 1, tasks: 'Soğuk gereksinimi (hafif), çiçeklenme için önemli' },
      { month: 2, tasks: 'Çiçeklenme başlangıcı, küçük sarı çiçekler' },
      { month: 3, tasks: 'Tozlaşma, meyve tutumu' },
      { month: 4, tasks: 'Genç meyve gelişimi, yeşil mini meyveler' },
      { month: 5, tasks: 'Meyve büyümesi, salkım halinde' },
      { month: 6, tasks: 'Renk değişimi, yeşilden kırmızıya' },
      { month: 7, tasks: 'Hasat, parlak kırmızı kabuklu meyveler' },
      { month: 8, tasks: 'Hasat devam, beyaz şeffaf iç' },
      { month: 9, tasks: 'Hasat sonu' },
      { month: 10, tasks: 'Sonbahar bakımı' },
      { month: 11, tasks: 'Kış hazırlığı, ılık ortam' },
      { month: 12, tasks: 'Hafif soğuk dönemi (çiçek için gerekli)' }
    ]
  },
  {
    name: 'Rambutan',
    category: 'tropik',
    notes: 'Kıllı kırmızı kabuklu, liçi benzeri tropik meyve',
    maintenance: [
      { month: 1, tasks: 'Tropik iklim gerekli, sera ortamı' },
      { month: 2, tasks: 'Çiçeklenme başlangıcı' },
      { month: 3, tasks: 'Tozlaşma, meyve tutumu' },
      { month: 4, tasks: 'Genç yeşil meyveler, kıllı kabuk' },
      { month: 5, tasks: 'Meyve büyümesi' },
      { month: 6, tasks: 'Renk değişimi, yeşilden kırmızı-turuncu' },
      { month: 7, tasks: 'Hasat, kıllı parlak kırmızı kabuk' },
      { month: 8, tasks: 'Hasat devam, beyaz tatlı iç' },
      { month: 9, tasks: 'Hasat sonu' },
      { month: 10, tasks: 'Bakım devam' },
      { month: 11, tasks: 'Sera koruması' },
      { month: 12, tasks: 'Yüksek nem ve sıcaklık' }
    ]
  },
  {
    name: 'Guava',
    category: 'tropik',
    notes: 'Pembe-beyaz içli, aromalı tropik/subtropik meyve',
    maintenance: [
      { month: 1, tasks: 'Hafif don dayanımı, örtü koruması' },
      { month: 2, tasks: 'Budama, gübreleme' },
      { month: 3, tasks: 'Çiçeklenme, beyaz çiçekler' },
      { month: 4, tasks: 'Tozlaşma, meyve tutumu' },
      { month: 5, tasks: 'Genç yeşil meyveler' },
      { month: 6, tasks: 'Meyve büyümesi, armut şekilli' },
      { month: 7, tasks: 'Olgunlaşma, sarı-yeşil renk' },
      { month: 8, tasks: 'Hasat, aromalı koku, pembe iç' },
      { month: 9, tasks: 'Hasat devam, C vitamini deposu' },
      { month: 10, tasks: 'Hasat sonu' },
      { month: 11, tasks: 'Sonbahar bakımı' },
      { month: 12, tasks: 'Kış koruması' }
    ]
  },
  {
    name: 'Karambola',
    category: 'tropik',
    notes: 'Yıldız meyvesi, kesildiğinde yıldız şekli, sarı-yeşil',
    maintenance: [
      { month: 1, tasks: 'Tropik iklim, sera gerekli' },
      { month: 2, tasks: 'Çiçeklenme, küçük pembe-mor çiçekler' },
      { month: 3, tasks: 'Tozlaşma, meyve tutumu' },
      { month: 4, tasks: 'Genç yeşil meyveler, 5 köşeli' },
      { month: 5, tasks: 'Meyve büyümesi' },
      { month: 6, tasks: 'Meyve gelişimi devam' },
      { month: 7, tasks: 'Renk değişimi, sarıya dönüş' },
      { month: 8, tasks: 'Hasat, parlak sarı, yıldız şekilli dilimler' },
      { month: 9, tasks: 'Hasat devam, ekşi-tatlı lezzet' },
      { month: 10, tasks: 'Hasat sonu' },
      { month: 11, tasks: 'Sera bakımı' },
      { month: 12, tasks: 'Sıcak ve nemli ortam' }
    ]
  },
  {
    name: 'Pitaya',
    category: 'tropik',
    notes: 'Ejder meyvesi, kaktüs meyvesi, pembe-beyaz içli',
    maintenance: [
      { month: 1, tasks: 'Sıcak ortam, minimal su' },
      { month: 2, tasks: 'Çiçeklenme hazırlığı' },
      { month: 3, tasks: 'Gece çiçeklenen, büyük beyaz çiçekler' },
      { month: 4, tasks: 'Tozlaşma (el ile veya yarasa), meyve tutumu' },
      { month: 5, tasks: 'Genç yeşil-pembe meyveler, pullu kabuk' },
      { month: 6, tasks: 'Meyve büyümesi, parlak pembe-kırmızı' },
      { month: 7, tasks: 'Olgunlaşma, canlı renk' },
      { month: 8, tasks: 'Hasat, beyaz veya pembe iç, siyah tohumlar' },
      { month: 9, tasks: 'Hasat devam, tatlı ve hafif lezzet' },
      { month: 10, tasks: 'İkinci çiçeklenme (sıcak bölgelerde)' },
      { month: 11, tasks: 'Sera bakımı' },
      { month: 12, tasks: 'Kış koruması, sıcak tutulmalı' }
    ]
  },

  // ÖZEL AĞAÇLAR
  {
    name: 'Sakız Ağacı',
    category: 'reçineli',
    notes: 'Mastik, sakız üretimi için, Akdeniz özel türü',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, ılık iklim' },
      { month: 2, tasks: 'Budama (minimal)' },
      { month: 3, tasks: 'Tomurcuk patlaması, yapraklanma' },
      { month: 4, tasks: 'Çiçeklenme, küçük sarı-yeşil çiçekler' },
      { month: 5, tasks: 'Meyve tutumu, küçük kırmızı meyveler' },
      { month: 6, tasks: 'Sakız kesim başlangıcı, kabukta çizikler' },
      { month: 7, tasks: 'Sakız toplama, beyaz reçine damlaları' },
      { month: 8, tasks: 'Sakız toplama devam, güneşte kurutma' },
      { month: 9, tasks: 'Toplama sonu, reçine işleme' },
      { month: 10, tasks: 'Meyve olgunlaşması' },
      { month: 11, tasks: 'Sonbahar bakımı' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  }
];

async function addMissingTrees() {
  try {
    console.log('🌐 MongoDB\'ye bağlanılıyor...\n');
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/garden-db';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Bağlantı başarılı\n');

    // Ağaçları ekle
    console.log('🌳 EKSİK AĞAÇLAR EKLENİYOR...\n');
    let success = 0;
    let skip = 0;
    let fail = 0;

    for (const tree of missingTrees) {
      try {
        // Aynı isimde ağaç var mı kontrol et
        const existing = await Tree.findOne({ name: tree.name });
        if (existing) {
          console.log(`   ⚠️  ${tree.name} zaten mevcut, atlanıyor`);
          skip++;
          continue;
        }

        await Tree.create(tree);
        success++;
        console.log(`   ✅ ${tree.name} (${tree.category}) eklendi`);
      } catch (err) {
        console.log(`   ❌ ${tree.name} eklenemedi: ${err.message}`);
        fail++;
      }
    }

    console.log(`\n📊 ÖZET:`);
    console.log(`   ✅ Başarılı: ${success} ağaç eklendi`);
    console.log(`   ⚠️  Atlanan: ${skip} (zaten mevcut)`);
    console.log(`   ❌ Başarısız: ${fail}`);

    // Toplam ağaç sayısı
    const totalTrees = await Tree.countDocuments();
    console.log(`\n🌳 Toplam ağaç sayısı: ${totalTrees}\n`);

    // Kategorilere göre dağılım
    const categories = await Tree.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('📂 KATEGORİ DAĞILIMI:');
    categories.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count} çeşit`);
    });

    console.log('\n✅ Eksik ağaçlar başarıyla eklendi!\n');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 MongoDB bağlantısı kapatıldı\n');
  }
}

// Script'i çalıştır
addMissingTrees();
