// generateKeywordsFromDb.js
'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

// Mongo URI
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/garden-db';

// Sadece name alanı için basit şema yeterli (tam şemayı da kullanabilirsin)
const maintenanceSchema = new mongoose.Schema({
  month: Number,
  tasks: String,
  completed: Boolean
});

const treeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: String,
    category: String,
    maintenance: [maintenanceSchema]
  },
  { timestamps: true }
);

const vegetableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: String,
    category: String,
    maintenance: [maintenanceSchema]
  },
  { timestamps: true }
);

const Tree = mongoose.model('Tree', treeSchema);
const Vegetable = mongoose.model('Vegetable', vegetableSchema);

// İsimden basit bir değer üret (şimdilik sadece parantez öncesini alıp küçük harfe çeviriyoruz)
function makeValueFromName(name) {
  if (!name) return '';

  // "Bal Kabağı (Kışlık)" -> "Bal Kabağı"
  const base = name.split('(')[0].trim();

  // Şimdilik İngilizce değil, sadece normalize Türkçe.
  // Sonradan buradaki stringleri el ile "pumpkin,vegetable,orange" gibi düzenleyebilirsin.
  return base.toLowerCase();
}

async function main() {
  try {
    console.log("🌐 MongoDB'ye bağlanılıyor...\n");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Bağlantı başarılı\n");

    const treeNames = await Tree.distinct('name');
    const vegNames = await Vegetable.distinct('name');

    console.log(`🌳 Ağaç isim sayısı: ${treeNames.length}`);
    console.log(`🥬 Sebze isim sayısı: ${vegNames.length}\n`);

    const allNamesSet = new Set([...(treeNames || []), ...(vegNames || [])]);
    const allNames = Array.from(allNamesSet)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));

    console.log('const keywords = {');
    for (const name of allNames) {
      const value = makeValueFromName(name);
      console.log(`  '${name}': '${value}',`);
    }
    console.log('};');

    console.log('\n💡 Yukarıdaki çıktıyı kopyalayıp, ana script\'teki getSearchKeyword fonksiyonundaki "const keywords = { ... }" yerine yapıştırabilirsin.\n');
  } catch (err) {
    console.error('❌ Hata:', err);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('👋 MongoDB bağlantısı kapatıldı');
    }
  }
}

main();
