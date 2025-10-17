import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./LeafMap.css"; // スタイルシートをインポート
import L, { LatLng } from "leaflet";

// --- Leafletデフォルトアイコン設定（ビルド時に消える対策） ---
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- Propsの型定義を更新 ---
type LeafMapProps = {
  onBack: () => void;
  onShowOrganizerLogin: () => void;
  onShowVendorLogin: () => void;
};

// --- クリックでマーカー追加するコンポーネント ---
interface AddMarkerProps {
  onAdd: (latlng: LatLng) => void;
}

function AddMarker({ onAdd }: AddMarkerProps) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

// --- メインコンポーネント ---
interface MarkerData {
  id: number;
  lat: number;
  lng: number;
}

// コンポーネント名をファイル名に合わせて変更し、新しいPropsを受け取る
export default function LeafMap({ onBack, onShowOrganizerLogin, onShowVendorLogin }: LeafMapProps) {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const handleAddMarker = (latlng: LatLng) => {
    setMarkers((prev) => [
      ...prev,
      { id: Date.now(), lat: latlng.lat, lng: latlng.lng },
    ]);
  };

  return (
    // --- 全画面を覆う親要素に変更 ---
    <div className="leafmap-screen">
      
      {/* --- ヘッダーとボタンを追加 --- */}
      <header className="leafmap-header">
        <button className="btn-back" onClick={onBack}>&lt; 戻る</button>
        <div className="header-right-buttons">
          <button className="btn-header" onClick={onShowOrganizerLogin}>主催者はこちら</button>
          <button className="btn-header" onClick={onShowVendorLogin}>出店者はこちら</button>
        </div>
      </header>

      <MapContainer
        center={[36.11025766423207, 140.1023890804813]}//初期位置の緯度経度
        zoom={16}
        style={{ height: "100%", width: "100%" }} // 親要素いっぱいに広げる
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <AddMarker onAdd={handleAddMarker} />

        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <b>ピンID:</b> {m.id} <br />
              緯度: {m.lat.toFixed(5)} <br />
              経度: {m.lng.toFixed(5)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
