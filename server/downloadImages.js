const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
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

// Görsel indirme fonksiyonu
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 30000
    }, (response) => {
      // Yönlendirme kontrolü
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
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
    });

    request.on('error', (err) => {
      reject(err);
    });

    request.on('timeout', () => {
      request.abort();
      reject(new Error('Request timeout'));
    });
  });
}

// Türkçe karakterleri temizle ve URL-safe yap
function sanitizeFilename(name) {
  const charMap = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  return name
    .split('')
    .map(char => charMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Bitki adını İngilizce anahtar kelimelere çevir
function getSearchKeyword(name, category) {
  const keywords = {
    // Ağaçlar
    'Elma': 'apple,tree,fruit',
    'Armut': 'pear,tree,fruit',
    'Kiraz': 'cherry,tree,fruit',
    'Şeftali': 'peach,tree,fruit',
    'Kayısı': 'apricot,tree,fruit',
    'Erik': 'plum,tree,fruit',
    'Vişne': 'sour-cherry,tree,fruit',
    'İncir': 'fig,tree,fruit',
    'Portakal': 'orange,tree,citrus',
    'Mandalina': 'tangerine,tree,citrus',
    'Limon': 'lemon,tree,citrus',
    'Ceviz': 'walnut,tree,nut',
    'Fındık': 'hazelnut,tree,nut',
    'Badem': 'almond,tree,nut',
    'Antep Fıstığı': 'pistachio,tree,nut',
    'Akçaağaç': 'maple,tree,autumn',
    'Meşe': 'oak,tree,forest',
    'Ihlamur': 'linden,tree,flower',
    'Japon Gülü (Sakura)': 'sakura,cherry-blossom,spring',
    'Çam': 'pine,tree,forest',
    'Sedir': 'cedar,tree,forest',
    'Ladin': 'spruce,tree,forest',
    'Servi': 'cypress,tree',
    'Zeytin': 'olive,tree,mediterranean',
    'Nar': 'pomegranate,tree,fruit',
    'Üzüm Asması': 'grape,vine,vineyard',

    // Sebzeler
    'Marul': 'lettuce,vegetable,green',
    'Ispanak': 'spinach,vegetable,green',
    'Roka': 'arugula,rocket,salad',
    'Lahana': 'cabbage,vegetable',
    'Pazı': 'chard,vegetable,green',
    'Havuç': 'carrot,vegetable,root',
    'Turp': 'radish,vegetable,root',
    'Pancar': 'beetroot,vegetable,root',
    'Kereviz (Kök)': 'celeriac,vegetable,root',
    'Domates': 'tomato,vegetable,red',
    'Biber': 'pepper,vegetable,colorful',
    'Patlıcan': 'eggplant,aubergine,vegetable',
    'Kabak': 'zucchini,vegetable,green',
    'Salatalık': 'cucumber,vegetable,green',
    'Fasulye': 'bean,vegetable,green',
    'Bezelye': 'pea,vegetable,green',
    'Nohut': 'chickpea,vegetable,legume',
    'Mercimek': 'lentil,vegetable,legume',
    'Soğan': 'onion,vegetable,bulb',
    'Sarımsak': 'garlic,vegetable,bulb',
    'Pırasa': 'leek,vegetable,green',
    'Brokoli': 'broccoli,vegetable,green',
    'Karnabahar': 'cauliflower,vegetable,white',
    'Kabak (Balkabağı)': 'pumpkin,vegetable,orange',
    'Enginar': 'artichoke,vegetable',
    'Kereviz (Sap)': 'celery,vegetable,green'
  };

  return keywords[name] || name.toLowerCase();
}

async function downloadAllImages() {
  try {
    console.log('🌐 MongoDB\'ye bağlanılıyor...\n');
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/garden-db';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Bağlantı başarılı\n');

    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Ağaçları işle (sadece görseli olmayan veya default görseli olanlar)
    console.log('🌳 AĞAÇ GÖRSELLERİ İNDİRİLİYOR...\n');
    const trees = await Tree.find({
      $or: [
        { imageUrl: '/uploads/noimage.jpg' },
        { imageUrl: { $exists: false } }
      ]
    });

    console.log(`   📋 ${trees.length} ağaç için görsel indirilecek\n`);
    let treeSuccess = 0;
    let treeFail = 0;

    for (const tree of trees) {
      const keyword = getSearchKeyword(tree.name, tree.category);
      const filename = sanitizeFilename(tree.name) + '.jpg';
      const filepath = path.join(uploadsDir, filename);

      // Eğer dosya zaten varsa atla
      if (fs.existsSync(filepath)) {
        tree.imageUrl = `/uploads/${filename}`;
        await tree.save();
        console.log(`   ⏭️  ${tree.name} görseli zaten mevcut`);
        treeSuccess++;
        continue;
      }

      // Lorem Picsum kullan (her bitki için benzersiz placeholder)
      const seedNum = tree.name.charCodeAt(0) * 100 + tree.category.charCodeAt(0);
      const imageUrl = `https://picsum.photos/seed/${seedNum}/800/600`;

      try {
        console.log(`   📥 ${tree.name} indiriliyor...`);
        await downloadImage(imageUrl, filepath);

        // Veritabanını güncelle
        tree.imageUrl = `/uploads/${filename}`;
        await tree.save();

        console.log(`   ✅ ${tree.name} kaydedildi: ${filename}`);
        treeSuccess++;

        // Rate limiting için bekleme
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.log(`   ❌ ${tree.name} indirilemedi: ${err.message}`);
        treeFail++;
      }
    }

    console.log(`\n🌳 Ağaç Görselleri Özet: ${treeSuccess} başarılı, ${treeFail} başarısız\n`);

    // Sebzeleri işle (sadece görseli olmayan veya default görseli olanlar)
    console.log('🥬 SEBZE GÖRSELLERİ İNDİRİLİYOR...\n');
    const vegetables = await Vegetable.find({
      $or: [
        { imageUrl: '/uploads/noimage.png' },
        { imageUrl: { $exists: false } }
      ]
    });

    console.log(`   📋 ${vegetables.length} sebze için görsel indirilecek\n`);
    let vegSuccess = 0;
    let vegFail = 0;

    for (const veg of vegetables) {
      const keyword = getSearchKeyword(veg.name, veg.category);
      const filename = 'veg-' + sanitizeFilename(veg.name) + '.jpg';
      const filepath = path.join(uploadsDir, filename);

      // Eğer dosya zaten varsa atla
      if (fs.existsSync(filepath)) {
        veg.imageUrl = `/uploads/${filename}`;
        await veg.save();
        console.log(`   ⏭️  ${veg.name} görseli zaten mevcut`);
        vegSuccess++;
        continue;
      }

      // Lorem Picsum kullan (her sebze için benzersiz placeholder)
      const seedNum = veg.name.charCodeAt(0) * 100 + veg.category.charCodeAt(0) + 5000;
      const imageUrl = `https://picsum.photos/seed/${seedNum}/800/600`;

      try {
        console.log(`   📥 ${veg.name} indiriliyor...`);
        await downloadImage(imageUrl, filepath);

        // Veritabanını güncelle
        veg.imageUrl = `/uploads/${filename}`;
        await veg.save();

        console.log(`   ✅ ${veg.name} kaydedildi: ${filename}`);
        vegSuccess++;

        // Rate limiting için bekleme
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.log(`   ❌ ${veg.name} indirilemedi: ${err.message}`);
        vegFail++;
      }
    }

    console.log(`\n🥬 Sebze Görselleri Özet: ${vegSuccess} başarılı, ${vegFail} başarısız\n`);

    // Genel özet
    console.log('📊 GENEL ÖZET:');
    console.log(`   ✅ Toplam başarılı: ${treeSuccess + vegSuccess}`);
    console.log(`   ❌ Toplam başarısız: ${treeFail + vegFail}`);
    console.log(`   📁 Görseller: server/uploads/\n`);

    console.log('✅ Görsel indirme işlemi tamamlandı!\n');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 MongoDB bağlantısı kapatıldı\n');
  }
}

// Script'i çalıştır
downloadAllImages();
