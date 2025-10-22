import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./LeafMap.css"; // スタイルシートをインポート
import { readPinData } from '../../database/dbaccess';


// --- Propsの型定義を更新 ---
type LeafMapProps = {
  onBack: () => void;
  onShowOrganizerLogin: () => void;
  onShowVendorLogin: () => void;
};


let pinData: any[] = [];

// コンポーネント名をファイル名に合わせて変更し、新しいPropsを受け取る
export default function LeafMap({ onBack, onShowOrganizerLogin, onShowVendorLogin }: LeafMapProps) {
  
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
        center={[36.110251, 140.102381]}//初期位置の緯度経度(小数点以下6桁)
        // 1mあたり緯度 : 0.000008983148616 ≒ 0.000009
        // 1mあたり経度 : 0.000010966382364 ≒ 0.000011
        zoom={16}
        style={{ height: "100%", width: "100%" }} // 親要素いっぱいに広げる
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pinData.map((pin) => (
          <Marker key={pin.name} position={[pin.lat, pin.lng]}>
            <Popup>
              <strong>{pin.name}</strong>
              <br />
              {pin.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
