import styles from './VenderUpload.module.css';
import "leaflet/dist/leaflet.css";

import { useEffect, useState, useRef } from "react";
import { MapContainer, useMapEvents, Marker, Popup, ImageOverlay, Tooltip } from "react-leaflet";
import L from "leaflet";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { page_navigate, PAGES } from "../../Pages"
import { readPinData, writePinData, updatePinData } from '../../database/dbaccess';

import MAP_GROUND from '../../image/ground.svg'; // 1F + 屋外
import MAP_2F from '../../image/2F.svg';
import MAP_3F from '../../image/ground.svg';
import MAP_4F from '../../image/2F.svg';

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
    popupAnchor: [0, -12]
});

export default function VenderUpload() {
    const eventid = "1" as string;
	const [currentFloor, setCurrentFloor] = useState("1F");
    const defaultZoom = 18;
    const [_zoomLevel, setZoomLevel] = useState(defaultZoom); // _zoomLevelとして使用しない変数を明示
    const visibleGroup = (_zoomLevel >= 19) ? "shop" : "area"; // グループ切替
    const bounds: [[number, number], [number, number]] = [
        // bounds: [[南西緯度, 南西経度], [北東緯度, 北東経度]]
        [36.108, 140.098], // 左下y,x
        [36.112, 140.104]  // 右上y,x
    ];
    const [otherPins, setOtherPins] = useState<any[]>([]);
    const [myPin, setMyPin] = useState<any | null>(null);
    // const [myNewPin, setMyNewPin] = useState<any | null>(null);
  	const [user, setUser] = useState<User | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
	const [editStorage, setEditStorage] = useState("");
    const [newPinPos, setNewPinPos] = useState<[number, number] | null>(null);
	const [newPinData, setNewPinData] = useState({
		name: "",
		description: "",
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
			description: "",
			teamname: "",
			place: "",
			type: "",
			starttime: "",
			endtime: "",
			storage: ""
		});
	}

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
    async function saveNewPinToDB(dataarr: any) {
    	setIsUpdating(true);
		if (!myPin) {
			// 新規作成
			await writePinData(eventid, dataarr);
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
    	setIsUpdating(false);
    }

    // useEffect：画面のレンダリング完了後に自動実行
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
			// 認証情報が更新されたときに実行
			allPinFetch(currentuser);
			setUser(currentuser);
		});
		return () => unsubscribe();
	}, []);

	// マウスカーソル切替
	const mapRef = useRef<L.Map>(null);
	useEffect(() => { //初回含め、isCreatingが更新されたときに実行
		if (mapRef.current) {
			const container = mapRef.current.getContainer();
			container.style.cursor = isCreating ? "crosshair" : "auto";
		}
	}, [isCreating]);

	useEffect(() => {
		if (myPin) {
			setNewPinData({
				name: myPin.name,
				description: myPin.description,
				teamname: myPin.teamname,
				place: myPin.place,
				type: myPin.type,
				starttime: myPin.starttime,
				endtime: myPin.endtime,
				storage: myPin.storage
			});
		}
	}, [myPin]);


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

	function handleLogout() {
		const auth = getAuth();
		signOut(auth)
		.then(() => {
			console.log("ログアウトしました");
			page_navigate(PAGES.MAIN_MAP, "1");
		})
		.catch((error) => {
			console.error("ログアウト失敗", error);
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
					{/* <img src={pin.imageURL} style={{ width: "100%", maxWidth: "300px", height: "auto" }}/> */}
					<p>出店団体：{pin.teamname}</p>
					<p>場所：{pin.place}</p>
					<p>種別：{pin.type}</p>
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

	// 予定
	// function renderOwnPinMarker(pin: any) {
	// }

	// 画面描画部分
	if (isUpdating) {
		return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
			<h1>updating...</h1>
		</div>
		);
	}else{
		return (
		<div className={`screen-general ${styles["leafmap-screen"]}`}>
            <header className="common-header">
				<div className={styles["header-button-group"]}>
                	<button className="common-btn-back" onClick={() => page_navigate(PAGES.MAIN_MAP, "1")}>&lt; 地図に戻る</button>
					<button className={"common-btn-reload"} onClick={() => allPinFetch(user)}>リロード</button>
				</div>
				<div className={styles["header-button-group"]}>
					<p className='common-header-text'> ログインユーザ: {user?.email ? user.email.split("@")[0] : "ユーザerr"}</p>
					<button className="common-btn-back" onClick={handleLogout}>ログアウト</button>
				</div>
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
			<ImageOverlay url={getMapByFloor()} bounds={bounds} />
			<ZoomWatcher />
			<CreatePinHandler isCreating={isCreating}/>

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

			{/* 自分以外のピン */}
			{otherPins.map((pin: any) => renderPinMarker(pin, otherIcon))} 

			{/* 自分の既存ピン (新しいピンの編集中は非表示)  在庫のみ更新できる*/}
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
						<div>
						<strong>{myPin.name}</strong>
						<br />
						<p>概要：{myPin.description}</p>
						{/* <img src={myPin.imageURL} style={{ width: "100%", maxWidth: "300px", height: "auto" }}/> */}
						<p>出店団体：{myPin.teamname}</p>
						<p>場所：{myPin.place}</p>
						<p>種別：{myPin.type}</p>
						<p>時間：{myPin.starttime}~{myPin.endtime}</p>
						<p>現状の在庫数：{myPin.storage}</p>
						<p>更新日時：{formatUpdateTime(myPin.updatetime)}</p>
						<div className={styles["pin-input-row"]}>
						<strong>⇒在庫の更新：</strong>
						<select
							style={{ width: "100px" }}
							value={editStorage}
							onChange={(e) => setEditStorage(e.target.value)}
						>
							<option value="〇">〇(十分)</option>
							<option value="△">△(少ない)</option>
							<option value="×">×(なし)</option>
						</select>
						</div>
						<button onClick={() => {
							if(editStorage !== ""){
								saveNewPinToDB({ ...myPin, storage: editStorage });
								setIsCreating(false);
								clearNewPinData();
							}
						}}>更新してリロード</button>
					</div>
					</Popup>
				</Marker>
			)}

			{/* 自分の新しいピン 全部更新できる*/}
			{newPinPos && ( 
				<Marker position={newPinPos} icon={myIcon} ref={(marker) => {
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
					<div style={{ width: "280px" }}>
						<div className={styles["pin-input-row"]}>
							<label>新しいピン名：</label>
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
							value={newPinData.description}
							onChange={(e) => setNewPinData({ ...newPinData, description: e.target.value })}
							/>
						</div>
						<div className={styles["pin-input-row"]}>
							<label>出店団体：</label>
							<input 
							type="text"
							value={newPinData.teamname}
							onChange={(e) => setNewPinData({ ...newPinData, teamname: e.target.value })}
							/>
						</div>
						<div className={styles["pin-input-row"]}>
							<label>場所：</label>
							<input 
							type="text"
							value={newPinData.place}
							onChange={(e) => setNewPinData({ ...newPinData, place: e.target.value })}
							/>
						</div>
						<div className={styles["pin-input-row"]}>
							<label>種別：</label>
							<input 
							type="text"
							value={newPinData.type}
							onChange={(e) => setNewPinData({ ...newPinData, type: e.target.value })}
							/>
						</div>
						<div className={styles["pin-input-row"]}>
							<label>時間</label>
							<input 
							type="text"
							value={newPinData.starttime}
							style={{width:"50px"}}
							onChange={(e) => setNewPinData({ ...newPinData, starttime: e.target.value })}
							/>
							<label>~</label>
							<input 
							type="text"
							value={newPinData.endtime}
							style={{width:"50px"}}
							onChange={(e) => setNewPinData({ ...newPinData, endtime: e.target.value })}
							/>
						</div>
						<div className={styles["pin-input-row"]}>
							<label>在庫：</label>
							<select 
								value={newPinData.storage}
								style={{width:"100px"}}
								onChange={(e) => setNewPinData({ ...newPinData, storage: e.target.value })}
							>
							<option value="〇">〇(十分)</option>
							<option value="△">△(少ない)</option>
							<option value="×">×(なし)</option>
							</select>
						</div>

						<button onClick={() => {
							if(newPinData.name !==""){
								saveNewPinToDB({y_ido: newPinPos[0], x_keido: newPinPos[1], ...newPinData});
								setIsCreating(false);
								clearNewPinData();
							}
						}}>更新してリロード</button>

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
        			setNewPinPos(null);
				}}>{isCreating ? "キャンセル" : (myPin ? "ピンを再配置(全情報を更新)" : "ピンを新規作成")}</button>
			</div>
		</div>
		);
	}	
}
