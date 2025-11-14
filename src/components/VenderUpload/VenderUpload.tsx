import styles from './VenderUpload.module.css';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { writePinData } from "../../database/dbaccess"
import { page_navigate, PAGES } from '../../Pages';

// --- Leaflet Icon Fix ---
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

// --- VenderUpload Component ---
export default function VenderUpload(){
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [isPinningMode, setIsPinningMode] = useState(false);
    const [pinLocation, setPinLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [pinName, setPinName] = useState("");
    const [pinDescription, setPinDescription] = useState("");

    useEffect(() => {
        // Initialize map
        if (!mapRef.current) {
            const map = L.map('map-container').setView([36.110257, 140.102389], 16);
            mapRef.current = map;
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            }).addTo(map);
        }

        const map = mapRef.current;
        
        // Define click handler based on the mode
        const handleMapClick = (e: L.LeafletMouseEvent) => {
            if (isPinningMode) {
                const { lat, lng } = e.latlng;
                setPinLocation({ lat, lng });

                if (markerRef.current) {
                    markerRef.current.setLatLng(e.latlng);
                } else {
                    markerRef.current = L.marker(e.latlng, { icon: defaultIcon, draggable: true }).addTo(map);
                    // Add drag event to update location
                    markerRef.current.on('dragend', (event) => {
                        setPinLocation(event.target.getLatLng());
                    });
                }
                setIsPinningMode(false); // Exit pinning mode after placing a pin
            }
        };
        
        map.on('click', handleMapClick);

        // Cleanup function
        return () => {
            map.off('click', handleMapClick);
        };
    }, [isPinningMode]); // Rerun effect when isPinningMode changes to update click handler context

    const handleStartPinning = () => {
        setIsPinningMode(true);
    };

    const handleCancelPinning = () => {
        setIsPinningMode(false);
        setPinLocation(null);
        setPinName("");
        setPinDescription("");
        if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
        }
    };

    const handleSavePin = () => {
        if (!pinLocation || !pinName.trim() || !pinDescription.trim()) {
            alert("ピンを設置し、屋台名と説明を入力してください。");
            return;
        }
        // In Leaflet, Lat is Y, Lng is X.
        writePinData("0", pinLocation.lat, pinLocation.lng, pinName, pinDescription)
            .then(() => {
                alert("ピンを保存しました！");
                // Reset form state but keep the saved marker on map (or remove it)
                if(markerRef.current) {
                    markerRef.current.dragging?.disable();
                    markerRef.current.bindPopup(`<strong>${pinName}</strong><br>${pinDescription}`).openPopup();
                }
                markerRef.current = null;
                setPinLocation(null);
                setPinName("");
                setPinDescription("");
            })
            .catch(err => {
                alert("保存に失敗しました: " + (err.message || 'Unknown error'));
            });
    };

    return (
        <div className={`screen-general ${styles["map-screen"]}`}>
            <header className={styles["map-header"]}>
                <button className={styles["btn-back"]} onClick={() => page_navigate(PAGES.MainMap, "1")}>&lt; 地図に戻る</button>
            </header>
            
            <div id="map-container" className={isPinningMode ? 'pinning-mode' : ''}></div>
            
            <div className={styles["upload-panel"]}>
                {!pinLocation && !isPinningMode && (
                    <button className="btn-panel btn-primary" onClick={handleStartPinning}>ピンを新規作成</button>
                )}
                {isPinningMode && (
                    <>
                        <p>地図上をクリックしてピンを設置してください</p>
                        <button className={`${styles["btn-panel"]} ${styles["btn-secondary"]}`} onClick={() => setIsPinningMode(false)}>キャンセル</button>
                    </>
                )}
                {pinLocation && (
                    <>
                        <p>ピンの位置: {pinLocation.lat.toFixed(4)}, {pinLocation.lng.toFixed(4)}</p>
                        <input
                            type="text"
                            value={pinName}
                            onChange={(e) => setPinName(e.target.value)}
                            placeholder="ピンの説明（例：焼きそば屋台）"
                        />
                        <input
                            type="text"
                            value={pinDescription}
                            onChange={(e) => setPinDescription(e.target.value)}
                            placeholder="ピンの説明（例：ソースの味がたまらない！）"
                        />
                        <button className={`${styles["btn-panel"]} ${styles["btn-success"]}`} onClick={handleSavePin}>この場所に保存</button>
                        <button className={`${styles["btn-panel"]} ${styles["btn-secondary"]}`} onClick={handleCancelPinning}>やり直す</button>
                    </>
                )}
            </div>
        </div>
    );
};
