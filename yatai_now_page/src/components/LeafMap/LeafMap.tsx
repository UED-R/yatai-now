import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
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

// --- メイン ---
interface MarkerData {
  id: number;
  lat: number;
  lng: number;
}

export default function App({ onBack }: LeafMapProps) {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const handleAddMarker = (latlng: LatLng) => {
    setMarkers((prev) => [
      ...prev,
      { id: Date.now(), lat: latlng.lat, lng: latlng.lng },
    ]);
  };

  return (
    <div style={{ height: "70vh", width: "50vw"}}>
      <MapContainer
        center={[36.11025766423207, 140.1023890804813]}//初期位置の緯度経度
        zoom={16}
        style={{ height: "100%", width: "100%" }}
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
      <button className="btn-back" onClick={onBack}>&lt; 戻る</button>
    </div>
  );
}
