import styles from './VenderUpload.module.css';
import "leaflet/dist/leaflet.css";

import { useEffect, useState, useRef } from "react";
import { MapContainer, useMapEvents, Marker, Popup, ImageOverlay, Tooltip } from "react-leaflet";
import L from "leaflet";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { page_navigate, PAGES } from "../../Pages"
import { readPinData, writePinData, updatePinData } from '../../database/dbaccess';

import MAP_SVG from '../../image/map_test2.svg';
import PIN_RED from '/images/pin400x300.png';
import PIN_GREEN from '/images/pin256_green.png';



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


export default function VenderUpload() {
    const eventid = "1" as string;
    const defaultZoom = 18;
    const [zoomLevel, setZoomLevel] = useState(defaultZoom); //型指定なしのuseState、初期値は初期拡大率
    const visibleGroup = (zoomLevel >= 19) ? "shop" : "area"; // グループ切替
    const bounds: [[number, number], [number, number]] = [
		// bounds: [[南西緯度, 南西経度], [北東緯度, 北東経度]]
		[36.108, 140.098], // 左下y,x
		[36.112, 140.104]  // 右上y,x
    ];
    const [otherPins, setOtherPins] = useState<any[]>([]);
    const [myPin, setMyPin] = useState<any | null>(null);
    // const [myNewPin, setMyNewPin] = useState<any | null>(null);

    const [isCreating, setIsCreating] = useState(false);
    const [newPinPos, setNewPinPos] = useState<[number, number] | null>(null);
	const [newPinData, setNewPinData] = useState({
		name: "",
		descr: "",
		teamname: "",
		place: "",
		type: "",
		starttime: "",
		endtime: "",
		storage: ""
	});
	
	function clearNewPinData(){
        setNewPinPos(null);
		setNewPinData({
			name: "",
			descr: "",
			teamname: "",
			place: "",
			type: "",
			starttime: "",
			endtime: "",
			storage: ""
		});
	}

		
	// ズームイベントの処理
	function ZoomWatcher() {
		useMapEvents({
			zoomend: (e) => {
			setZoomLevel(e.target.getZoom()); // 親の状態に直接セット
			}
		});
		return null;
	}


	async function allPinFetch(user: any){
		const data = await readPinData(eventid);
		const uid = user?.uid || null;

		const mine = data.find((p: any) => p.ownerid === uid); //自分のピン
		if (mine) setMyPin(mine);

		const others = data.filter((p: any) => p.ownerid !== uid); //自分以外のピン
		setOtherPins(others);
	}

	//ピン保存か更新の関数
    async function saveNewPinToDB(dataarr: any[]) {
		console.log("save");
		if (!myPin) {
			// 新規作成
			// await writePinData(eventid, y_ido, x_keido, name, description);
		} else {
			// 更新処理
			await updatePinData(eventid, dataarr);
		}

		function sleep(ms: number) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		sleep(1000);
		const auth = getAuth();
		await allPinFetch(auth.currentUser);
    }

    // useEffect：画面のレンダリング完了後に自動実行
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			// 認証情報が更新されたときに実行
			allPinFetch(user);
		});
		return () => unsubscribe(); // クリーンアップ
	}, []);



	// マウスカーソル切替
	const mapRef = useRef<L.Map>(null);
	useEffect(() => { //初回含め、isCreatingが更新されたときに実行
		if (mapRef.current) {
			const container = mapRef.current.getContainer();
			container.style.cursor = isCreating ? "crosshair" : "auto";
		}
	}, [isCreating]);


	// ピン作成モードで地図クリックしたとき
	function CreatePinHandler({ isCreating }: { isCreating: boolean }) {
		useMapEvents({
			click(e) {
			if (!isCreating) return;
				setNewPinPos([e.latlng.lat, e.latlng.lng]);
			}
		});
		return null;
	}
  
	// ピン表示の汎用関数
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
			const shoplist = otherPins
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


	// myPin myPin.name myPin.x_pos
	// myNewPin 
	function renderOwnPinMarker(pin: any) {

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
        <ZoomWatcher />
		<CreatePinHandler isCreating={isCreating}/>

		{/* 自分以外のピン */}
        {otherPins.map((pin: any) => renderPinMarker(pin, otherIcon))} 

		{/* 自分の既存ピン (新しいピンの編集中は非表示) */}
		{!isCreating && myPin && (
			<Marker position={[myPin.y_ido, myPin.x_keido]} icon={myIcon} ref={(marker) => {
					if (marker) {
						setTimeout(() => {
							marker.openPopup();//一瞬待って自動ポップアップ
						}, 0);
					}
				}}>
				<Tooltip direction="top" offset={[0, -30]} permanent>
					<strong>編集中のピン</strong>
				</Tooltip>
				<Popup>
                <div style={{ width: "240px" }}>
					<div className={styles["pin-input-row"]}>
						<label>名前：</label>
						<input 
						type="text"
						value={myPin.name}
						onChange={(e) => setMyPin({ ...myPin, name: e.target.value })}
						/>
                  	</div>
					<div className={styles["pin-input-row"]}>
						<label>説明：</label>
						<input 
						type="text"
						value={myPin.description}
						onChange={(e) => setMyPin({ ...myPin, description: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>出店団体：</label>
						<input 
						type="text"
						value={myPin.teamname}
						onChange={(e) => setMyPin({ ...myPin, teamname: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>場所：</label>
						<input 
						type="text"
						value={myPin.place}
						onChange={(e) => setMyPin({ ...myPin, place: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>種別：</label>
						<input 
						type="text"
						value={myPin.type}
						onChange={(e) => setMyPin({ ...myPin, type: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>時間</label>
						<input 
						type="text"
						value={myPin.starttime}
						style={{width:"40px"}}
						onChange={(e) => setMyPin({ ...myPin, starttime: e.target.value })}
						/>
						<label>~</label>
						<input 
						type="text"
						value={myPin.endtime}
						style={{width:"40px"}}
						onChange={(e) => setMyPin({ ...myPin, endtime: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>在庫(主観)：</label>
						<input 
						type="text"
						value={myPin.storage}
						style={{width:"100px"}}
						onChange={(e) => setMyPin({ ...myPin, storage: e.target.value })}
						/>
					</div>
					<button onClick={() => {
						saveNewPinToDB(myPin);
						setIsCreating(false);
						clearNewPinData();
						page_navigate(PAGES.MainMap, "1");
					}}>保存して更新</button>
                </div>
            	</Popup>
            </Marker>
		)}

		{/* 自分の新しいピン */}
        {newPinPos && ( 
            <Marker position={newPinPos} icon={myIcon} ref={(marker) => {
					if (marker) {
						setTimeout(() => {
							marker.openPopup();//一瞬待って自動ポップアップ
						}, 0);
					}
				}}>
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
						<input 
						type="text"
						value={newPinData.descr}
						onChange={(e) => setNewPinData({ ...newPinData, descr: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>出店団体：</label>
						<input 
						type="text"
						value={newPinData.teamname}
						onChange={(e) => setMyPin({ ...myPin, teamname: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>場所：</label>
						<input 
						type="text"
						value={newPinData.place}
						onChange={(e) => setMyPin({ ...myPin, place: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>種別：</label>
						<input 
						type="text"
						value={newPinData.type}
						onChange={(e) => setMyPin({ ...myPin, type: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>時間</label>
						<input 
						type="text"
						value={newPinData.starttime}
						style={{width:"40px"}}
						onChange={(e) => setMyPin({ ...myPin, starttime: e.target.value })}
						/>
						<label>~</label>
						<input 
						type="text"
						value={newPinData.endtime}
						style={{width:"40px"}}
						onChange={(e) => setMyPin({ ...myPin, endtime: e.target.value })}
						/>
					</div>
					<div className={styles["pin-input-row"]}>
						<label>在庫(主観)：</label>
						<input 
						type="text"
						value={newPinData.storage}
						style={{width:"100px"}}
						onChange={(e) => setMyPin({ ...myPin, storage: e.target.value })}
						/>
					</div>

					<button onClick={() => {
						// saveNewPinToDB(newPinPos[0], newPinPos[1], newPinData.name, newPinData.descr);
						setIsCreating(false);
						clearNewPinData();
					}}>保存して更新</button>

					<button onClick={() => {
						setIsCreating(false);
						clearNewPinData();
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
				clearNewPinData();
			}}>{isCreating ? "キャンセル" : (myPin ? "ピンを再配置" : "ピンを新規作成")}</button>
        </div>
    </div>
  	);
}
