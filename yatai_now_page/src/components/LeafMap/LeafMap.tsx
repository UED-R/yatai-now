import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import { writePinData, readPinData } from '../../database/dbaccess';

// アイコン設定
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 戻るボタンのハンドラ
type LeafMapProps = {
  onBack: () => void;
};


let pinData: any[] = [];



export default function LeafMap({ onBack }: LeafMapProps) {
  
  // リロード時実行
  const [pins, setPins] = useState<any[]>([]);
  useEffect(() => {
    async function fetchData() {
      pinData = await readPinData("0");
      setPins(pinData);
    }
    fetchData();
  }, []);

  return (
    <div>
      <MapContainer
        center={[36.11025766423207, 140.1023890804813]}//初期位置の緯度経度
        zoom={17}
        style={{ height: "100vh", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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
