import styles from './VenderUpload.module.css';
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import { MapContainer, useMapEvents, Marker, Popup, ImageOverlay, Tooltip } from "react-leaflet";
import L from "leaflet";
import { page_navigate, PAGES } from "../../Pages"
import { readPinData, writePinData, updatePinData } from '../../database/dbaccess';
import MAP_SVG from '../../image/map_test2.svg';
import PIN_RED from '/images/pin400x300.png';
import PIN_GREEN from '/images/pin256_green.png';
import { getAuth, onAuthStateChanged } from "firebase/auth";



// アイコン設定
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const otherIcon = L.icon({
    iconUrl: PIN_RED,
    iconSize: [60, 45],
    iconAnchor: [30, 45],
    popupAnchor: [1, -34]
});

const myIcon = L.icon({
    iconUrl: PIN_GREEN,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [10, -10]
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

export default function VenderUpload() {
    const eventid = "1" as string;
    const [pinData, setPins] = useState<any[]>([]); //配列型のuseState、初期値なし
    const defaultZoom = 18;
    const [zoomLevel, setZoomLevel] = useState(defaultZoom); //型指定なしのuseState、初期値は初期拡大率
    const visibleGroup = (zoomLevel >= 19) ? "shop" : "area"; // グループ切替
    const bounds: [[number, number], [number, number]] = [
		// bounds: [[南西緯度, 南西経度], [北東緯度, 北東経度]]
		[36.108, 140.098], // 左下y,x
		[36.112, 140.104]  // 右上y,x
    ];
    const [isCreating, setIsCreating] = useState(false);
    const [newPinPos, setNewPinPos] = useState<[number, number] | null>(null);
	const [newPinData, setNewPinData] = useState({
		name: "",
		descr: ""
	});
	function resetNewPinData(){
        setNewPinPos(null);
		setNewPinData({name:"",descr:""});
	}
    const [myPin, setMyPin] = useState<any | null>(null);


    async function saveNewPinToDB(y_ido: number, x_keido: number, name: string, description: string) {
		if (!myPin) {
			// 新規作成
			console.log("新規作成します：");
			await writePinData(eventid, y_ido, x_keido, name, description);
		} else {
			// 更新処理（updatePinData を作る）
			console.log("更新します："+myPin.id);
			await updatePinData(eventid, {y_ido, x_keido, name, description});
		}
		function sleep(ms: number) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
    }


    // ピン作成モードで地図クリックしたとき
    function handleCreateClick(pos: [number, number]) {
        setNewPinPos(pos);
    }

    // useEffect：画面のレンダリング完了後に自動実行
	useEffect(() => {
	const auth = getAuth();
	const unsubscribe = onAuthStateChanged(auth, async (user) => {
		// 認証情報が更新されたときに実行
		const data = await readPinData(eventid);
		const uid = user?.uid || null;

		const mine = data.find((p: any) => p.ownerid === uid); //自分のピン
		if (mine) setMyPin(mine);

		const others = data.filter((p: any) => p.ownerid !== uid); //自分以外のピン
		setPins(others);
	});

	return () => unsubscribe(); // クリーンアップ
	}, []);


	const mapRef = useRef<L.Map>(null);

	// マウスカーソル切替
	useEffect(() => { //初回含め、isCreatingが更新されたときに実行
	if (mapRef.current) {
		const container = mapRef.current.getContainer();
		container.style.cursor = isCreating ? "crosshair" : "auto";
	}
	}, [isCreating]);
  
    function renderPinMarker(pin: any, useIcon: L.Icon) {
		if (eventid === "0"){
			return (
			<Marker key={pin.shopname} position={[pin.lat, pin.lng]} icon={useIcon}>
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
				<Marker key={pin.ownerid} position={[pin.y_ido, pin.x_keido]} icon={defaultIcon}>
				<Tooltip direction="top" offset={[0, -40]} permanent>
					<strong>{pin.name}</strong>
				</Tooltip>
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
				<Marker key={pin.ownerid} position={[pin.y_ido, pin.x_keido]} icon={useIcon}>
				<Tooltip direction="top" offset={[0, -40]} permanent>
					<strong>{pin.name}</strong>
				</Tooltip>
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

  	function CreatePinHandler(props: { 
		isCreating: boolean, 
		onCreate: (latlng: [number, number]) => void 
		}) {
			useMapEvents({
				click(e) {
					if (!props.isCreating) return;
					props.onCreate([e.latlng.lat, e.latlng.lng]);
				}
			});
		return null;
    }

  return (
    <div className={styles["leafmap-screen"]}>
		<header className={styles["leafmap-header"]}>
			<button className={styles["btn-back"]} onClick={() => page_navigate(PAGES.MainMap,"1")}>&lt; 戻る</button>
		</header>

		<MapContainer
  			ref={mapRef}
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
		<CreatePinHandler isCreating={isCreating} onCreate={handleCreateClick}/>

		{/* 自分以外のピン */}
        {pinData.map((pin: any) => renderPinMarker(pin, otherIcon))} 

		{/* 自分の既存ピン(編集中は非表示) */}
		{!isCreating && myPin && renderPinMarker(myPin, myIcon)} 

        {newPinPos && ( 
			// 新しいピン
            <Marker position={newPinPos} icon={myIcon}>
            <Popup>
                <div style={{ width: "240px" }}>
                  <strong>新しいピン</strong>
                  <div className={styles["pin-input-row"]}>
                    <label>名前：</label>
                    <input 
                    type="text"
                    value={newPinData.name}
                    onChange={(e) => setNewPinData({ ...newPinData, name: e.target.value })}
                    />
                  </div>
                  <div className={styles["pin-input-row"]}>
                    <label>説明：</label>
                    <textarea
                    value={newPinData.descr}
                    onChange={(e) => setNewPinData({ ...newPinData, descr: e.target.value })}
                    />
                  </div>

                  <button onClick={() => {
                    saveNewPinToDB(newPinPos[0], newPinPos[1], newPinData.name, newPinData.descr);
                    setIsCreating(false);
                    resetNewPinData();
                  }}>保存して更新</button>

                  <button onClick={() => {
                    setIsCreating(false);
                    resetNewPinData();
                  }}>キャンセル</button>
                </div>
            </Popup>
            </Marker>
        )}
		</MapContainer>
		<div className={styles["leafmap-footer"]}>
			<button className={styles["btn-create"]} onClick={() => {
				if(isCreating){
					setIsCreating(false);
				}else{
					setIsCreating(true);
				}
				resetNewPinData();
			}}>{isCreating ? "キャンセル" : (myPin ? "ピンを更新" : "ピンを新規作成")}</button>
        </div>
    </div>
  );
}
