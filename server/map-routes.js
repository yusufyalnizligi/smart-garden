// GPS Bahçe Haritası API Endpoint'leri
const express = require('express');
const router = express.Router();
const axios = require('axios');

// --- HELPER WRAPPERS ---
// Bu wrapper'lar req.models içindeki modelleri güvenli bir şekilde alır
const getGardenModel = (req) => req.models.Garden;
const getTreeModel = (req) => req.models.Tree;
const getVegetableModel = (req) => req.models.Vegetable;
const getCustomLabelModel = (req) => req.models.CustomLabel;

/**
 * GET /api/map/garden
 * Kullanıcının bahçe haritası verilerini getir
 */
router.get('/garden', async (req, res) => {
    try {
        const Garden = getGardenModel(req);
        // User ID'ye göre bahçe verisini bul
        let garden = await Garden.findOne({ user: req.user.id });

        if (!garden) {
            return res.json({
                name: 'Bahçem',
                boundaries: [],
                center: { lat: 38.787308, lng: 39.149078 }, // Varsayılan
                zoom: 19,
                area: 0,
                notes: ''
            });
        }
        res.json(garden);
    } catch (err) {
        console.error('Bahçe verisi getirme hatası:', err);
        res.status(500).json({ message: 'Bahçe verisi alınamadı' });
    }
});

/**
 * GET /api/map/items
 * Tüm ağaç ve sebze konumlarını getir (harita için optimize edilmiş)
 */
router.get('/items', async (req, res) => {
    try {
        const Tree = getTreeModel(req);
        const Vegetable = getVegetableModel(req);

        const [trees, vegetables] = await Promise.all([
            Tree.find({}).lean(),
            Vegetable.find({}).lean()
        ]);

        const formatItems = (list, type) => {
            const markers = [];
            const rawUnplaced = [];

            list.forEach(item => {
                let itemLocations = [];
                // 1. Array varsa
                if (item.locations && item.locations.length > 0) {
                    itemLocations = item.locations.map(loc => ({ ...loc, _id: loc._id }));
                }
                // 2. Legacy location varsa (AYRI KONTROL, else if değil)
                if (item.location && item.location.lat) {
                    itemLocations.push({ ...item.location, isLegacy: true });
                }

                if (item.name === 'Armut' || item.name === 'Ahududu') {
                    console.log(`GET [${item.name}] ID: ${item._id}`,
                        'Locs:', item.locations ? item.locations.length : 0,
                        'Legacy:', item.location ? 'YES' : 'NO'
                    );
                }

                if (item.count > 1 || item.locations?.length > 0) {
                    console.log(`GET ITEM [${item.name}]:`,
                        'Locations in DB:', item.locations ? item.locations.length : 0,
                        'Legacy Loc:', item.location ? 'YES' : 'NO',
                        'Total Computed Markers:', itemLocations.length
                    );
                }

                // Markers (Haritadakiler)
                itemLocations.forEach((loc, index) => {
                    // Unique ID Generation:
                    // 1. SubID varsa onu kullan
                    // 2. Yoksa ve bu bir legacy item ise 'legacy'
                    // 3. Array içindeyse ama ID yoksa 'loc{index}'

                    let uniqueSubId = loc._id;
                    if (!uniqueSubId) {
                        uniqueSubId = loc.isLegacy ? 'legacy' : `loc${index}`;
                    }

                    markers.push({
                        id: `${item._id}_${uniqueSubId}`,
                        realId: item._id,
                        subId: uniqueSubId,
                        type: type,
                        name: item.name,
                        category: item.category || 'genel',
                        imageUrl: item.imageUrl,
                        notes: item.notes,
                        notes: item.notes,
                        count: loc.count || 1, // Konuma özel adet (yoksa 1)
                        totalCount: item.count, // Toplam stok bilgisi
                        lat: loc.lat,
                        lng: loc.lng,
                        accuracy: loc.accuracy,
                        setAt: loc.setAt
                    });
                });

                // Unplaced (Henüz konmamişlar)
                // Kalan Stok = Toplam Stok - Haritadaki Sayısı
                const placedCount = itemLocations.length;
                const remainingCount = item.count - placedCount;

                if (remainingCount > 0) {
                    rawUnplaced.push({
                        id: item._id,
                        type: type,
                        name: item.name,
                        category: item.category || 'genel',
                        count: remainingCount
                    });
                }
            });

            return { markers, rawUnplaced };
        };

        const treeData = formatItems(trees, 'tree');
        const vegData = formatItems(vegetables, 'vegetable');

        const allMarkers = [...treeData.markers, ...vegData.markers];
        let allUnplaced = [...treeData.rawUnplaced, ...vegData.rawUnplaced];

        // --- GRUPLAMA (GROUPING) ---
        // Aynı isme sahip 'unplaced' öğeleri birleştir
        const groupedUnplaced = [];
        const groupMap = new Map();

        allUnplaced.forEach(item => {
            const key = `${item.type}-${item.name}`;
            if (groupMap.has(key)) {
                // Var olan gruba ekle
                const existing = groupMap.get(key);
                existing.count += item.count;
            } else {
                // Yeni grup başlat
                const newItem = { ...item };
                groupMap.set(key, newItem);
                groupedUnplaced.push(newItem);
            }
        });

        // --- SIRALAMA (SORTING) ---
        // 1. Adet (Çoktan aza)
        // 2. İsim (A'dan Z'ye)
        groupedUnplaced.sort((a, b) => {
            // 1. Tip (Ağaçlar Önce)
            if (a.type !== b.type) {
                return a.type === 'tree' ? -1 : 1;
            }
            // 2. İsim (Alfabetik)
            return a.name.localeCompare(b.name, 'tr');
        });

        res.json({
            items: allMarkers,
            unplacedItems: groupedUnplaced,
            total: allMarkers.length
        });
    } catch (err) {
        console.error('Harita verisi hatası:', err);
        res.status(500).json({ message: 'Veri alınamadı' });
    }
});

/**
 * PATCH /api/map/trees/:id/location
 * Ağaç GPS konumunu güncelle
 */
router.patch('/trees/:id/location', async (req, res) => {
    try {
        const Tree = getTreeModel(req);
        const { lat, lng, accuracy, remove } = req.body;

        let realId = req.params.id;
        let subId = null;

        if (realId.includes('_')) {
            const parts = realId.split('_');
            realId = parts[0];
            subId = parts[1];
        }

        const tree = await Tree.findById(realId);
        if (!tree) return res.status(404).json({ message: 'Ağaç bulunamadı' });

        console.log(`PATCH [${tree.name}] ID: ${tree._id}`, 'Updating...');

        // --- SİLME ---
        if (remove) {
            if (subId && subId !== 'legacy') {
                tree.locations.pull({ _id: subId });
            } else {
                tree.location = undefined;
                if (subId === 'legacy') tree.location = undefined;
            }
            await tree.save();
            return res.json({ message: 'Konum silindi' });
        }

        // --- GÜNCELLEME / EKLEME ---
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return res.status(400).json({ message: 'Geçersiz koordinatlar' });
        }

        const newLoc = {
            lat, lng, accuracy: accuracy || null, setAt: new Date()
        };

        if (subId && subId !== 'legacy') {
            console.log('PATCH TREE (Update):', subId);
            if (!tree.locations) tree.locations = [];
            const sub = tree.locations.id(subId);
            if (sub) {
                sub.lat = lat;
                sub.lng = lng;
                sub.setAt = new Date();
            }
        } else if (subId === 'legacy') {
            console.log('PATCH TREE (Legacy->New)');
            tree.location = undefined;
            if (!tree.locations) tree.locations = [];
            tree.locations.push(newLoc);
        } else {
            console.log('PATCH TREE (New Placement)');
            if (!tree.locations) tree.locations = [];

            // Unplaced'den geldiği için count kontrolü
            // Eğer zaten locations.length == count ise, count artmalı
            // Eğer locations.length < count ise, mevcut stoktan kullanır

            const currentPlaced = tree.locations.length + (tree.location && tree.location.lat ? 1 : 0);
            console.log('Current Placed:', currentPlaced, 'Total Count:', tree.count);

            if (currentPlaced >= tree.count) {
                console.log('Increasing count');
                tree.count = currentPlaced + 1;
            }
            tree.locations.push(newLoc);
        }

        tree.markModified('locations'); // Mongoose'un değişikliği algılamasını zorla
        const saved = await tree.save();
        console.log('PATCH TREE SAVED. Locations count:', saved.locations.length);

        res.json({ message: 'Konum güncellendi/eklendi' });

    } catch (err) {
        console.error('Ağaç konum güncelleme hatası:', err);
        res.status(500).json({ message: 'Konum güncellenemedi' });
    }
});

/**
 * PATCH /api/map/vegetables/:id/location
 * Sebze GPS konumunu güncelle
 */
router.patch('/vegetables/:id/location', async (req, res) => {
    try {
        const Vegetable = getVegetableModel(req);
        const { lat, lng, accuracy, remove } = req.body;

        let realId = req.params.id;
        let subId = null;

        if (realId.includes('_')) {
            const parts = realId.split('_');
            realId = parts[0];
            subId = parts[1];
        }

        const vegetable = await Vegetable.findById(realId);
        if (!vegetable) return res.status(404).json({ message: 'Sebze bulunamadı' });

        if (remove) {
            if (subId && subId !== 'legacy') {
                vegetable.locations.pull({ _id: subId });
            } else {
                vegetable.location = undefined;
                if (subId === 'legacy') vegetable.location = undefined;
            }
            await vegetable.save();
            return res.json({ message: 'Konum silindi' });
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return res.status(400).json({ message: 'Geçersiz koordinatlar' });
        }

        const newLoc = {
            lat, lng, accuracy: accuracy || null, setAt: new Date()
        };

        if (subId && subId !== 'legacy') {
            if (!vegetable.locations) vegetable.locations = [];
            const sub = vegetable.locations.id(subId);
            if (sub) {
                sub.lat = lat;
                sub.lng = lng;
                sub.setAt = new Date();
            }
        } else if (subId === 'legacy') {
            vegetable.location = undefined;
            if (!vegetable.locations) vegetable.locations = [];
            vegetable.locations.push(newLoc);
        } else {
            if (!vegetable.locations) vegetable.locations = [];
            const currentPlaced = vegetable.locations.length + (vegetable.location && vegetable.location.lat ? 1 : 0);
            if (currentPlaced >= vegetable.count) {
                vegetable.count = currentPlaced + 1;
            }
            vegetable.locations.push(newLoc);
        }

        await vegetable.save();
        res.json({ message: 'Konum güncellendi/eklendi' });

    } catch (err) {
        console.error('Sebze konum güncelleme hatası:', err);
        res.status(500).json({ message: 'Konum güncellenemedi' });
    }
});

/**
 * POST /api/map/geocode
 * Adres -> Koordinat (Nominatim)
 */
router.post('/geocode', async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) return res.status(400).json({ message: 'Adres gerekli' });

        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address,
                format: 'json',
                limit: 5,
                addressdetails: 1
            },
            headers: { 'User-Agent': 'SmartGarden/1.0' }
        });

        res.json({ results: response.data });
    } catch (err) {
        console.error('Geocoding hatası:', err);
        res.status(500).json({ message: 'Adres çözümlenemedi' });
    }
});

/**
 * POST /api/map/reverse-geocode
 * Koordinat -> Adres
 */
router.post('/reverse-geocode', async (req, res) => {
    try {
        const { lat, lng } = req.body;
        if (!lat || !lng) return res.status(400).json({ message: 'Koordinatlar gerekli' });

        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat,
                lon: lng,
                format: 'json',
                addressdetails: 1
            },
            headers: { 'User-Agent': 'SmartGarden/1.0' }
        });

        res.json(response.data);
    } catch (err) {
        console.error('Reverse geocoding hatası:', err);
        res.status(500).json({ message: 'Adres çözümlenemedi' });
    }
});

/**
 * POST /api/map/location-count
 * Belirli bir konumdaki iğne adetini güncelle (+1/-1)
 */
router.post('/location-count', async (req, res) => {
    try {
        const { itemId, type, locationId, delta } = req.body;
        // delta: +1 veya -1

        const Model = type === 'tree' ? getTreeModel(req) : getVegetableModel(req);
        const item = await Model.findById(itemId);

        if (!item) return res.status(404).json({ message: 'Öğe bulunamadı' });

        // 1. Legacy Location
        if (locationId === '_legacy' || (locationId && locationId.endsWith('_legacy'))) {
            const newCount = (item.count || 0) + delta;
            if (newCount <= 0) {
                // Adet 0 olursa tamamen silinsin mi? Genelde hayır, belki konum silinir.
                // Ama legacy'de tek konum var. 
                // Şimdilik min 0 yapalım, konum kalsın.
                item.count = 0;
            } else {
                item.count = newCount;
            }
        }
        // 2. Locations Array
        else if (item.locations) {
            const loc = item.locations.id(locationId);
            if (loc) {
                // Konum bulundu
                const locCount = (loc.count || 1) + delta;
                if (locCount <= 0) {
                    // Konumdaki sayı bitti, konumu sil
                    item.locations.pull(locationId);
                    item.count = (item.count || 0) + delta; // Toplamdan da düş
                } else {
                    loc.count = locCount;
                    item.count = (item.count || 0) + delta; // Toplamı güncelle
                }
            }
        }

        // Toplam Sayı Negatif Olmasın
        if (item.count < 0) item.count = 0;

        await item.save();
        res.json({ message: 'Adet güncellendi', item });

    } catch (err) {
        console.error('Count update error:', err);
        res.status(500).json({ message: 'Güncelleme hatası' });
    }
});

/**
 * GET /api/map/merge-duplicates
 * Veritabanındaki aynı isimli kayıtları birleştirir (Cleanup)
 */
router.get('/merge-duplicates', async (req, res) => {
    try {
        const Tree = getTreeModel(req);
        const Vegetable = getVegetableModel(req);

        const mergeCollection = async (Model, typeName) => {
            const allItems = await Model.find({});
            const groups = {};

            // Grupla
            allItems.forEach(item => {
                const key = item.name.trim(); // Sadece isme göre birleştir
                if (!groups[key]) groups[key] = [];
                groups[key].push(item);
            });

            let mergedCount = 0;

            for (const name in groups) {
                const duplicates = groups[name];
                if (duplicates.length > 1) {
                    // Ana kayıt: En eski oluşturulan veya ilk
                    const master = duplicates[0];
                    let totalCount = master.count;
                    let allLocations = master.locations || [];

                    // Eğer master'ın legacy location'ı varsa array'e ekle
                    if (master.location && master.location.lat) {
                        allLocations.push({ ...master.location, _id: undefined }); // _id çakışmasın
                        master.location = undefined;
                    }

                    // Diğerlerini birleştir
                    for (let i = 1; i < duplicates.length; i++) {
                        const dup = duplicates[i];
                        totalCount += dup.count;

                        // Dup locations
                        if (dup.locations && dup.locations.length > 0) {
                            allLocations = [...allLocations, ...dup.locations];
                        }
                        // Dup legacy location
                        if (dup.location && dup.location.lat) {
                            allLocations.push({ ...dup.location, _id: undefined });
                        }

                        // Sil
                        await Model.findByIdAndDelete(dup._id);
                    }

                    // Master güncelle
                    master.count = totalCount;
                    master.locations = allLocations;
                    master.location = undefined; // Legacy alanı temizle
                    await master.save();
                    mergedCount++;
                }
            }
            return mergedCount;
        };

        const mergedTrees = await mergeCollection(Tree, 'Tree');
        const mergedVegs = await mergeCollection(Vegetable, 'Vegetable');

        res.json({
            message: 'Veritabanı temizlendi ve birleştirildi',
            mergedTrees,
            mergedVegs
        });

    } catch (err) {
        console.error('Merge hatası:', err);
        res.status(500).json({ message: 'Birleştirme hatası' });
    }
});


// --- CUSTOM LABELS ---

// GET /api/map/custom-labels
router.get('/custom-labels', async (req, res) => {
    try {
        const CustomLabel = getCustomLabelModel(req);
        const labels = await CustomLabel.find({});
        res.json(labels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Etiketler alınamadı' });
    }
});

// POST /api/map/custom-labels
router.post('/custom-labels', async (req, res) => {
    try {
        const { text, lat, lng } = req.body;
        if (!text || !lat || !lng) return res.status(400).json({ message: 'Eksik veri' });

        const CustomLabel = getCustomLabelModel(req);
        const newLabel = new CustomLabel({ text, lat, lng });
        await newLabel.save();
        res.json(newLabel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Etiket oluşturulamadı' });
    }
});

// DELETE /api/map/custom-labels/:id
router.delete('/custom-labels/:id', async (req, res) => {
    try {
        const CustomLabel = getCustomLabelModel(req);
        await CustomLabel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Etiket silindi' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Silme hatası' });
    }
});

module.exports = router;
