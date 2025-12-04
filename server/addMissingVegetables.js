const mongoose = require('mongoose');
require('dotenv').config();

// Schema tanımları
const maintenanceSchema = new mongoose.Schema({
  month: { type: Number, min: 1, max: 12, required: true },
  tasks: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

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

const Vegetable = mongoose.model('Vegetable', vegetableSchema);

// EKSİK SEBZELER
const missingVegetables = [
  // YAPRAKLI SEBZELER - MARUL ÇEŞİTLERİ
  {
    name: 'Kıvırcık Marul',
    category: 'yaprakli',
    notes: 'Hafif yapraklı, çıtır, salatalık olarak popüler',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, ışık kontrolü' },
      { month: 2, tasks: 'Sera yetiştiriciliği, fide gelişimi' },
      { month: 3, tasks: 'İlkbahar açık alan ekimi, toprak hazırlığı' },
      { month: 4, tasks: 'Hızlı büyüme, 30-40 gün sonra hasat, sürekli ekim' },
      { month: 5, tasks: 'Hasat ve yeni ekim döngüsü, taze salata' },
      { month: 6, tasks: 'Sıcakta tohuma kaçma riski, gölgeleme' },
      { month: 7, tasks: 'Yaz molası veya serin bölge ekimi' },
      { month: 8, tasks: 'Sonbahar ekimi başlangıcı' },
      { month: 9, tasks: 'Yoğun sonbahar ekimi, ideal sezon' },
      { month: 10, tasks: 'Hasat ve ekim devam, taze tüketim' },
      { month: 11, tasks: 'Kış ekimi, sera veya örtü altı' },
      { month: 12, tasks: 'Sera hasadı, soğuğa dayanıklı' }
    ]
  },
  {
    name: 'Göbek Marul',
    category: 'yaprakli',
    notes: 'İceberg, sıkı baş yapan, uzun ömürlü marul',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme' },
      { month: 2, tasks: 'Fide gelişimi, sertleştirme' },
      { month: 3, tasks: 'Açık alan fide dikimi, geniş aralıklı' },
      { month: 4, tasks: 'Baş oluşumu başlangıcı, düzenli sulama' },
      { month: 5, tasks: 'Baş sıkılaşması, hasat yaklaşıyor (60-80 gün)' },
      { month: 6, tasks: 'Hasat, sıkı beyaz baş, buzdolabında dayanıklı' },
      { month: 7, tasks: 'Yaz ekimi (serin bölgelerde)' },
      { month: 8, tasks: 'Sonbahar ekimi için fide' },
      { month: 9, tasks: 'Sonbahar dikimi, ideal büyüme' },
      { month: 10, tasks: 'Baş gelişimi, sulama' },
      { month: 11, tasks: 'Hasat başlangıcı' },
      { month: 12, tasks: 'Kış hasadı, hafif dona dayanır' }
    ]
  },

  // YAPRAKLI - AROMATİK OT VE YEŞİLLİKLER
  {
    name: 'Maydanoz',
    category: 'aromatik',
    notes: 'Taze ve kuru kullanılan, yüksek C vitamini',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi (yavaş çıkış)' },
      { month: 2, tasks: 'Fide çıkışı, sabır gerektirir (2-3 hafta)' },
      { month: 3, tasks: 'Açık alan ekimi, nemli toprak' },
      { month: 4, tasks: 'Fide gelişimi, seyreltme, sulama' },
      { month: 5, tasks: 'Hasat başlangıcı, dış yaprakları koparma' },
      { month: 6, tasks: 'Sürekli hasat, yeni yaprak gelişimi' },
      { month: 7, tasks: 'Hasat devam, sıcakta çiçek sapı kontrolü' },
      { month: 8, tasks: 'Hasat ve yeni ekim' },
      { month: 9, tasks: 'Sonbahar yetiştiriciliği, ideal dönem' },
      { month: 10, tasks: 'Hasat devam, kış için dondurmak' },
      { month: 11, tasks: 'Kış hasadı, soğuğa dayanıklı' },
      { month: 12, tasks: 'Kış hasadı devam, kar altında bile' }
    ]
  },
  {
    name: 'Dereotu',
    category: 'aromatik',
    notes: 'Hassas yapraklı, taze kullanılan aromatik ot',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, sıcak ortam' },
      { month: 2, tasks: 'Fide gelişimi, ince yapraklar' },
      { month: 3, tasks: 'İlkbahar açık alan ekimi, gölgeli alan tercih eder' },
      { month: 4, tasks: 'Hızlı büyüme, 40-50 gün sonra hasat, sürekli ekim' },
      { month: 5, tasks: 'Hasat, taze kullanım, dondurmak' },
      { month: 6, tasks: 'Sıcakta hızla çiçek açar, sürekli ekim gerekli' },
      { month: 7, tasks: 'Yaz molası, tohum toplama (çiçek açmışlardan)' },
      { month: 8, tasks: 'Sonbahar ekimi başlangıcı' },
      { month: 9, tasks: 'Yoğun ekim, ideal büyüme mevsimi' },
      { month: 10, tasks: 'Hasat devam' },
      { month: 11, tasks: 'Sera ekimi, kış için' },
      { month: 12, tasks: 'Sera hasadı, taze kullanım' }
    ]
  },
  {
    name: 'Nane',
    category: 'aromatik',
    notes: 'Çok yıllık, hızla yayılan, kokulu ot',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, kök halinde bekler' },
      { month: 2, tasks: 'Kök bölme ve dikme zamanı' },
      { month: 3, tasks: 'Sürgün çıkışı, hızlı büyüme başlangıcı' },
      { month: 4, tasks: 'Yoğun yaprak gelişimi, sulama, yayılma kontrolü' },
      { month: 5, tasks: 'Hasat başlangıcı, uç kısmını kesme, sürekli hasat' },
      { month: 6, tasks: 'Çiçeklenme öncesi en aromalı dönem, hasat' },
      { month: 7, tasks: 'Çiçeklenme, hasat, kurutma için toplama' },
      { month: 8, tasks: 'Hasat devam, taze ve kuru kullanım' },
      { month: 9, tasks: 'Sonbahar hasadı, yeni sürgünler' },
      { month: 10, tasks: 'Son hasat, kış öncesi temizlik' },
      { month: 11, tasks: 'Yaprak dökümü, kış hazırlığı' },
      { month: 12, tasks: 'Kış dinlenme, kökleri canlı kalır' }
    ]
  },
  {
    name: 'Semizotu',
    category: 'yaprakli',
    notes: 'Omega-3 deposu, etli yapraklı yaz sebzesi',
    maintenance: [
      { month: 1, tasks: 'Ekim için erken, bekle' },
      { month: 2, tasks: 'Sera ekimi (sıcak bölgelerde)' },
      { month: 3, tasks: 'İlk açık alan ekimi (toprak ısınınca)' },
      { month: 4, tasks: 'Ana ekim dönemi, hızlı çıkış, seyreltme' },
      { month: 5, tasks: 'İlk hasat (10-15 cm), sürekli ekim, taze tüketim' },
      { month: 6, tasks: 'Yoğun hasat, sıcak sever, kendini eker' },
      { month: 7, tasks: 'Hasat devam, yaz sebzesi, turşu yapımı' },
      { month: 8, tasks: 'Hasat ve ekim devam' },
      { month: 9, tasks: 'Son ekim, hasat devam' },
      { month: 10, tasks: 'Hasat sonu, soğukta zayıflar' },
      { month: 11, tasks: 'Bitki temizliği' },
      { month: 12, tasks: 'Dinlenme dönemi' }
    ]
  },
  {
    name: 'Tere',
    category: 'yaprakli',
    notes: 'Acımsı lezzetli, hızlı büyüyen yapraklı sebze',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, soğuğa dayanıklı' },
      { month: 2, tasks: 'Sera yetiştiriciliği, hızlı büyüme' },
      { month: 3, tasks: 'İlkbahar açık alan ekimi' },
      { month: 4, tasks: 'Hızlı hasat (20-30 gün), sürekli ekim, taze salata' },
      { month: 5, tasks: 'Hasat ve ekim döngüsü' },
      { month: 6, tasks: 'Sıcakta acılaşır, gölgeleme' },
      { month: 7, tasks: 'Yaz molası (çok sıcak bölgelerde)' },
      { month: 8, tasks: 'Sonbahar ekimi başlangıcı' },
      { month: 9, tasks: 'Yoğun ekim, ideal büyüme' },
      { month: 10, tasks: 'Hasat devam, taze sandviç yeşiliği' },
      { month: 11, tasks: 'Kış ekimi, soğuğa dayanıklı' },
      { month: 12, tasks: 'Sera veya örtü altı yetiştirme' }
    ]
  },
  {
    name: 'Kuzukulağı',
    category: 'yaprakli',
    notes: 'Lamb\'s lettuce, kış salatasının favorisi',
    maintenance: [
      { month: 1, tasks: 'Kış hasadı, çok dayanıklı, kar altında bile' },
      { month: 2, tasks: 'Kış hasadı devam, taze salata' },
      { month: 3, tasks: 'Son hasat, ilkbahar ekimi (hızla çiçeklenir)' },
      { month: 4, tasks: 'Çiçeklenme, tohum toplama' },
      { month: 5, tasks: 'Yaz molası, kendini eker' },
      { month: 6, tasks: 'Ekim için erken' },
      { month: 7, tasks: 'Ekim için erken' },
      { month: 8, tasks: 'Erken sonbahar ekimi' },
      { month: 9, tasks: 'Ana ekim dönemi, kış hasadı için' },
      { month: 10, tasks: 'Ekim devam, hasat başlangıcı' },
      { month: 11, tasks: 'Hasat başlangıcı, küçük yaprak rozetleri' },
      { month: 12, tasks: 'Kış hasadı, soğuğa çok dayanıklı, taze yeşillik' }
    ]
  },

  // LAHANA ÇEŞİTLERİ
  {
    name: 'Kara Lahana',
    category: 'yaprakli',
    notes: 'Karadeniz\'in meşhur yeşili, çok dayanıklı',
    maintenance: [
      { month: 1, tasks: 'Kış hasadı, soğukta daha tatlı' },
      { month: 2, tasks: 'Kış hasadı devam, dış yaprakları koparma' },
      { month: 3, tasks: 'Son hasat, çiçeklenme başlangıcı' },
      { month: 4, tasks: 'Çiçek ve tohum, bahar fide hazırlığı' },
      { month: 5, tasks: 'Yaz ekimi için fide yetiştirme' },
      { month: 6, tasks: 'Yaz ekimi, sıcağa dayanıklı çeşitler' },
      { month: 7, tasks: 'Fide dikimi (kış hasadı için), toprak hazırlığı' },
      { month: 8, tasks: 'Ana ekim dönemi, fide gelişimi, sulama' },
      { month: 9, tasks: 'Büyüme devam, zararlı kontrolü' },
      { month: 10, tasks: 'Hasat başlangıcı, dış yapraklar' },
      { month: 11, tasks: 'Ana hasat sezonu, sürekli hasat' },
      { month: 12, tasks: 'Kış hasadı, don sonrası daha lezzetli' }
    ]
  },
  {
    name: 'Beyaz Lahana',
    category: 'yaprakli',
    notes: 'Baş yapan, turşu ve salata için, uzun ömürlü',
    maintenance: [
      { month: 1, tasks: 'Kış çeşidi hasat, depolama kontrolü' },
      { month: 2, tasks: 'İlkbahar fide hazırlığı, sera ekimi' },
      { month: 3, tasks: 'Fide dikimi, toprak hazırlığı, gübreleme' },
      { month: 4, tasks: 'Fide büyümesi, sulama, zararlı kontrolü' },
      { month: 5, tasks: 'Baş oluşumu başlangıcı, düzenli sulama' },
      { month: 6, tasks: 'Baş gelişimi, gübreleme, ot kontrolü' },
      { month: 7, tasks: 'Yaz hasadı, sonbahar-kış fide hazırlığı' },
      { month: 8, tasks: 'Kış çeşidi fide dikimi' },
      { month: 9, tasks: 'Fide büyümesi, sulama, zararlı mücadelesi' },
      { month: 10, tasks: 'Baş oluşumu, gübreleme' },
      { month: 11, tasks: 'Hasat başlangıcı, sıkı beyaz baş' },
      { month: 12, tasks: 'Kış hasadı, turşu ve lahana sarması' }
    ]
  },
  {
    name: 'Kırmızı Lahana',
    category: 'yaprakli',
    notes: 'Mor-kırmızı renkli, antioksidan deposu',
    maintenance: [
      { month: 1, tasks: 'Kış hasadı, çok dayanıklı' },
      { month: 2, tasks: 'İlkbahar fide yetiştirme' },
      { month: 3, tasks: 'Fide dikimi, toprak hazırlığı' },
      { month: 4, tasks: 'Büyüme, mor yapraklar gelişir' },
      { month: 5, tasks: 'Baş oluşumu, renk koyulaşır, sulama' },
      { month: 6, tasks: 'Baş gelişimi, zararlı kontrolü' },
      { month: 7, tasks: 'Hasat başlangıcı, salata ve turşu' },
      { month: 8, tasks: 'Kış çeşidi ekimi' },
      { month: 9, tasks: 'Fide gelişimi' },
      { month: 10, tasks: 'Baş oluşumu, soğuk rengi koyulaştırır' },
      { month: 11, tasks: 'Hasat, koyu mor-kırmızı' },
      { month: 12, tasks: 'Kış hasadı, uzun dayanıklı' }
    ]
  },
  {
    name: 'Çin Lahanası',
    category: 'yaprakli',
    notes: 'Pak choi, beyaz saplı, yeşil yapraklı Asya sebzesi',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, sıcak ortam' },
      { month: 2, tasks: 'Sera yetiştiriciliği' },
      { month: 3, tasks: 'İlkbahar açık alan ekimi' },
      { month: 4, tasks: 'Hızlı büyüme (40-50 gün), sulama, hasat yaklaşıyor' },
      { month: 5, tasks: 'Hasat, beyaz sap ve yeşil yaprak, wok yemeği' },
      { month: 6, tasks: 'Sıcakta tohuma kaçar, gölgeleme' },
      { month: 7, tasks: 'Yaz molası (sıcak bölgelerde)' },
      { month: 8, tasks: 'Sonbahar ekimi başlangıcı' },
      { month: 9, tasks: 'Yoğun ekim, ideal büyüme' },
      { month: 10, tasks: 'Hasat, taze kullanım' },
      { month: 11, tasks: 'Hasat devam, hafif dona dayanır' },
      { month: 12, tasks: 'Sera üretimi, kış hasadı' }
    ]
  },

  // KÖK SEBZELER
  {
    name: 'Şalgam',
    category: 'kok',
    notes: 'Beyaz veya mor, turşu ve şalgam suyu için',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, soğuğa dayanıklı' },
      { month: 2, tasks: 'Sera yetiştiriciliği' },
      { month: 3, tasks: 'İlkbahar açık alan ekimi' },
      { month: 4, tasks: 'Hızlı büyüme (60-70 gün), seyreltme, sulama' },
      { month: 5, tasks: 'Kök şişkinliği, hasat yaklaşıyor' },
      { month: 6, tasks: 'Hasat, beyaz veya mor şalgam' },
      { month: 7, tasks: 'Yaz molası (çok sıcak)' },
      { month: 8, tasks: 'Sonbahar ekimi başlangıcı' },
      { month: 9, tasks: 'Ana ekim dönemi, kış için' },
      { month: 10, tasks: 'Kök gelişimi, sulama' },
      { month: 11, tasks: 'Hasat başlangıcı, şalgam suyu yapımı' },
      { month: 12, tasks: 'Kış hasadı, turşu, tarlada kalabilir' }
    ]
  },
  {
    name: 'Patates',
    category: 'kok',
    notes: 'Dünya\'nın en önemli besin kaynağı, yumru sebze',
    maintenance: [
      { month: 1, tasks: 'Tohum patates hazırlığı, filizlendirme' },
      { month: 2, tasks: 'Erken ekim (ılıman bölgelerde), toprak hazırlığı' },
      { month: 3, tasks: 'Ana ekim dönemi, yumru dikimi, sıra arası 60-70 cm' },
      { month: 4, tasks: 'Sürgün çıkışı, toprak çekme (yumruların yeşillememesi için)' },
      { month: 5, tasks: 'Çiçeklenme, yumru oluşumu başlangıcı, sulama, toprak çekme' },
      { month: 6, tasks: 'Yumru büyümesi, düzenli sulama, Colorado böceği kontrolü' },
      { month: 7, tasks: 'Erken çeşit hasat (yeşil gövde), genç patates' },
      { month: 8, tasks: 'Ana hasat, gövdeler sararmış, yumrular olgun' },
      { month: 9, tasks: 'Hasat tamamlama, güneşte kurutma, depolama' },
      { month: 10, tasks: 'Depolama kontrolü (serin-karanlık-kuru)' },
      { month: 11, tasks: 'Kış depolaması' },
      { month: 12, tasks: 'Depolama devam, tohum patates seçimi' }
    ]
  },
  {
    name: 'Tatlı Patates',
    category: 'kok',
    notes: 'Turuncu içli, tatlı, sıcak iklim seven yumru',
    maintenance: [
      { month: 1, tasks: 'Fide hazırlığı, yumrudan sürgün çıkarma' },
      { month: 2, tasks: 'Fide yetiştirme, sıcak ortam' },
      { month: 3, tasks: 'Fide büyütme devam' },
      { month: 4, tasks: 'Toprak hazırlığı, tümsek yapma' },
      { month: 5, tasks: 'Fide dikimi (toprak 15°C+), sulama, geniş aralıklı' },
      { month: 6, tasks: 'Hızlı büyüme, asma yayılımı, sulama' },
      { month: 7, tasks: 'Yoğun yaprak gelişimi, yumru oluşumu' },
      { month: 8, tasks: 'Yumru büyümesi, sulama devam' },
      { month: 9, tasks: 'Yumru olgunlaşması, sulama azaltma' },
      { month: 10, tasks: 'Hasat (ilk don öncesi), nazikçe söküm' },
      { month: 11, tasks: 'Kür işlemi (sıcak-nemli ortamda kabuk sertleşmesi)' },
      { month: 12, tasks: 'Depolama (10-15°C, serin oda)' }
    ]
  },
  {
    name: 'Yer Elması',
    category: 'kok',
    notes: 'Topinambur, şeker hastalarına uygun, yumrulu bitki',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, yumrular toprakta' },
      { month: 2, tasks: 'Yumru bölme ve dikme zamanı' },
      { month: 3, tasks: 'Ekim, toprak hazırlığı, geniş alan' },
      { month: 4, tasks: 'Sürgün çıkışı, hızlı büyüme' },
      { month: 5, tasks: 'Boy atma, 2-3 metre yükseklik' },
      { month: 6, tasks: 'Yoğun yaprak gelişimi, sulama' },
      { month: 7, tasks: 'Çiçeklenme başlangıcı, sarı çiçekler (ayçiçeği benzeri)' },
      { month: 8, tasks: 'Çiçeklenme devam, yumru oluşumu' },
      { month: 9, tasks: 'Yumru gelişimi, gövde hala yeşil' },
      { month: 10, tasks: 'Gövde kuruması, hasat başlangıcı' },
      { month: 11, tasks: 'Ana hasat, yumru söküm, taze tüketim' },
      { month: 12, tasks: 'Hasat devam, toprakta bırakılabilir (bozulmaz)' }
    ]
  },
  {
    name: 'Salsifi',
    category: 'kok',
    notes: 'İstiridye bitkisi, beyaz uzun kök, nadir sebze',
    maintenance: [
      { month: 1, tasks: 'Hasat (kışın toprakta kalabilir)' },
      { month: 2, tasks: 'Son hasat, tohum ekimi hazırlığı' },
      { month: 3, tasks: 'Ekim, derin toprak gerekli' },
      { month: 4, tasks: 'Fide çıkışı, seyreltme' },
      { month: 5, tasks: 'Yaprak gelişimi, kök uzaması başlangıcı' },
      { month: 6, tasks: 'Kök gelişimi, sulama, ot kontrolü' },
      { month: 7, tasks: 'Uzun beyaz kök büyüyor' },
      { month: 8, tasks: 'Kök olgunlaşması devam' },
      { month: 9, tasks: 'Hasat başlangıcı (ilk don sonrası daha tatlı)' },
      { month: 10, tasks: 'Hasat devam, dikkatli söküm' },
      { month: 11, tasks: 'Ana hasat, uzun beyaz kökler' },
      { month: 12, tasks: 'Kış hasadı, toprakta bırakılabilir' }
    ]
  },

  // SOĞANSI BİTKİLER
  {
    name: 'Kuru Soğan',
    category: 'sogansi',
    notes: 'Depolanabilen, temel mutfak malzemesi',
    maintenance: [
      { month: 1, tasks: 'Kışlık soğan tarlada, yavaş büyüme' },
      { month: 2, tasks: 'İlkbahar soğan fide yetiştirme' },
      { month: 3, tasks: 'Set veya fide dikimi, toprak hazırlığı' },
      { month: 4, tasks: 'Yaprak gelişimi, çapalama, ot kontrolü' },
      { month: 5, tasks: 'Soğan başı oluşumu, düzenli sulama' },
      { month: 6, tasks: 'Soğan büyümesi, sulama azaltma (hasat yaklaşırken)' },
      { month: 7, tasks: 'Yapraklar yatmaya başlar, sulama kesme' },
      { month: 8, tasks: 'Hasat, güneşte kurutma (yaprak ve kök temizliği)' },
      { month: 9, tasks: 'Kurutma tamamlama, depolama hazırlığı' },
      { month: 10, tasks: 'Kış soğan ekimi (set dikimi)' },
      { month: 11, tasks: 'Kışlık soğan fide gelişimi' },
      { month: 12, tasks: 'Kış dinlenme, don koruması' }
    ]
  },
  {
    name: 'Yeşil Soğan',
    category: 'sogansi',
    notes: 'Taze tüketilen, hızlı büyüyen, baş oluşturmayan',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi, soğuğa dayanıklı' },
      { month: 2, tasks: 'Sera yetiştiriciliği' },
      { month: 3, tasks: 'İlkbahar açık alan ekimi, sık ekim' },
      { month: 4, tasks: 'Hızlı hasat (30-40 gün), sürekli ekim, taze soğan' },
      { month: 5, tasks: 'Hasat ve ekim döngüsü' },
      { month: 6, tasks: 'Hasat devam, yaz ekimi' },
      { month: 7, tasks: 'Hasat ve ekim devam' },
      { month: 8, tasks: 'Sonbahar ekimi' },
      { month: 9, tasks: 'Hasat ve ekim döngüsü' },
      { month: 10, tasks: 'Hasat devam' },
      { month: 11, tasks: 'Kış ekimi, örtü altı' },
      { month: 12, tasks: 'Sera hasadı' }
    ]
  },
  {
    name: 'Arpacık Soğan',
    category: 'sogansi',
    notes: 'Shallot, küçük baş, ince lezzet, çeşni soğanı',
    maintenance: [
      { month: 1, tasks: 'Kışlık arpacık tarlada' },
      { month: 2, tasks: 'İlkbahar dikimi hazırlığı' },
      { month: 3, tasks: 'Diş dikimi (patates gibi), toprak hazırlığı' },
      { month: 4, tasks: 'Sürgün çıkışı, çapalama' },
      { month: 5, tasks: 'Baş oluşumu, bir dişten 5-10 baş' },
      { month: 6, tasks: 'Baş gelişimi, sulama' },
      { month: 7, tasks: 'Olgunlaşma, yaprak sararmaya başlar' },
      { month: 8, tasks: 'Hasat, salkım halinde küçük soğanlar' },
      { month: 9, tasks: 'Kurutma, depolama (uzun ömürlü)' },
      { month: 10, tasks: 'Kış dikimi (ılıman bölgelerde)' },
      { month: 11, tasks: 'Kışlık arpacık fide gelişimi' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Frenk Soğanı',
    category: 'aromatik',
    notes: 'Chives, ince yapraklı, hafif soğan aromalı ot',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, çok yıllık bitki' },
      { month: 2, tasks: 'Erken sürgün çıkışı, kök bölme zamanı' },
      { month: 3, tasks: 'Hızlı yaprak gelişimi, yeşil ince yapraklar' },
      { month: 4, tasks: 'Çiçeklenme başlangıcı, mor çiçekler (yenilebilir)' },
      { month: 5, tasks: 'Hasat, yaprak kesimi (dip kısmı bırakılır)' },
      { month: 6, tasks: 'Sürekli hasat, yeni yaprak gelişimi' },
      { month: 7, tasks: 'Hasat devam, salata ve omlet' },
      { month: 8, tasks: 'Hasat, çiçek sonrası budama' },
      { month: 9, tasks: 'Sonbahar hasadı' },
      { month: 10, tasks: 'Hasat devam' },
      { month: 11, tasks: 'Yaprak azalır, kış hazırlığı' },
      { month: 12, tasks: 'Kış dinlenme, bahar için bekler' }
    ]
  },

  // MEYVELİ SEBZELER - BİBER ÇEŞİTLERİ
  {
    name: 'Sivri Biber',
    category: 'meyveli',
    notes: 'Uzun ince, hafif acı, yaygın Türk biberi',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme, sıcak ortam (25-28°C)' },
      { month: 2, tasks: 'Fide gelişimi, pikaj' },
      { month: 3, tasks: 'Sera dikimi, açık alan hazırlığı' },
      { month: 4, tasks: 'Açık alan fide dikimi (don riski geçince)' },
      { month: 5, tasks: 'Bitki gelişimi, ilk çiçekler, destek' },
      { month: 6, tasks: 'Çiçeklenme, meyve tutumu, gübreleme' },
      { month: 7, tasks: 'Yeşil biber hasat başlangıcı, uzun ince biber' },
      { month: 8, tasks: 'Yoğun hasat, kırmızıya dönmeden hasat (yeşil)' },
      { month: 9, tasks: 'Hasat devam, kurutmalık için kırmızıya bırakma' },
      { month: 10, tasks: 'Son hasat, kırmızı biber kurutma' },
      { month: 11, tasks: 'Bitki temizliği' },
      { month: 12, tasks: 'Sera kış üretimi (sıcak bölgelerde)' }
    ]
  },
  {
    name: 'Çarliston Biber',
    category: 'meyveli',
    notes: 'Dolmalık biber, iri ve köşeli, tatls',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme, sıcaklık kontrolü' },
      { month: 2, tasks: 'Fide gelişimi, sertleştirme' },
      { month: 3, tasks: 'Sera dikimi' },
      { month: 4, tasks: 'Açık alan fide dikimi, geniş aralıklı' },
      { month: 5, tasks: 'Bitki gelişimi, çiçeklenme, destek kazıkları' },
      { month: 6, tasks: 'İri meyve tutumu, düzenli sulama' },
      { month: 7, tasks: 'Yeşil dolmalık biber hasat, iri ve köşeli' },
      { month: 8, tasks: 'Yoğun hasat, dolma ve fırın biberi' },
      { month: 9, tasks: 'Hasat devam, kırmızı-sarı olgunlaşma' },
      { month: 10, tasks: 'Son hasat, renkli biberler' },
      { month: 11, tasks: 'Bitki temizliği' },
      { month: 12, tasks: 'Sera üretimi' }
    ]
  },
  {
    name: 'Kapya Biber',
    category: 'meyveli',
    notes: 'Hafif acı, kırmızı, salça ve közleme biberi',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme' },
      { month: 2, tasks: 'Fide gelişimi' },
      { month: 3, tasks: 'Sera dikimi' },
      { month: 4, tasks: 'Açık alan fide dikimi' },
      { month: 5, tasks: 'Bitki gelişimi, çiçeklenme' },
      { month: 6, tasks: 'Meyve tutumu, uzun ve hafif kıvrık' },
      { month: 7, tasks: 'Yeşil hasat başlangıcı' },
      { month: 8, tasks: 'Kırmızıya dönüş, ana hasat için bekleme' },
      { month: 9, tasks: 'Kırmızı kapya hasat, salça ve közleme' },
      { month: 10, tasks: 'Son hasat, kurutma' },
      { month: 11, tasks: 'Bitki temizliği' },
      { month: 12, tasks: 'Sera üretimi' }
    ]
  },
  {
    name: 'Acı Biber',
    category: 'meyveli',
    notes: 'Chili, capsaicin içerir, çok çeşitli şekil ve acılık',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme, sıcak gerekli' },
      { month: 2, tasks: 'Fide gelişimi, yavaş büyüme' },
      { month: 3, tasks: 'Sera dikimi veya saksı' },
      { month: 4, tasks: 'Açık alan dikimi (sıcak bölgelerde)' },
      { month: 5, tasks: 'Bitki gelişimi, beyaz çiçekler' },
      { month: 6, tasks: 'Meyve tutumu, küçük biber gelişimi' },
      { month: 7, tasks: 'Yeşil acı biber hasat' },
      { month: 8, tasks: 'Renk değişimi (kırmızı, turuncu, sarı), en acı dönem' },
      { month: 9, tasks: 'Hasat, kurutma, biber salçası' },
      { month: 10, tasks: 'Son hasat, toz biber yapımı' },
      { month: 11, tasks: 'Bitki temizliği, saksıda içeri alınabilir' },
      { month: 12, tasks: 'Sera veya iç mekan üretimi' }
    ]
  },

  // KABAKGİLLER
  {
    name: 'Bal Kabağı',
    category: 'kabakgil',
    notes: 'Turuncu içli, tatlı, çorba ve tatlı için',
    maintenance: [
      { month: 1, tasks: 'Ekim için erken, planlama' },
      { month: 2, tasks: 'Sera fide yetiştirme (erken üretim)' },
      { month: 3, tasks: 'İlk açık alan ekimi (ılıman bölgelerde)' },
      { month: 4, tasks: 'Ana ekim dönemi, geniş alan, zengin toprak' },
      { month: 5, tasks: 'Hızlı büyüme, asma yayılımı, çiçeklenme' },
      { month: 6, tasks: 'Meyve tutumu, genç kabak gelişimi' },
      { month: 7, tasks: 'Meyve büyümesi, sulama, altına tahta' },
      { month: 8, tasks: 'Kabuk sertleşmesi, turuncu renk' },
      { month: 9, tasks: 'Hasat yaklaşıyor, kabuk tırnak testi' },
      { month: 10, tasks: 'Hasat, sap ile birlikte kesim' },
      { month: 11, tasks: 'Kür işlemi (güneşte kabuk sertleştirme)' },
      { month: 12, tasks: 'Uzun süreli depolama (serin-kuru ortam, aylarca dayanır)' }
    ]
  },
  {
    name: 'Spagetti Kabağı',
    category: 'kabakgil',
    notes: 'Pişince iplik gibi ayrılan, sarı kabuklu kabak',
    maintenance: [
      { month: 1, tasks: 'Ekim planlaması' },
      { month: 2, tasks: 'Sera fide yetiştirme' },
      { month: 3, tasks: 'İlk ekim (ılıman bölgelerde)' },
      { month: 4, tasks: 'Ana ekim, geniş alan' },
      { month: 5, tasks: 'Hızlı büyüme, çiçeklenme' },
      { month: 6, tasks: 'Meyve tutumu, uzun oval sarı kabaklar' },
      { month: 7, tasks: 'Meyve büyümesi' },
      { month: 8, tasks: 'Kabuk sertleşmesi, parlak sarı' },
      { month: 9, tasks: 'Hasat, kabuk sert ve sarı' },
      { month: 10, tasks: 'Hasat devam, depolama' },
      { month: 11, tasks: 'Uzun ömürlü depolama' },
      { month: 12, tasks: 'Depolama devam, pişirme (spagetti alternatifi)' }
    ]
  },
  {
    name: 'Kavun',
    category: 'kabakgil',
    notes: 'Tatlı yaz meyvesi, turuncu veya yeşil içli',
    maintenance: [
      { month: 1, tasks: 'Ekim için çok erken' },
      { month: 2, tasks: 'Sera fide yetiştirme (erken üretim)' },
      { month: 3, tasks: 'Sera dikimi, sıcaklık kontrolü' },
      { month: 4, tasks: 'Açık alan fide dikimi (toprak sıcak olunca)' },
      { month: 5, tasks: 'Hızlı büyüme, çiçeklenme, tozlaşma' },
      { month: 6, tasks: 'Meyve tutumu, genç kavun gelişimi, seyreltme' },
      { month: 7, tasks: 'Meyve büyümesi, şekerlenme, sulama' },
      { month: 8, tasks: 'Hasat başlangıcı, koku ve sap kontrolü (olgunluk)' },
      { month: 9, tasks: 'Ana hasat, günlük toplama, taze tüketim' },
      { month: 10, tasks: 'Hasat sonu, geç çeşitler' },
      { month: 11, tasks: 'Bitki temizliği' },
      { month: 12, tasks: 'Sera üretimi (özel koşullarda)' }
    ]
  },
  {
    name: 'Karpuz',
    category: 'kabakgil',
    notes: 'Yaz meyvesi, kırmızı içli, serinletici',
    maintenance: [
      { month: 1, tasks: 'Ekim için çok erken' },
      { month: 2, tasks: 'Sera fide yetiştirme (sıcak seralarda)' },
      { month: 3, tasks: 'Sera dikimi' },
      { month: 4, tasks: 'Açık alan fide dikimi, geniş alan, sıcak toprak' },
      { month: 5, tasks: 'Hızlı asma yayılımı, çiçeklenme, tozlaşma' },
      { month: 6, tasks: 'Meyve tutumu, küçük karpuzlar, seyreltme (3-4 meyve)' },
      { month: 7, tasks: 'Hızlı büyüme, sulama çok önemli' },
      { month: 8, tasks: 'Hasat başlangıcı, ses testi (tok ses), sararan kısım' },
      { month: 9, tasks: 'Ana hasat, günlük toplama, taze tüketim' },
      { month: 10, tasks: 'Son hasat, geç çeşitler' },
      { month: 11, tasks: 'Bitki temizliği' },
      { month: 12, tasks: 'Sera üretimi (tropik bölgelerde)' }
    ]
  },
  {
    name: 'Bamya',
    category: 'meyveli',
    notes: 'Sıcak iklim seven, yeşil kapsüllü sebze',
    maintenance: [
      { month: 1, tasks: 'Ekim için çok erken' },
      { month: 2, tasks: 'Sera fide yetiştirme (sıcak ortam)' },
      { month: 3, tasks: 'Fide büyütme, sertleştirme' },
      { month: 4, tasks: 'Açık alan dikimi (toprak 20°C+), sıcak bekleme' },
      { month: 5, tasks: 'Fide gelişimi, boy atma, sarı çiçekler' },
      { month: 6, tasks: 'Çiçeklenme, ilk bamya oluşumu' },
      { month: 7, tasks: 'Hasat başlangıcı (8-10 cm), günlük toplama (hızla büyür)' },
      { month: 8, tasks: 'Yoğun hasat, her gün kontrol, taze yemeklik' },
      { month: 9, tasks: 'Hasat devam, dondurmak, kurutmak' },
      { month: 10, tasks: 'Son hasat, sıcaklık düşünce yavaşlar' },
      { month: 11, tasks: 'Bitki temizliği' },
      { month: 12, tasks: 'Sera üretimi (sıcak bölgelerde)' }
    ]
  },

  // BAKLAGİLLER
  {
    name: 'Börülce',
    category: 'baklagil',
    notes: 'Sıcak iklim fasulyesi, kuraklığa dayanıklı',
    maintenance: [
      { month: 1, tasks: 'Ekim için çok erken' },
      { month: 2, tasks: 'Sera ekimi (sıcak bölgelerde)' },
      { month: 3, tasks: 'İlk açık alan ekimi (ılıman bölgelerde)' },
      { month: 4, tasks: 'Ana ekim dönemi, sıcak toprak' },
      { month: 5, tasks: 'Fide çıkışı, tırmanma, destek (sırık tür)' },
      { month: 6, tasks: 'Çiçeklenme, mor-beyaz çiçekler, bakla tutumu' },
      { month: 7, tasks: 'Hasat başlangıcı (taze börülce), yeşil bakla' },
      { month: 8, tasks: 'Yoğun hasat, günlük toplama, yemeklik' },
      { month: 9, tasks: 'Hasat devam, kuru börülce için olgunlaştırma' },
      { month: 10, tasks: 'Kuru hasat, harman, depolama' },
      { month: 11, tasks: 'Depolama kontrolü' },
      { month: 12, tasks: 'Uzun süreli depolama' }
    ]
  },
  {
    name: 'Barbunya',
    category: 'baklagil',
    notes: 'Kırmızı benekli fasulye, taze ve kuru kullanım',
    maintenance: [
      { month: 1, tasks: 'Ekim için erken' },
      { month: 2, tasks: 'Sera ekimi (erken üretim)' },
      { month: 3, tasks: 'İlk açık alan ekimi' },
      { month: 4, tasks: 'Ana ekim, bodur veya sırık çeşit' },
      { month: 5, tasks: 'Fide çıkışı, tırmanma (sırık), beyaz çiçekler' },
      { month: 6, tasks: 'Çiçeklenme, bakla tutumu' },
      { month: 7, tasks: 'Hasat başlangıcı (taze barbunya), yeşil bakla' },
      { month: 8, tasks: 'Ana hasat (taze), kırmızı benekli' },
      { month: 9, tasks: 'Kuru barbunya için olgunlaştırma' },
      { month: 10, tasks: 'Kuru hasat, harman, depolama' },
      { month: 11, tasks: 'Depolama' },
      { month: 12, tasks: 'Kış yemeği hazırlığı' }
    ]
  },
  {
    name: 'Bakla',
    category: 'baklagil',
    notes: 'Soğuk mevsim baklagili, iri yeşil tohum',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi veya kışlık bakla tarlada' },
      { month: 2, tasks: 'İlkbahar ekimi başlangıcı (soğuğa dayanıklı)' },
      { month: 3, tasks: 'Ana ekim dönemi, sık ekim' },
      { month: 4, tasks: 'Hızlı büyüme, destek gerekebilir, beyaz-siyah çiçekler' },
      { month: 5, tasks: 'Çiçeklenme, bakla tutumu, yaprak ucu budama' },
      { month: 6, tasks: 'Hasat başlangıcı (taze bakla), yeşil iri bakla' },
      { month: 7, tasks: 'Ana hasat, günlük toplama, taze yemeklik' },
      { month: 8, tasks: 'Kuru bakla için olgunlaştırma' },
      { month: 9, tasks: 'Kuru hasat (bazı bölgelerde)' },
      { month: 10, tasks: 'Kış bakla ekimi (ılıman bölgelerde)' },
      { month: 11, tasks: 'Kışlık bakla yavaş büyüme' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },

  // DİĞER SEBZELER
  {
    name: 'Kuşkonmaz',
    category: 'ozel',
    notes: 'Çok yıllık, lüks sebze, ilkbahar hasadı',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, kök halinde toprakta' },
      { month: 2, tasks: 'Sürgün çıkışı başlangıcı (2-3 yaşından sonra hasat)' },
      { month: 3, tasks: 'Hasat başlangıcı, yeşil-mor sürgünler (25 cm)' },
      { month: 4, tasks: 'Ana hasat sezonu, günlük toplama, çabuk büyür' },
      { month: 5, tasks: 'Hasat sonu, sürgünleri büyümeye bırakma (kuvvet toplasın)' },
      { month: 6, tasks: 'Yeşil yapraklı dal gelişimi, gübreleme' },
      { month: 7, tasks: 'Yoğun yeşil büyüme, fotosentez' },
      { month: 8, tasks: 'Sarı çiçekler (dişi bitkilerde kırmızı meyveler)' },
      { month: 9, tasks: 'Sonbahar, yapraklar sararır' },
      { month: 10, tasks: 'Yaprak dökümü, toprak örtüsü' },
      { month: 11, tasks: 'Kış hazırlığı, gübreleme' },
      { month: 12, tasks: 'Kış dinlenme, kar altında' }
    ]
  },
  {
    name: 'Ravent',
    category: 'ozel',
    notes: 'Rhubarb, ekşi sapı yenilebilen, çok yıllık',
    maintenance: [
      { month: 1, tasks: 'Kış dinlenme, toprakta kök' },
      { month: 2, tasks: 'Kök bölme ve dikme zamanı' },
      { month: 3, tasks: 'Sürgün çıkışı, kırmızı-yeşil saplar' },
      { month: 4, tasks: 'Hasat başlangıcı (2-3 yaşından sonra), sap koparma' },
      { month: 5, tasks: 'Ana hasat, ekşi kırmızı saplar, reçel ve turta' },
      { month: 6, tasks: 'Hasat sonu (yapraklar zehirli, sadece sap!), çiçek sapı kesme' },
      { month: 7, tasks: 'Büyümeye bırakma, gübreleme' },
      { month: 8, tasks: 'Yaz bakımı, sulama' },
      { month: 9, tasks: 'Sonbahar bakımı' },
      { month: 10, tasks: 'Yaprak dökümü' },
      { month: 11, tasks: 'Kış hazırlığı, toprak örtüsü' },
      { month: 12, tasks: 'Kış dinlenme' }
    ]
  },
  {
    name: 'Rezene',
    category: 'aromatik',
    notes: 'Fennel, anasonlu koku, yumru ve yaprak yenilebilir',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi (yumru rezene için)' },
      { month: 2, tasks: 'Fide gelişimi' },
      { month: 3, tasks: 'Açık alan ekimi, toprak hazırlığı' },
      { month: 4, tasks: 'Fide çıkışı, seyreltme, sulama' },
      { month: 5, tasks: 'Yumru oluşumu (yumru rezene), yaprak gelişimi' },
      { month: 6, tasks: 'Hasat başlangıcı (yumru), taze kullanım' },
      { month: 7, tasks: 'Hasat devam, çiçeklenme kontrolü (yumru için)' },
      { month: 8, tasks: 'Tohum rezene çiçeklenme, sarı çiçekler' },
      { month: 9, tasks: 'Tohum toplama, turşu baharatı' },
      { month: 10, tasks: 'Sonbahar ekimi (bazı bölgelerde)' },
      { month: 11, tasks: 'Kış bakımı' },
      { month: 12, tasks: 'Sera üretimi' }
    ]
  },
  {
    name: 'Alabaş',
    category: 'kok',
    notes: 'Kohlrabi, şişkin gövdeli lahana, hafif lezzetli',
    maintenance: [
      { month: 1, tasks: 'Sera ekimi' },
      { month: 2, tasks: 'Sera yetiştiriciliği' },
      { month: 3, tasks: 'İlkbahar açık alan ekimi' },
      { month: 4, tasks: 'Hızlı büyüme, gövde şişkinliği başlangıcı' },
      { month: 5, tasks: 'Hasat (8-10 cm çap), hızlı hasat önemli (odunlaşmadan)' },
      { month: 6, tasks: 'Hasat devam, sürekli ekim' },
      { month: 7, tasks: 'Yaz ekimi (serin bölgelerde)' },
      { month: 8, tasks: 'Sonbahar ekimi' },
      { month: 9, tasks: 'Sonbahar yetiştiriciliği, ideal mevsim' },
      { month: 10, tasks: 'Hasat, taze salata ve pişirme' },
      { month: 11, tasks: 'Kış ekimi (ılıman bölgelerde)' },
      { month: 12, tasks: 'Sera hasadı' }
    ]
  },
  {
    name: 'Brüksel Lahanası',
    category: 'yaprakli',
    notes: 'Gövdede küçük lahana başları oluşturan özel lahana',
    maintenance: [
      { month: 1, tasks: 'Sera fide yetiştirme' },
      { month: 2, tasks: 'Fide gelişimi' },
      { month: 3, tasks: 'Açık alan fide dikimi' },
      { month: 4, tasks: 'Bitki gelişimi, boy atma' },
      { month: 5, tasks: 'Gövde uzaması, ilk tomurcuklar' },
      { month: 6, tasks: 'Mini lahana başları oluşumu başlangıcı' },
      { month: 7, tasks: 'Başlar büyüyor, alt yaprak temizliği' },
      { month: 8, tasks: 'Gelişim devam' },
      { month: 9, tasks: 'Hasat başlangıcı (alttan yukarı), don sonrası daha tatlı' },
      { month: 10, tasks: 'Ana hasat, küçük lahana başları' },
      { month: 11, tasks: 'Hasat devam, soğuğa çok dayanıklı' },
      { month: 12, tasks: 'Kış hasadı, kar altında bile' }
    ]
  }
];

async function addMissingVegetables() {
  try {
    console.log('🌐 MongoDB\'ye bağlanılıyor...\n');
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/garden-db';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Bağlantı başarılı\n');

    // Sebzeleri ekle
    console.log('🥬 EKSİK SEBZELER EKLENİYOR...\n');
    let success = 0;
    let skip = 0;
    let fail = 0;

    for (const veg of missingVegetables) {
      try {
        // Aynı isimde sebze var mı kontrol et
        const existing = await Vegetable.findOne({ name: veg.name });
        if (existing) {
          console.log(`   ⚠️  ${veg.name} zaten mevcut, atlanıyor`);
          skip++;
          continue;
        }

        await Vegetable.create(veg);
        success++;
        console.log(`   ✅ ${veg.name} (${veg.category}) eklendi`);
      } catch (err) {
        console.log(`   ❌ ${veg.name} eklenemedi: ${err.message}`);
        fail++;
      }
    }

    console.log(`\n📊 ÖZET:`);
    console.log(`   ✅ Başarılı: ${success} sebze eklendi`);
    console.log(`   ⚠️  Atlanan: ${skip} (zaten mevcut)`);
    console.log(`   ❌ Başarısız: ${fail}`);

    // Toplam sebze sayısı
    const totalVegetables = await Vegetable.countDocuments();
    console.log(`\n🥬 Toplam sebze sayısı: ${totalVegetables}\n`);

    // Kategorilere göre dağılım
    const categories = await Vegetable.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('📂 KATEGORİ DAĞILIMI:');
    categories.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count} çeşit`);
    });

    console.log('\n✅ Eksik sebzeler başarıyla eklendi!\n');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 MongoDB bağlantısı kapatıldı\n');
  }
}

// Script'i çalıştır
addMissingVegetables();
