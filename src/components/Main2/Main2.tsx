import "./Main2.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, useMapEvents, Marker, Popup, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import { useLocation } from "react-router-dom";
import { page_navigate, PAGES } from "../../Pages"
import { readPinData } from '../../database/dbaccess';
import MAP_SVG from '../../image/map_test2.svg';
import PIN from '../../image/pin400x300.png';

// アイコン設定
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const myIcon = L.icon({
    iconUrl: PIN,
    iconSize: [60, 45],
    iconAnchor: [30, 45],
    popupAnchor: [1, -34]
});

// 関数コンポーネント：呼び出すというよりHTMLのなかにインライン展開する感じ
// propsはプロパティオブジェクト、関数も指定できる
function ZoomWatcher(props: { onZoomChange: (zoom: number) => void }) {
  useMapEvents({ //イベントの監視をするやつ
    zoomend: function (event) { //"zoomend"イベントの処理
      const map = event.target;
      const zoom = map.getZoom();
      props.onZoomChange(zoom);//プロパティ"onZoomChange"で指定した関数を呼び出す
    },
  });
  return null;
}

export default function MainMap() {
  const location = useLocation();
  const eventid = location.state as string;
  const [pinData, setPins] = useState<any[]>([]); //配列型のuseState、初期値なし
  const defaultZoom = 18;
  const [zoomLevel, setZoomLevel] = useState(defaultZoom); //型指定なしのuseState、初期値は初期拡大率
  const visibleGroup = (zoomLevel >= 19) ? "shop" : "area"; // グループ切替
  const bounds: [[number, number], [number, number]] = [
    // bounds: [[南西緯度, 南西経度], [北東緯度, 北東経度]]
    [36.108, 140.098], // 左下y,x
    [36.112, 140.104]  // 右上y,x
  ];


  // useEffect：画面のレンダリング完了後に自動実行
  useEffect(() => {
    async function fetchData() {// firebaseDBからピンを取得
      const data = await readPinData(eventid);
      setPins(data);
    }
    fetchData(); // ピンをread
  }, []);

  
  function renderPinMarker(pin: any) {
    if (eventid === "0"){
      return (
        <Marker key={pin.shopname} position={[pin.lat, pin.lng]} icon={defaultIcon}>
          <Popup>
            <div>
              <strong>{pin.name}</strong>
              <br />
              <p>概要：{pin.description}</p>
            </div>
          </Popup>
        </Marker>
      );
    } else if(eventid === "1"){
      if(pin.class !== visibleGroup) return null;
      if(pin.class === "area"){
        const shoplist = pinData
          .filter(function(temp_pindata) { // areaIDが同じ、shopピンの名前だけ抜き出す
            return temp_pindata.class === "shop" && temp_pindata.areagroupid === pin.id;
          })
          .map(function(shop) {
            return shop.name;
          });
        return (
          <Marker key={pin.id} position={[pin.y_ido, pin.x_keido]} icon={defaultIcon}>
            <Popup>
              <div>
                <strong>{pin.name}</strong>
                <br />
                <p>概要：{pin.description}</p>
                <img src={pin.imageURL} style={{ width: "100%", maxWidth: "300px", height: "auto" }}/>
                <p>管理団体：{pin.teamname}</p>
                {shoplist.length > 0 && (
                  <div>
                    <p>このエリアのお店：</p>
                    <ul>
                      {shoplist.map(function(shopName) {
                        return <li key={shopName}>{shopName}</li>;
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      }else if(pin.class === "shop"){
        return (
          <Marker key={pin.id} position={[pin.y_ido, pin.x_keido]} icon={myIcon}>
            <Popup>
              <div>
                <strong>{pin.name}</strong>
                <br />
                <p>概要：{pin.description}</p>
                <img src={pin.imageURL} style={{ width: "100%", maxWidth: "300px", height: "auto" }}/>
                <p>出店団体：{pin.teamname}</p>
                <p>場所：{pin.place}</p>
                <p>種別：{pin.type}</p>
                <p>時間：{pin.starttime}~{pin.endtime}</p>
                <p>おおよその在庫数：{pin.storage}</p>
              </div>
            </Popup>
          </Marker>
        );
      }
    }
  }  

  return (
    <div className="leafmap-screen">
      {/* --- ヘッダーとボタン --- */}
      <header className="leafmap-header">
        <button className="btn-back" onClick={() => page_navigate(PAGES.EVENT_SELECT)}>&lt; 戻る</button>
        <div className="header-right-buttons">
          <button className="btn-header" onClick={() => page_navigate(PAGES.ORG_LOGIN)}>主催者はこちら</button>
          <button className="btn-header" onClick={() => page_navigate(PAGES.VEND_LOGIN)}>出店者はこちら</button>
        </div>
      </header>

      <MapContainer
        center={[36.110251, 140.100381]} // 初期位置の緯度経度(小数点以下6桁)
        // 緯度が上下、経度が左右、つまり [y, x]
        // 1mあたり緯度 : 0.000008983148616 ≒ 0.000009
        // 1mあたり経度 : 0.000010966382364 ≒ 0.000011
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        crs={L.CRS.Simple}
      >
        <ImageOverlay url={MAP_SVG} bounds={bounds} />

        <ZoomWatcher onZoomChange={(z) => setZoomLevel(z)} />
        
        {pinData.map((pin) => renderPinMarker(pin))}

      </MapContainer>
    </div>
  );
}
