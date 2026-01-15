import styles from "./MainMap.module.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, useMapEvents, Marker, Popup, ImageOverlay, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useLocation } from "react-router-dom";
import { page_navigate, PAGES } from "../../Pages"
import { readPinData } from '../../database/dbaccess';
import MAP_GROUND from '../../image/ground.svg'; // 1F + 屋外
import MAP_2F from '../../image/2F.svg';
import MAP_3F from '../../image/3F.svg';
import MAP_4F from '../../image/4F.svg';

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
  const [currentFloor, setCurrentFloor] = useState("1F");
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

  async function fetchData() {// firebaseDBからピンを取得
    const data = await readPinData(eventid);
    setPins(data);
  }

  // useEffect：画面のレンダリング完了後に自動実行
  useEffect(() => {
    fetchData(); // ピンをread
  }, []);

  function formatUpdateTime(isoString?: string) {
		if (!isoString) return "日時不明";

		const date = new Date(isoString);
		if (isNaN(date.getTime())) return "日時不明";

		return date.toLocaleString("ja-JP", {
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

  const getMapByFloor = () => {
    switch (currentFloor) {
      case "4F": return MAP_4F;
      case "3F": return MAP_3F;
      case "2F": return MAP_2F;
      case "1F": return MAP_GROUND;
      default:   return MAP_GROUND;
    }
  };
  
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
            <Tooltip direction="top" offset={[0, -40]} permanent>
              <strong>{pin.name}</strong>
            </Tooltip>
            <Popup autoPan={false}>
              <div>
                <strong>{pin.name}</strong>
                <br />
                <p>概要：{pin.description}</p>
                {/* <img src={pin.imageURL} style={{ width: "100%", maxWidth: "300px", height: "auto" }}/> */}
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
        if(pin.floor !== currentFloor) return null;
        return (
          <Marker key={pin.ownerid} position={[pin.y_ido, pin.x_keido]} icon={myIcon}>
            <Tooltip direction="top" offset={[0, -40]} permanent>
              <strong>{pin.name}</strong>
            </Tooltip>
            <Popup autoPan={false}>
              <div>
                <strong>{pin.name}</strong>
                <br />
                <p>概要：{pin.description}</p>
                {/* <img src={pin.imageURL} style={{ width: "100%", maxWidth: "300px", height: "auto" }}/> */}
                <p>出店団体：{pin.teamname}</p>
                <p>場所：{pin.place}</p>
                <p>時間：{pin.starttime}~{pin.endtime}</p>
                <p>おおよその在庫数：{pin.storage}</p>
						    <p>更新日時：{formatUpdateTime(pin.updatetime)}</p>
              </div>
            </Popup>
          </Marker>
        );
      }
    }
  }  

  return (
    <div className={styles["leafmap-screen"]}>
      {/* --- ヘッダーとボタン --- */}
      <header className={"common-header"}>
        <div className={styles["header-button-group"]}>
          <button className={"common-btn-back"} onClick={() => page_navigate(PAGES.TOP_PAGE)}>&lt; 戻る</button>
        </div>
        <div className={styles["header-button-group"]}>
          <button className={"common-btn-header"} onClick={() => page_navigate(PAGES.LOGIN_PAGE)}>出店者ログイン</button>
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
        <ImageOverlay url={getMapByFloor()} bounds={bounds} />

        <ZoomWatcher onZoomChange={(z) => setZoomLevel(z)} />
        
        {pinData.map((pin) => renderPinMarker(pin))}

      </MapContainer>

      {/* <div className={styles["floor-selector"]}>
        <button className={styles["floor-btn"]}>4F</button>
        <button className={`${styles["floor-btn"]} ${styles["active"]}`}>3F</button>
        <button className={styles["floor-btn"]}>2F</button>
        <button className={styles["floor-btn"]}>1F</button>
      </div> */}

      <div className={styles["floor-selector"]}>
        {["4F", "3F", "2F", "1F"].map(floor => (
        <button
          key={floor}
          className={`${styles["floor-btn"]} ${currentFloor === floor ? styles["active"] : ""}`}
          onClick={() => setCurrentFloor(floor)}
        >
          {floor}
        </button>
        ))}
      </div>


    </div>
  );
}
