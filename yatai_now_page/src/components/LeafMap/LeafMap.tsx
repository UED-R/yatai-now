import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
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

type LeafMapProps = {
  onBack: () => void;
};

const pinData = [
  {
    id: 1,
    name: "メインステージ",
    lat: 35.681236,
    lng: 139.767125,
    description: "ここでライブやパフォーマンスが行われます。",
  },
  {
    id: 2,
    name: "フードエリア",
    lat: 35.682,
    lng: 139.768,
    description: "出店やキッチンカーが集まります。",
  },
  {
    id: 3,
    name: "展示スペース",
    lat: 35.6805,
    lng: 139.7665,
    description: "学生作品や研究展示はこちら。",
  },
];

export default function App({ onBack }: LeafMapProps) {
  return (
    <div>
      <MapContainer
        center={[35.681236, 139.767125]} // 東京駅付近
        zoom={17}
        style={{ height: "100vh", width: "100%" }}
        scrollWheelZoom={true}
      >
        {/* === ② 背景タイル（OpenStreetMap） === */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* === ③ JSONデータからピン生成 === */}
        {pinData.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <strong>{pin.name}</strong>
              <br />
              {pin.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button className="btn-back" onClick={onBack}>&lt; 戻る</button>
    </div>
  );
}
