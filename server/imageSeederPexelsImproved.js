// imageSeederPexelsImproved.js
// Daha alakalı resimler için geliştirilmiş versiyon
'use strict';

const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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

const MAX_TREE_NAMES_PER_RUN = 0;
const MAX_VEG_NAMES_PER_RUN = 0;
const DELAY_BETWEEN_REQUESTS_MS = 5000;
const MAX_RATE_LIMIT_RETRIES = 5;
const RATE_LIMIT_WAIT_MS = 10_000;

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

function sanitizeFilename(name) {
    const charMap = {
        ç: 'c', Ç: 'C', ğ: 'g', Ğ: 'G', ı: 'i', İ: 'I',
        ö: 'o', Ö: 'O', ş: 's', Ş: 'S', ü: 'u', Ü: 'U'
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
//  İyileştirilmiş Arama Terimleri
// =========================

const IMPROVED_SEARCH_TERMS = {
    // Ağaçlar - Meyve
    'Ahududu': 'raspberry bush fruit close up',
    'Alıç': 'hawthorn tree berries',
    'Armut': 'pear tree orchard fruit',
    'Avokado': 'avocado tree tropical',
    'Ayva': 'quince tree fruit yellow',
    'Bektaşi Üzümü': 'gooseberry bush fruit',
    'Bergamot': 'bergamot citrus tree',
    'Beyaz Dut': 'white mulberry tree fruit',
    'Böğürtlen': 'blackberry bush fruit',
    'Elma': 'apple tree orchard red fruit',
    'Erik': 'plum tree fruit purple',
    'Gavur Narı': 'pomegranate tree fruit',
    'Greyfurt': 'grapefruit tree citrus',
    'Guava': 'guava tree tropical fruit',
    'İncir': 'fig tree mediterranean fruit',
    'Kan Portakalı': 'blood orange tree citrus',
    'Kara Dut': 'black mulberry tree fruit',
    'Karambola': 'starfruit tree tropical',
    'Karayemiş': 'cherry laurel tree berries',
    'Kayısı': 'apricot tree fruit orange',
    'Kiraz': 'cherry tree fruit red',
    'Kızılcık': 'cornelian cherry tree fruit',
    'Kumkuat': 'kumquat tree citrus small',
    'Liçi': 'lychee tree tropical fruit',
    'Limon': 'lemon tree citrus yellow',
    'Mandalina': 'tangerine tree citrus orange',
    'Mango': 'mango tree tropical fruit',
    'Muşmula': 'medlar tree fruit autumn',
    'Muz': 'banana tree tropical plantation',
    'Napolyon Kirazı': 'napoleon cherry tree fruit',
    'Nar': 'pomegranate tree fruit red',
    'Nektarin': 'nectarine tree fruit',
    'Papaya': 'papaya tree tropical fruit',
    'Pitaya': 'dragon fruit cactus plant',
    'Portakal': 'orange tree citrus orchard',
    'Rambutan': 'rambutan tree tropical fruit',
    'Şeftali': 'peach tree fruit orchard',
    'Trabzon Hurması': 'persimmon tree fruit orange',
    'Turunç': 'bitter orange tree citrus',
    'Üzüm Asması': 'grape vine vineyard fruit',
    'Vişne': 'sour cherry tree fruit',
    'Yaban Mersini': 'blueberry bush fruit',
    'Yabani Elma': 'wild apple tree forest',
    'Yenidünya': 'loquat tree fruit yellow',
    'Zeytin': 'olive tree mediterranean grove',

    // Ağaçlar - Kuruyemiş
    'Antep Fıstığı': 'pistachio tree nuts shell',
    'Badem': 'almond tree nuts blossom',
    'Ceviz': 'walnut tree nuts shell',
    'Fındık': 'hazelnut tree nuts',
    'Keçiboynuzu': 'carob tree pods',
    'Kestane': 'chestnut tree nuts autumn',
    'Pekan Cevizi': 'pecan tree nuts',

    // Ağaçlar - Süs
    'Akçaağaç': 'maple tree autumn leaves',
    'Altıntop': 'ornamental tree garden',
    'Çam': 'pine tree forest nature',
    'Ihlamur': 'linden tree flowers',
    'Japon Gülü (Sakura)': 'cherry blossom sakura tree pink',
    'Ladin': 'spruce tree forest',
    'Meşe': 'oak tree forest acorn',
    'Sakız Ağacı': 'mastic tree mediterranean',
    'Sedir': 'cedar tree forest',
    'Servi': 'cypress tree tall',
    'Sumak': 'sumac tree red berries',

    // Sebzeler - Yapraklı
    'Beyaz Lahana': 'white cabbage head fresh',
    'Brüksel Lahanası': 'brussels sprouts plant',
    'Çin Lahanası': 'chinese cabbage napa',
    'Göbek Marul': 'iceberg lettuce head',
    'Ispanak': 'spinach leaves fresh green',
    'Kara Lahana': 'collard greens leaves',
    'Kırmızı Lahana': 'red cabbage purple head',
    'Kıvırcık Marul': 'leaf lettuce curly green',
    'Kuzukulağı': 'sorrel leaves green',
    'Marul': 'lettuce fresh green leaves',
    'Pazı': 'chard swiss leaves colorful',
    'Roka': 'arugula rocket leaves',
    'Semizotu': 'purslane succulent green',
    'Tere': 'watercress garden cress',

    // Sebzeler - Kök
    'Alabaş': 'kohlrabi vegetable purple',
    'Havuç': 'carrot orange root fresh',
    'Kereviz': 'celery root celeriac',
    'Pancar': 'beetroot red root vegetable',
    'Patates': 'potato tuber brown',
    'Salsifi': 'salsify root vegetable',
    'Şalgam': 'turnip root purple white',
    'Tatlı Patates': 'sweet potato orange root',
    'Turp': 'radish red root fresh',
    'Yer Elması': 'jerusalem artichoke tuber',

    // Sebzeler - Meyveli
    'Acı Biber': 'hot chili pepper red spicy',
    'Bamya': 'okra green pod vegetable',
    'Biber': 'bell pepper colorful fresh',
    'Çarliston Biber': 'long sweet pepper green',
    'Domates': 'tomato red fresh ripe',
    'Kapya Biber': 'red pepper sweet fresh',
    'Patlıcan': 'eggplant purple vegetable',
    'Sivri Biber': 'green chili pepper long',

    // Sebzeler - Kabakgil
    'Bal Kabağı': 'pumpkin orange round',
    'Kabak': 'zucchini green fresh',
    'Karpuz': 'watermelon red slice',
    'Kavun': 'melon yellow sweet',
    'Salatalık': 'cucumber green fresh',
    'Spagetti Kabağı': 'spaghetti squash yellow',

    // Sebzeler - Baklagil
    'Bakla': 'broad bean fava green',
    'Barbunya': 'cranberry bean speckled',
    'Bezelye': 'pea green pod fresh',
    'Börülce': 'black eyed pea bean',
    'Fasulye': 'green bean fresh pod',
    'Mercimek': 'lentil dried seeds',
    'Nohut': 'chickpea garbanzo bean',

    // Sebzeler - Soğansı
    'Arpacık Soğan': 'shallot bulb purple',
    'Frenk Soğanı': 'chives green herb',
    'Kuru Soğan': 'onion bulb brown',
    'Pırasa': 'leek green white vegetable',
    'Sarımsak': 'garlic bulb cloves white',
    'Soğan': 'onion fresh bulb',
    'Yeşil Soğan': 'spring onion scallion green',

    // Sebzeler - Aromatik
    'Dereotu': 'dill herb fresh green',
    'Maydanoz': 'parsley herb fresh green',
    'Nane': 'mint herb fresh leaves',
    'Rezene': 'fennel bulb vegetable',

    // Sebzeler - Özel
    'Brokoli': 'broccoli green florets fresh',
    'Enginar': 'artichoke green vegetable',
    'Karnabahar': 'cauliflower white head',
    'Kuşkonmaz': 'asparagus green spears',
    'Ravent': 'rhubarb red stalks'
};

function getImprovedSearchTerm(name) {
    return IMPROVED_SEARCH_TERMS[name] || name.toLowerCase();
}

async function ensureUploadsDir() {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
}

// =========================
//  HTTP Download
// =========================

function downloadImage(url, filepath, redirectCount = 0, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
        if (redirectCount > maxRedirects) {
            return reject(new Error(`Too many redirects for URL: ${url}`));
        }

        const protocol = url.startsWith('https') ? https : http;

        const request = protocol.get(
            url,
            { headers: { 'User-Agent': 'Mozilla/5.0' } },
            (response) => {
                if (response.statusCode === 301 || response.statusCode === 302) {
                    const location = response.headers.location;
                    if (!location) {
                        return reject(new Error(`Redirect with no location header`));
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
                    fs.unlink(filepath, () => { });
                    reject(err);
                });
            }
        );

        request.setTimeout(30000, () => {
            request.destroy(new Error('Request timeout'));
        });

        request.on('error', (err) => {
            reject(err);
        });
    });
}

// =========================
//  Pexels API
// =========================

async function getImageUrlFromPexels(query) {
    if (!PEXELS_API_KEY) {
        throw new Error('PEXELS_API_KEY tanımlı değil');
    }

    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
    )}&per_page=1&orientation=landscape`;

    const res = await fetch(url, {
        headers: { Authorization: PEXELS_API_KEY }
    });

    if (res.status === 429) {
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
//  Process Trees
// =========================

async function processTreeNames() {
    console.log('🌳 AĞAÇ İSİMLERİ İÇİN GÖRSELLER İNDİRİLİYOR (İyileştirilmiş)...\n');

    let names = await Tree.distinct('name');
    console.log(`   📋 DB'de ${names.length} farklı ağaç ismi var.`);

    if (MAX_TREE_NAMES_PER_RUN > 0) {
        names = names.slice(0, MAX_TREE_NAMES_PER_RUN);
    }

    console.log(`   🎯 İşlenecek: ${names.length}\n`);

    let success = 0;
    let fail = 0;
    let totalUpdated = 0;

    for (const name of names) {
        const filenameBase = sanitizeFilename(name) || 'tree';
        const filepath = path.join(UPLOADS_DIR, `${filenameBase}.jpg`);
        const relativePath = `/uploads/${filenameBase}.jpg`;

        const searchTerm = getImprovedSearchTerm(name);

        try {
            if (fs.existsSync(filepath)) {
                console.log(`   ⏭️  "${name}" için dosya var, DB güncellenecek.`);
            } else {
                console.log(`   🔎 "${name}" aranıyor: "${searchTerm}"`);
                const imageUrl = await getImageUrlFromPexels(searchTerm);

                console.log(`   📥 "${name}" indiriliyor...`);
                await downloadImage(imageUrl, filepath);

                await sleep(DELAY_BETWEEN_REQUESTS_MS);
            }

            const result = await Tree.updateMany(
                { name },
                { $set: { imageUrl: relativePath } }
            );

            console.log(`   ✅ "${name}" → ${result.modifiedCount} kayıt güncellendi`);

            success++;
            totalUpdated += result.modifiedCount;
        } catch (err) {
            if (err.message === 'PEXELS_RATE_LIMIT') {
                console.log('🚫 Rate limit, işlem durduruluyor.');
                throw err;
            }

            console.log(`   ❌ "${name}" başarısız: ${err.message}`);
            fail++;
        }
    }

    console.log(`\n🌳 Özet: ${success} başarılı, ${fail} başarısız, ${totalUpdated} güncelleme\n`);
    return { successNames: success, failNames: fail, totalUpdated };
}

// =========================
//  Process Vegetables
// =========================

async function processVegNames() {
    console.log('🥬 SEBZE İSİMLERİ İÇİN GÖRSELLER İNDİRİLİYOR (İyileştirilmiş)...\n');

    let names = await Vegetable.distinct('name');
    console.log(`   📋 DB'de ${names.length} farklı sebze ismi var.`);

    if (MAX_VEG_NAMES_PER_RUN > 0) {
        names = names.slice(0, MAX_VEG_NAMES_PER_RUN);
    }

    console.log(`   🎯 İşlenecek: ${names.length}\n`);

    let success = 0;
    let fail = 0;
    let totalUpdated = 0;

    for (const name of names) {
        const filenameBase = 'veg-' + (sanitizeFilename(name) || 'veg');
        const filepath = path.join(UPLOADS_DIR, `${filenameBase}.jpg`);
        const relativePath = `/uploads/${filenameBase}.jpg`;

        const searchTerm = getImprovedSearchTerm(name);

        try {
            if (fs.existsSync(filepath)) {
                console.log(`   ⏭️  "${name}" için dosya var, DB güncellenecek.`);
            } else {
                console.log(`   🔎 "${name}" aranıyor: "${searchTerm}"`);
                const imageUrl = await getImageUrlFromPexels(searchTerm);

                console.log(`   📥 "${name}" indiriliyor...`);
                await downloadImage(imageUrl, filepath);

                await sleep(DELAY_BETWEEN_REQUESTS_MS);
            }

            const result = await Vegetable.updateMany(
                { name },
                { $set: { imageUrl: relativePath } }
            );

            console.log(`   ✅ "${name}" → ${result.modifiedCount} kayıt güncellendi`);

            success++;
            totalUpdated += result.modifiedCount;
        } catch (err) {
            if (err.message === 'PEXELS_RATE_LIMIT') {
                console.log('🚫 Rate limit, işlem durduruluyor.');
                throw err;
            }

            console.log(`   ❌ "${name}" başarısız: ${err.message}`);
            fail++;
        }
    }

    console.log(`\n🥬 Özet: ${success} başarılı, ${fail} başarısız, ${totalUpdated} güncelleme\n`);
    return { successNames: success, failNames: fail, totalUpdated };
}

// =========================
//  Rate Limit Wrapper
// =========================

async function runWithRateLimitRetry(taskFn, label) {
    let attempt = 0;
    while (true) {
        try {
            return await taskFn();
        } catch (err) {
            if (err.message === 'PEXELS_RATE_LIMIT' && attempt < MAX_RATE_LIMIT_RETRIES) {
                attempt++;
                console.log(`⏳ Rate limit (${label}). ${RATE_LIMIT_WAIT_MS / 1000}s bekleniyor... (${attempt}/${MAX_RATE_LIMIT_RETRIES})`);
                await sleep(RATE_LIMIT_WAIT_MS);
                continue;
            }
            throw err;
        }
    }
}

// =========================
//  Main
// =========================

async function downloadAllImages() {
    try {
        console.log("🌐 MongoDB'ye bağlanılıyor...\n");
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Bağlantı başarılı\n');

        if (!PEXELS_API_KEY) {
            console.log('⚠️  PEXELS_API_KEY tanımlı değil!');
            return;
        }

        await ensureUploadsDir();

        const totalTrees = await Tree.countDocuments();
        const totalVeg = await Vegetable.countDocuments();
        console.log(`🌳 Toplam ağaç: ${totalTrees}`);
        console.log(`🥬 Toplam sebze: ${totalVeg}\n`);

        const treeResult = await runWithRateLimitRetry(processTreeNames, 'ağaç');
        const vegResult = await runWithRateLimitRetry(processVegNames, 'sebze');

        console.log('📊 GENEL ÖZET:');
        console.log(`   🌳 Ağaç - başarılı: ${treeResult.successNames}, başarısız: ${treeResult.failNames}, güncelleme: ${treeResult.totalUpdated}`);
        console.log(`   🥬 Sebze - başarılı: ${vegResult.successNames}, başarısız: ${vegResult.failNames}, güncelleme: ${vegResult.totalUpdated}`);
        console.log(`   📁 Klasör: ${UPLOADS_DIR}\n`);

        console.log('✅ İşlem tamamlandı!\n');
    } catch (error) {
        console.error('❌ Hata:', error.message || error);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('👋 MongoDB bağlantısı kapatıldı\n');
        }
    }
}

downloadAllImages();
