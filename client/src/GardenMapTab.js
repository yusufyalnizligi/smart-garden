import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './GardenMap.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Leaflet ikon düzeltmesi
if (!L.Icon.Default.prototype._getIconUrl_fixed) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
    L.Icon.Default.prototype._getIconUrl_fixed = true;
}

// Özel İkonlar
const createCustomIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [18, 29], // [25, 41] -> ~70%
        iconAnchor: [9, 29], // [12, 41] -> ~70%
        popupAnchor: [1, -24],
        shadowSize: [29, 29]
    });
};

const treeIcon = createCustomIcon('green');
const vegIcon = createCustomIcon('orange');
const userIcon = createCustomIcon('blue');
const labelIcon = createCustomIcon('violet'); // Özel etiket ikonu

// --- ANA BİLEŞEN ---
export default function GardenMapTab({ token }) {
    const [gardenData, setGardenData] = useState(null);
    const [mapItems, setMapItems] = useState([]);
    const [unplacedItems, setUnplacedItems] = useState([]);
    const [customLabels, setCustomLabels] = useState([]); // Özel etiketler
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('view');
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemToPlace, setItemToPlace] = useState(null); // Yeni eklenecek öğe için
    const [mapLayer, setMapLayer] = useState('google-hybrid'); // 'street', 'satellite' or 'google-hybrid'
    const [unplacedPanelOpen, setUnplacedPanelOpen] = useState(false); // Konumsuz öğeler paneli kapalı başlasın
    const [isEditMode, setIsEditMode] = useState(false); // Düzenleme modu (varsayılan: kapalı)
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, lat: 0, lng: 0, view: 'main' }); // view: 'main' | 'tree-list'

    // Harita referansları
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]); // Marker referanslarını tutar
    const polygonRef = useRef(null); // Sınır referansını tutar
    const userMarkerRef = useRef(null); // Kullanıcı konumu referansı
    const tileLayerRef = useRef(null); // Tile layer referansı

    // Click Handler Reference (Closure sorununu aşmak için)
    const handleMapClickRef = useRef((e) => { });
    const isEditModeRef = useRef(isEditMode); // Edit mode ref (stale closure önleme)

    // Verileri çek
    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            try {
                if (active) setLoading(true);
                const gardenRes = await fetch(`${API_URL}/map/garden`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const gardenJson = await gardenRes.json();
                const itemsRes = await fetch(`${API_URL}/map/items`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const itemsJson = await itemsRes.json();

                const labelsRes = await fetch(`${API_URL}/map/custom-labels`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const labelsJson = await labelsRes.json();

                if (active) {
                    setGardenData(gardenJson);
                    setMapItems(itemsJson.items || []);
                    setUnplacedItems(itemsJson.unplacedItems || []);
                    setCustomLabels(Array.isArray(labelsJson) ? labelsJson : []);
                }
            } catch (err) {
                console.error('Veri çekme hatası:', err);
                if (active && !gardenData) {
                    setGardenData({
                        name: 'Bahçem',
                        center: { lat: 38.787308, lng: 39.149078 },
                        zoom: 15,
                        boundaries: []
                    });
                }
            } finally {
                if (active) setLoading(false);
            }
        };
        if (token) fetchData();
        return () => { active = false; };
    }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Helper Functions ---
    // --- Helper Functions ---
    const setupMapLayer = (map, layerType) => {
        // Eski layerları temizle
        if (tileLayerRef.current) {
            tileLayerRef.current.remove();
            tileLayerRef.current = null;
        }

        let tileUrl, attribution;

        if (layerType === 'satellite') {
            tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
            attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
        } else if (layerType === 'google-hybrid') {
            tileUrl = 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}';
            attribution = '&copy; Google Maps';
            // Google tiles subdomains
            tileLayerRef.current = L.tileLayer(tileUrl, {
                attribution,
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(map);
            return;
        } else {
            // Default: Street
            tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            attribution = '&copy; OpenStreetMap contributors';
        }

        tileLayerRef.current = L.tileLayer(tileUrl, { attribution }).addTo(map);
    };

    const updateItemLocation = async (id, type, lat, lng) => {
        try {
            const endpoint = type === 'tree' ? 'trees' : 'vegetables';
            await fetch(`${API_URL}/map/${endpoint}/${id}/location`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ lat, lng })
            });
            fetchDataForUpdate();
            alert('Konum güncellendi! ✅');
        } catch (err) {
            console.error(err);
            alert('Hata oluştu!');
        }
    };

    const removeLocation = async (id, type) => {
        if (!window.confirm('Bu öğeyi haritadan kaldırmak istediğinize emin misiniz?')) return;
        try {
            const endpoint = type === 'tree' ? 'trees' : 'vegetables';
            await fetch(`${API_URL}/map/${endpoint}/${id}/location`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ remove: true })
            });
            fetchDataForUpdate();
            alert('Öğe haritadan kaldırıldı! 🗑️');
        } catch (err) {
            console.error(err);
            alert('Hata oluştu!');
        }
    };

    const updateGardenBoundaries = async (boundaries) => {
        try {
            const newGardenData = { ...gardenData, boundaries };
            setGardenData(newGardenData); // Optimistik
            await fetch(`${API_URL}/map/garden`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ boundaries })
            });
        } catch (err) { console.error(err); }
    };

    const fetchDataForUpdate = async () => {
        try {
            const itemsRes = await fetch(`${API_URL}/map/items`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const itemsJson = await itemsRes.json();

            const labelsRes = await fetch(`${API_URL}/map/custom-labels`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const labelsJson = await labelsRes.json();

            setMapItems(itemsJson.items || []);
            setUnplacedItems(itemsJson.unplacedItems || []);
            setCustomLabels(labelsJson || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleLocateUser = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.locate();
        }
    };

    const handleGoToGarden = () => {
        if (mapInstanceRef.current && gardenData) {
            mapInstanceRef.current.flyTo(
                [gardenData.center.lat, gardenData.center.lng],
                gardenData.zoom
            );
        }
    };

    const handleGetDirections = () => {
        if (!gardenData || !gardenData.center) {
            alert('Bahçe konumu bulunamadı!');
            return;
        }
        const { lat, lng } = gardenData.center;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    };



    const handleAddTreeFromMenu = async () => {
        // Konumsuz ağaçları bul
        const unplacedTrees = unplacedItems.filter(i => i.type === 'tree');

        if (unplacedTrees.length > 0) {
            setContextMenu(prev => ({ ...prev, view: 'tree-list' }));
        } else {
            handleCreateNewTree();
        }
    };

    const handleCreateNewTree = async () => {
        setContextMenu(prev => ({ ...prev, visible: false }));
        const name = prompt("Yeni Ağaç Adı:");
        if (!name) return;

        try {
            const { lat, lng } = contextMenu;
            await fetch(`${API_URL}/trees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    count: 1,
                    category: 'Genel', // Varsayılan
                    locations: [{ lat, lng, count: 1 }]
                })
            });
            fetchDataForUpdate();
            alert('Yeni ağaç oluşturuldu ve eklendi!');
        } catch (err) {
            console.error(err);
            alert('Ağaç eklenemedi!');
        }
    };

    const handleAddVegFromMenu = async () => {
        const unplacedVeggies = unplacedItems.filter(i => i.type === 'vegetable');
        if (unplacedVeggies.length > 0) {
            setContextMenu(prev => ({ ...prev, view: 'veg-list' }));
        } else {
            handleCreateNewVeg();
        }
    };

    const handleCreateNewVeg = async () => {
        setContextMenu(prev => ({ ...prev, visible: false }));
        const name = prompt("Yeni Sebze Adı:");
        if (!name) return;

        try {
            const { lat, lng } = contextMenu;
            await fetch(`${API_URL}/vegetables`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    count: 1,
                    category: 'Genel', // Varsayılan
                    locations: [{ lat, lng, count: 1 }]
                })
            });
            fetchDataForUpdate();
            alert('Yeni sebze oluşturuldu ve eklendi!');
        } catch (err) {
            console.error(err);
            alert('Sebze eklenemedi!');
        }
    };

    const handlePlaceUnplacedItem = async (item) => {
        setContextMenu(prev => ({ ...prev, visible: false }));
        try {
            const { lat, lng } = contextMenu;
            // updateItemLocation fonksiyonunu kullan (konum ekleme mantığı aynı)
            await updateItemLocation(item.id, item.type, lat, lng);
        } catch (err) {
            console.error(err);
            alert('Konum eklenemedi!');
        }
    };

    const handleAddLabelFromMenu = async () => {
        setContextMenu(prev => ({ ...prev, visible: false }));
        const text = prompt("Etiket Metni:");
        if (!text) return;

        try {
            const { lat, lng } = contextMenu;
            await fetch(`${API_URL}/map/custom-labels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text, lat, lng })
            });
            fetchDataForUpdate();
        } catch (err) {
            console.error(err);
            alert('Etiket eklenemedi!');
        }
    };

    // --- Effects ---

    // Haritayı manuel olarak başlat (init)
    useEffect(() => {
        if (!gardenData || !mapContainerRef.current) return;

        // Cleanup
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current).setView(
            [gardenData.center.lat, gardenData.center.lng],
            gardenData.zoom
        );

        // Event Listener'lar
        // NOT: Ref.current'ı arrow function ile çağırıyoruz ki güncel değeri alsın
        map.on('click', (e) => handleMapClickRef.current(e));

        // Sağ Tık: Özel Menü Aç (Sadece Düzenleme Modunda)
        map.on('contextmenu', (e) => {
            if (!isEditModeRef.current) return; // View mode'da çalışmasın

            setContextMenu({
                visible: true,
                x: e.containerPoint.x,
                y: e.containerPoint.y,
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                view: 'main' // Her açılışta ana menüye dön
            });
        });

        // Haritaya tıklayınca menüyü kapat
        map.on('click', () => {
            setContextMenu(prev => ({ ...prev, visible: false }));
        });

        map.on('locationfound', (e) => {
            if (userMarkerRef.current) userMarkerRef.current.remove();
            userMarkerRef.current = L.marker(e.latlng, { icon: userIcon })
                .addTo(map)
                .bindPopup("Şu an buradasınız")
                .openPopup();
            map.flyTo(e.latlng, map.getZoom());
        });

        // Map instance kaydet
        mapInstanceRef.current = map;

        // İlk layer kurulumu
        setupMapLayer(map, mapLayer);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.off();
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [gardenData?.name]); // eslint-disable-line react-hooks/exhaustive-deps

    // Tile Layer Değişimi
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        setupMapLayer(mapInstanceRef.current, mapLayer);
    }, [mapLayer]);

    // Harita Markerlarını ve Polygon'u Güncelle (Data değiştiğinde)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !gardenData) return;

        // 1. Markerları Temizle
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        // 2. Yeni Markerları Ekle
        mapItems.forEach(item => {
            const marker = L.marker([item.lat, item.lng], {
                icon: item.type === 'tree' ? treeIcon : vegIcon
            }).addTo(map);

            // İsim etiketi (Küçük)
            marker.bindTooltip(item.name, {
                permanent: false, // Sadece hover
                direction: 'top',
                className: 'marker-label-small',
                offset: [0, -20]
            });

            const popupContent = `
        <div class="custom-popup-content">
          <h3>${item.name}</h3>
          <p>
            ${item.category} • ${item.count} Adet 
            <span style="font-size: 0.85em; color: #666; margin-left: 5px;">(Toplam: ${item.totalCount})</span>
          </p>
          ${item.notes ? `<p>${item.notes}</p>` : ''}
          ${isEditMode ? `
          <div id="popup-actions-${item.id}">
             <button class="popup-btn-move" data-id="${item.id}" data-type="${item.type}">📍 Konumu Taşı</button>
             <button class="popup-btn-remove" data-id="${item.id}" data-type="${item.type}" style="margin-left: 5px; color: red;">🗑️ Konumu Sil</button>
          </div>
          ` : ''}
        </div>
      `;
            marker.bindPopup(popupContent);

            // Marker tıklama eventi
            marker.on('click', () => {
                setSelectedItem(item);
            });

            markersRef.current.push(marker);
        });

        // 3. Özel Etiketleri Ekle (Keep same)
        customLabels.forEach(label => {
            // ... (keep logic, already present in file but ensuring context match if utilizing block replace)
            const marker = L.marker([label.lat, label.lng], { icon: labelIcon }).addTo(map);

            marker.bindTooltip(label.text, {
                permanent: false,
                direction: 'top',
                className: 'marker-label-small',
                offset: [0, -20]
            });

            marker.bindPopup(`
                <div style="text-align:center;">
                    <strong>${label.text}</strong><br/>
                    ${isEditMode ? `
                        <div style="margin-top:5px;">
                             <button class="popup-btn-edit-label" data-id="${label._id}" data-text="${label.text}" style="color:blue; border:1px solid blue; background:white; cursor:pointer; padding:2px 5px; border-radius:3px; margin-right:5px;">✏️ Düzenle</button>
                             <button class="popup-btn-delete-label" data-id="${label._id}" style="color:red; border:1px solid red; background:white; cursor:pointer; padding:2px 5px; border-radius:3px;">🗑️ Sil</button>
                        </div>
                    ` : ''}
                </div>
            `);
            markersRef.current.push(marker);
        });

        // Popup event delegation
        map.on('popupopen', () => {
            const btn = document.querySelector('.popup-btn-move');
            if (btn) {
                btn.onclick = (evt) => {
                    const id = evt.target.getAttribute('data-id');
                    // item bul
                    const item = mapItems.find(i => i.id === id);
                    if (item) {
                        setSelectedItem(item);
                        setMode('edit-location');
                        map.closePopup();
                        alert('Şimdi haritada yeni bir konuma tıklayın.');
                    }
                };
            }

            const btnRemove = document.querySelector('.popup-btn-remove');
            if (btnRemove) {
                btnRemove.onclick = (evt) => {
                    const id = evt.target.getAttribute('data-id');
                    const type = evt.target.getAttribute('data-type');
                    removeLocation(id, type);
                    map.closePopup();
                };
            }



            // Etiket Düzenleme Butonu
            const btnEditLabel = document.querySelector('.popup-btn-edit-label');
            if (btnEditLabel) {
                btnEditLabel.onclick = async (evt) => {
                    const id = evt.target.getAttribute('data-id');
                    const oldText = evt.target.getAttribute('data-text');

                    const newText = prompt("Yeni etiket metni:", oldText);
                    if (newText && newText !== oldText) {
                        try {
                            await fetch(`${API_URL}/map/custom-labels/${id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ text: newText })
                            });
                            map.closePopup();
                            fetchDataForUpdate();
                        } catch (err) { console.error(err); alert('Etiket güncellenemedi'); }
                    }
                };
            }

            // Etiket Silme Butonu
            const btnDeleteLabel = document.querySelector('.popup-btn-delete-label');
            if (btnDeleteLabel) {
                btnDeleteLabel.onclick = async (evt) => {
                    const id = evt.target.getAttribute('data-id');
                    if (window.confirm('Etiketi silmek istiyor musunuz?')) {
                        try {
                            await fetch(`${API_URL}/map/custom-labels/${id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            map.closePopup();
                            fetchDataForUpdate();
                        } catch (err) { console.error(err); }
                    }
                };
            }
        });

        // 3. Sınırları (Polygon) Güncelle
        if (polygonRef.current) polygonRef.current.remove();
        if (gardenData.boundaries && gardenData.boundaries.length > 0) {
            const latlngs = gardenData.boundaries.map(b => [b.lat, b.lng]);
            polygonRef.current = L.polygon(latlngs, {
                color: 'purple',
                fillColor: 'purple',
                fillOpacity: 0.1
            }).addTo(map);
        }

    }, [mapItems, gardenData?.boundaries, customLabels, isEditMode]); // eslint-disable-line react-hooks/exhaustive-deps

    // Click Handler ref update
    useEffect(() => {
        handleMapClickRef.current = (e) => {
            const { lat, lng } = e.latlng;
            if (mode === 'edit-location' && selectedItem) {
                updateItemLocation(selectedItem.id, selectedItem.type, lat, lng);
                setMode('view');
                setSelectedItem(null);
            } else if (mode === 'place-item' && itemToPlace) {
                updateItemLocation(itemToPlace.id, itemToPlace.type, lat, lng);
                setMode('view');
                setItemToPlace(null);
            } else if (mode === 'draw-boundary') {
                if (!gardenData) return;
                const currentBoundaries = gardenData.boundaries || [];
                const newBoundaries = [...currentBoundaries, { lat, lng }];
                updateGardenBoundaries(newBoundaries);
            }
        };
    }, [mode, selectedItem, gardenData, itemToPlace]); // eslint-disable-line react-hooks/exhaustive-deps

    // isEditMode ref'i güncelle (stale closure sorunu için)
    useEffect(() => {
        isEditModeRef.current = isEditMode;
    }, [isEditMode]);


    if (loading || !gardenData) {
        return (
            <div className="map-loading">
                <div className="spinner"></div>
                <p>Harita Verileri Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            {/* Harita Kontrolleri */}
            <div className="map-toolbar">
                <button className={`toolbar-btn ${mapLayer === 'google-hybrid' ? 'active' : ''}`} onClick={() => setMapLayer('google-hybrid')} title="Google Hibrit">🌍</button>
                <div className="toolbar-separator"></div>
                <button className="toolbar-btn" onClick={handleGoToGarden} title="Bahçem">🏡</button>
                <button className="toolbar-btn" onClick={handleLocateUser} title="Konumumu Bul">📍</button>
                <button className="toolbar-btn" onClick={handleGetDirections} title="Yol Tarifi Al">🚗</button>
                <div className="toolbar-separator"></div>
                <button
                    className={`toolbar-btn ${isEditMode ? 'active' : ''}`}
                    onClick={() => setIsEditMode(!isEditMode)}
                    title={isEditMode ? "Düzenleme Modu Aktif" : "Görüntüleme Modu (Tıkla: Düzenle)"}
                    style={{
                        background: isEditMode ? '#e8f5e9' : '#f5f5f5',
                        borderColor: isEditMode ? '#4caf50' : '#ccc',
                        color: isEditMode ? '#2e7d32' : '#666'
                    }}
                >
                    {isEditMode ? '✏️' : '🔒'}
                </button>
            </div>

            <div className="garden-info-panel">
                <div className={`mode-indicator mode-${mode}`} style={{
                    background: isEditMode ? '#e8f5e9' : '#f5f5f5',
                    color: isEditMode ? '#2e7d32' : '#666'
                }}>
                    {isEditMode ? '✏️ Düzenleme Modu' : '🔒 Görüntüleme Modu'}
                </div>
                <div className="garden-stat"><strong>Bahçe:</strong> {gardenData.name}</div>
                <div className="garden-stat"><strong>Öğe:</strong> {mapItems.length}</div>
                {mode === 'edit-location' && <div className="garden-stat" style={{ color: 'orange' }}>Haritada yeni konuma tıklayın</div>}
                {mode === 'place-item' && <div className="garden-stat" style={{ color: 'orange' }}>"{itemToPlace?.name}" için konuma tıklayın</div>}
            </div>

            {/* Unplaced Items Sidebar */}
            {unplacedItems.length > 0 && (
                <div className="unplaced-items-panel">
                    <h4
                        onClick={() => setUnplacedPanelOpen(!unplacedPanelOpen)}
                        style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <span style={{ fontSize: '0.8em' }}>{unplacedPanelOpen ? '▼' : '▶'}</span>
                        Konumsuz Öğeler ({unplacedItems.length})
                    </h4>
                    {unplacedPanelOpen && (
                        <div className="unplaced-list">
                            {unplacedItems.map(item => (
                                <div
                                    key={item.id}
                                    className="unplaced-item"
                                    onClick={isEditMode ? () => {
                                        setItemToPlace(item);
                                        setMode('place-item');
                                        alert(`"${item.name}" için haritada bir yere tıklayın.`);
                                    } : undefined}
                                    style={{
                                        cursor: isEditMode ? 'pointer' : 'not-allowed',
                                        opacity: isEditMode ? 1 : 0.6
                                    }}
                                >
                                    <span>{item.type === 'tree' ? '🌳' : '🥕'} {item.name} ({item.count})</span>
                                    <small>Ekle +</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Manual Map Container */}
            <div
                id="garden-map-container"
                ref={mapContainerRef}
                style={{ height: '90%', width: '100%' }}
            />

            {/* Custom Context Menu */}
            {contextMenu.visible && (
                <div style={{
                    position: 'absolute',
                    top: contextMenu.y,
                    left: contextMenu.x,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    padding: '5px 0',
                    minWidth: '200px',
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    {contextMenu.view === 'main' ? (
                        <>
                            <div
                                onClick={handleAddTreeFromMenu}
                                style={{ padding: '8px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                🌳 Ağaç Ekle
                            </div>
                            <div
                                onClick={handleAddVegFromMenu}
                                style={{ padding: '8px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                🥕 Sebze Ekle
                            </div>
                            <div
                                onClick={handleAddLabelFromMenu}
                                style={{ padding: '8px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                🏷️ Özel Etiket Ekle
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                onClick={() => setContextMenu(prev => ({ ...prev, view: 'main' }))}
                                style={{ padding: '8px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#666', fontSize: '0.9em' }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                ⬅️ Geri
                            </div>

                            <div style={{ padding: '5px 15px', fontSize: '0.85em', color: '#999', fontWeight: 'bold' }}>
                                {contextMenu.view === 'tree-list' ? 'AĞAÇLAR:' : 'SEBZELER:'}
                            </div>

                            {unplacedItems.filter(i => i.type === (contextMenu.view === 'tree-list' ? 'tree' : 'vegetable')).map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => handlePlaceUnplacedItem(item)}
                                    style={{ padding: '8px 15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                                    onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                    onMouseLeave={(e) => e.target.style.background = 'white'}
                                >
                                    <span>{item.name}</span>
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>+{item.count}</span>
                                </div>
                            ))}

                            <div style={{ borderTop: '1px solid #eee', marginTop: '5px' }}></div>
                            <div
                                onClick={contextMenu.view === 'tree-list' ? handleCreateNewTree : handleCreateNewVeg}
                                style={{ padding: '8px 15px', cursor: 'pointer', color: '#007bff' }}
                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                ➕ Yeni Oluştur...
                            </div>
                        </>
                    )}
                </div>
            )}
        </div >
    );
}
