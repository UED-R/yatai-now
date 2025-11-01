import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./LeafMap.css"; // スタイルシートをインポート
import L from "leaflet";
import { readPinData } from '../../database/dbaccess';

// アイコン設定
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;


// --- Propsの型定義を更新 ---
type LeafMapProps = {
  onBack: () => void;
  onShowOrganizerLogin: () => void;
  onShowVendorLogin: () => void;
  eventid: string;
};


let pinData: any[] = [];

export default function LeafMap({ onBack, onShowOrganizerLogin, onShowVendorLogin, eventid }: LeafMapProps) {
  
  // リロード時実行
  const [_pins, setPins] = useState<any[]>([]);
  useEffect(() => {
    async function fetchData() {
      pinData = await readPinData(eventid);
      setPins(pinData);
    }
    fetchData();
  }, [eventid]);

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
      {pinData.map((pin) => {
        // shopIDの有無でプロパティ名を切り替え
        const name = pin.shopID ? pin.shopname : pin.name;
        const lat = pin.shopID ? pin.x_pos : pin.lat;
        const lng = pin.shopID ? pin.y_pos : pin.lng;

        return (
          <Marker key={name} position={[lat, lng]}>
            <Popup>
              {pin.shopID ? (
                // --- shopIDがある場合 ---
                <div>
                  <strong>{name}</strong>
                  <br />
                  <p>{pin.description}</p>
                  <p>店舗ID: {pin.shopID}</p>
                  <p>出店団体：{pin.teamname}</p>
                  <p>概要：{pin.description}</p>
                  <p>場所：{pin.place}</p>
                  <p>種別：{pin.type}</p>
                  <p>時間：{pin.starttime}~{pin.endtime}</p>
                  <p>おおよその在庫数：{pin.storage}</p>
                </div>
              ) : (
                // --- shopIDがない場合 ---
                <div>
                  <strong>{name}</strong>
                  <br />
                  <p>{pin.description}</p>
                </div>
              )}
            </Popup>
          </Marker>
        );
      })}
      </MapContainer>
    </div>
  );
}
