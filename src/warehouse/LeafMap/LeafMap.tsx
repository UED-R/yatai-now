import "leaflet/dist/leaflet.css";
import "./LeafMap.module.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { readPinData } from '../../database/dbaccess';
import { page_navigate, PAGES } from "../../Pages"
import { useLocation } from "react-router-dom";

// アイコン設定
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

export default function LeafMap() {
  const location = useLocation();
  const eventid = location.state as string;

  // リロード時実行
  const [pinData, setPins] = useState<any[]>([]);
  useEffect(() => {
    async function fetchData() {
      const data = await readPinData(eventid);
      setPins(data);
    }
    fetchData();
  }, [eventid]);

  return (
    <div className="leafmap-screen">
      
      {/* --- ヘッダーとボタンを追加 --- */}
      <header className="leafmap-header">
        <button className="btn-back" onClick={() => page_navigate(PAGES.EVENT_SELECT)}>&lt; 戻る</button>
        <div className="header-right-buttons">
          <button className="btn-header" onClick={() => page_navigate(PAGES.ORG_LOGIN)}>主催者はこちら</button>
          <button className="btn-header" onClick={() => page_navigate(PAGES.VEND_LOGIN)}>出店者はこちら</button>
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
        
      {pinData && pinData.length > 0 && pinData.map((pin) => {
        const lat = pin.id ? pin.y_ido : pin.lat;
        const lng = pin.id ? pin.x_keido : pin.lng;

        return (
          <Marker key={pin.name} position={[lat, lng]} icon={defaultIcon}>
            <Popup>
              {pin.id ? (
                // --- shopIDがある場合 ---
                <div>
                  <strong>{pin.name}</strong>
                  <br />
                  <p>{pin.description}</p>
                  <p>店舗ID: {pin.id}</p>
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
                  <strong>{pin.name}</strong>
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
