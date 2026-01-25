import styles from './VenderUpload.module.css';
import "leaflet/dist/leaflet.css";

import { useEffect, useState, useRef } from "react";
import { MapContainer, useMapEvents, Marker, Popup, ImageOverlay, Tooltip } from "react-leaflet";
import L from "leaflet";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { page_navigate, PAGES } from "../../Pages"
import { readPinData, writePinData, updatePinData, deletePin } from '../../database/dbaccess';

import MAP_GROUND from '../../image/ground.svg'; // 1F + 屋外
import MAP_2F from '../../image/2F.svg';
import MAP_3F from '../../image/3F.svg';
import MAP_4F from '../../image/4F.svg';

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
    const defaultZoom = 19;
    const [zoomLevel, setZoomLevel] = useState(defaultZoom);
    const visibleGroup = (zoomLevel >= 20) ? "shop" : "area"; // グループ切替
    const bounds: [[number, number], [number, number]] = [
        // bounds: [[南西緯度, 南西経度], [北東緯度, 北東経度]]
        [36.108, 140.098], // 左下y,x
        [36.112, 140.104]  // 右上y,x
    ];
    const [otherPins, setOtherPins] = useState<any[]>([]);
    const [myPin, setMyPin] = useState<any | null>(null);
  	const [user, setUser] = useState<User | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newPinPos, setNewPinPos] = useState<[number, number] | null>(null);
  	const [openShopList, setOpenShopList] = useState<{ [key: string]: boolean }>({});

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

	function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
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
		await sleep(300);
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


	// 自動ポップアップの処理
	const markerRef = useRef<L.Marker | null>(null);
	const openedRef = useRef(false);
	useEffect(() => {
		if (!markerRef.current || openedRef.current) return;
		openedRef.current = true;
		markerRef.current.openPopup();
	}, [markerRef.current]);

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

	async function handleLogout() {
		setIsUpdating(true);
		await sleep(500);
		const auth = getAuth();
		signOut(auth)
			.then(() => {
				page_navigate(PAGES.MAIN_MAP, "1");
			})
			.catch((error) => {
				setIsUpdating(false);
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

	async function deletepinHandler(pinid: string){
    	setIsUpdating(true);
		deletePin(eventid+"/"+pinid);
		await sleep(300);
		setNewPinPos(null);
		setMyPin(null);
		const auth = getAuth();
		await allPinFetch(auth.currentUser);
		setIsCreating(false);
    	setIsUpdating(false);
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
					const shoplist = [...(myPin ? [myPin] : []), ...otherPins] //初回のみ、myPinがnullなので除外する
						.filter(function(temp_pindata) { // areaIDが同じ、shopピンの名前だけ抜き出す
							return temp_pindata.class === "shop" && temp_pindata.areagroupid === pin.id;
						})
						.map(function(shop) {
							return shop.name; //ここで座標も取得するとクリックで店ピンを開けるかも
						});
					return (
						<Marker key={pin.id} position={[pin.y_ido, pin.x_keido]} icon={defaultIcon}>
						<Tooltip direction="top" offset={[0, -40]} permanent>
							<strong>
								{pin.name}（{shoplist.length}団体）
							</strong>
						</Tooltip>
				
						<Popup autoPan={false}>
							<strong>
								{pin.name}（{shoplist.length}団体）
							</strong>
							<p>概要：{pin.description}</p>
							
							{shoplist.length > 0 && (
								<div>
								<button
									onClick={() =>
										setOpenShopList(prev => ({
											...prev,
											[pin.id]: !prev[pin.id], // クリックで反転
										}))
									}
									style={{ marginTop: "6px", cursor: "pointer" }}
								>
									{!!openShopList[pin.id] ? "▲ 店舗を隠す" : "▼ 店舗を表示"}
								</button>
				
								{/* openShopList[pin.id] が true の時だけ店舗リスト表示 */}
								{!!openShopList[pin.id] && (
									<div
									style={{
										maxHeight: "150px", // 高さ制限
										overflowY: "auto",  // 縦スクロール
										marginTop: "6px",
										border: "1px solid #ccc",
										padding: "4px",
										borderRadius: "4px",
										backgroundColor: "#fafafa"
									}}
									>
									<ul style={{ margin: 0, paddingLeft: "16px" }}>
										{shoplist.map((shopName) => (
										<li key={shopName}>{shopName}</li>
										))}
									</ul>
									</div>
								)}
								</div>
							)}
						</Popup>
					</Marker>
				  );
			}else if(pin.class === "shop"){
			if(pin.floor !== currentFloor) return null;
			return (
				<Marker key={pin.ownerid} position={[pin.y_ido, pin.x_keido]} icon={useIcon}>
				{zoomLevel >= 21 && (<Tooltip direction="top" offset={[0, -40]} opacity={0.8} permanent>
              		<strong>{pin.name}</strong>
            	</Tooltip>)}
				<Popup>
					<div>
					<strong>{pin.name}</strong>
					<br />
					<p>概要：{pin.description}</p>
					<p>出店団体：{pin.teamname}</p>
					<p>場所：{pin.place}</p>
					<p>時間：{pin.starttime}~{pin.endtime}</p>
					<p>在庫数：{pin.storage}</p>
					<p>更新日時：{formatUpdateTime(pin.updatetime)}</p>
					</div>
				</Popup>
				</Marker>
			);
			}
		}
    }  

	// 画面描画部分
	if (isUpdating) {//アップデート中の画面
		return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
			<h1>updating...</h1>
		</div>
		);
	}else{ //メインマップ画面
		return (
		<div className={`screen-general ${styles["leafmap-screen"]}`}>
            <header className="common-header">
				<div className={styles["header-button-group"]}>
                	<button className="common-btn-back" onClick={() => page_navigate(PAGES.MAIN_MAP, "1")}>&lt; 地図に戻る</button>
				</div>
				<div className={styles["header-button-group"]}>
					<p className='common-header-text'> ログインユーザ: {user?.email ? user.email.split("@")[0] : "ユーザerr"}</p>
					<button className="common-btn-back" onClick={handleLogout}>ログアウト</button>
				</div>
			</header>

			<MapContainer
				ref={mapRef}
				center={[36.1104, 140.1011]} // 初期位置の緯度経度(小数点以下6桁)
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
				<Marker position={[myPin.y_ido, myPin.x_keido]} icon={myIcon} ref={markerRef}>
					<Tooltip direction="top" offset={[0, -30]} permanent>
						<strong>編集中のピン</strong>
					</Tooltip>
					<Popup>
						<form onSubmit={(e) => {
							e.preventDefault();

							const fd = new FormData(e.currentTarget);
							const newStorage = fd.get("storage") as string;

							if (myPin.storage === "" || (newStorage && newStorage !== myPin.storage)) {
								saveNewPinToDB({ ...myPin, storage: newStorage });
								setIsCreating(false);
								setNewPinPos(null);
							}
						}}
						>
						<div>
							<strong>{myPin.name}</strong>
							<p>概要：{myPin.description}</p>
							<p>出店団体：{myPin.teamname}</p>
							<p>場所：{myPin.place}</p>
							<p>階層：{myPin.floor}</p>
							<p>エリア：{myPin.areagroupid === "area03" ? "第３エリア" 
								: myPin.areagroupid === "area02" ? "第２エリア" : ""}</p>
							<p>時間：{myPin.starttime}~{myPin.endtime}</p>
							<p>現在の在庫数：{myPin.storage}</p>
							<p>最新の更新日時：{formatUpdateTime(myPin.updatetime)}</p>
							<div className={styles["pin-input-row"]}>
								<strong>⇒在庫数の更新：</strong>
								<select
									name="storage"
									defaultValue={myPin.storage}
									style={{ width: "100px" }}
								>
									<option value="◎(すべて在庫十分)">◎(すべて在庫十分)</option>
									<option value="〇(一部商品は品切れ)">〇(一部商品は品切れ)</option>
									<option value="△(すべての商品が在庫僅少)">△(すべての商品が在庫僅少)</option>
									<option value="×(完全在庫切れ)">×(完全在庫切れ)</option>
								</select>
							</div>
							<button type="submit">更新してリロード</button>
						</div>
						</form>
					</Popup>
				</Marker>
			)}

			{/* 自分の新しいピン 全部更新できる*/}
			{newPinPos && ( 
				<Marker position={newPinPos} icon={myIcon} ref={(marker) => {
						if (marker) {
							setTimeout(() => {
								marker.openPopup();
							}, 0);
						}
					}}>
				<Tooltip direction="top" offset={[0, -30]} permanent>
					<strong>編集中のピン</strong>
				</Tooltip>
				<Popup>
					<form style={{ width: "280px" }}
					onSubmit={(e) => {
						e.preventDefault();

						const fd = new FormData(e.currentTarget);
						const data = {
							name: 		 fd.get("pinname")?.toString() 		?? "",
							description: fd.get("description")?.toString()	?? "",
							teamname: 	 fd.get("teamname")?.toString()		?? "",
							place: 		 fd.get("place")?.toString() 		?? "",
							floor: 		 fd.get("floor")?.toString() 		?? "",
							areagroupid: fd.get("areagroupid")?.toString() 	?? "",
							starttime:   fd.get("starttime")?.toString() 	?? "",
							endtime: 	 fd.get("endtime")?.toString() 		?? "",
							storage: 	 fd.get("storage")?.toString() 		?? "",
						};

						if (data.name !== "") {
							saveNewPinToDB({
								y_ido: newPinPos[0],
								x_keido: newPinPos[1],
								...data,
							});
							setIsCreating(false);
							setNewPinPos(null);
						}
					}}
					>
					<div className={styles["pin-input-row"]}>
						<label>新しいピン名：</label>
						<input type="text" name="pinname" defaultValue={myPin?.name} />
					</div>

					<div className={styles["pin-input-row"]}>
						<label>説明：</label>
						<input type="text" name="description" defaultValue={myPin?.description} />
					</div>

					<div className={styles["pin-input-row"]}>
						<label>出店団体：</label>
						<input
						type="text"
						name="teamname"
						defaultValue={
							myPin?.teamname ??
							(user?.email ? user.email.split("@")[0] : "")
						}
						/>
					</div>

					<div className={styles["pin-input-row"]}>
						<label>場所：</label>
						<input type="text" name="place" defaultValue={myPin?.place} />
					</div>

					<div className={styles["pin-input-row"]}>
						<label>階層：</label>
						<select name="floor" defaultValue={myPin?.floor} style={{ width: "100px" }}>
						<option value="1F">1F</option>
						<option value="2F">2F</option>
						<option value="3F">3F</option>
						<option value="4F">4F</option>
						</select>
					</div>

					<div className={styles["pin-input-row"]}>
						<label>エリア：</label>
						<select
						name="areagroupid"
						defaultValue={myPin?.areagroupid}
						style={{ width: "100px" }}
						>
						<option value="area03">第３エリア</option>
						<option value="area02">第２エリア</option>
						</select>
					</div>

					<div className={styles["pin-input-row"]}>
						<label>時間</label>
						<input
						type="text"
						name="starttime"
						defaultValue={myPin?.starttime}
						style={{ width: "50px" }}
						/>
						<label>~</label>
						<input
						type="text"
						name="endtime"
						defaultValue={myPin?.endtime}
						style={{ width: "50px" }}
						/>
					</div>

					<div className={styles["pin-input-row"]}>
						<label>在庫数：</label>
						<select
						name="storage"
						defaultValue={myPin?.storage}
						style={{ width: "100px" }}
						>
						<option value="◎(すべて在庫十分)">◎(すべて在庫十分)</option>
						<option value="〇(一部商品は品切れ)">〇(一部商品は品切れ)</option>
						<option value="△(すべての商品が在庫僅少)">△(すべての商品が在庫僅少)</option>
						<option value="×(完全在庫切れ)">×(完全在庫切れ)</option>
						</select>
					</div>

					<button type="submit">更新してリロード</button>

					<button
						type="button"
						onClick={() => {
							setIsCreating(false);
							setNewPinPos(null);
						}}
					>キャンセル</button>
					</form>

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
				{myPin && (
					<button className={styles["btn-create"]} onClick={() => {deletepinHandler(myPin.ownerid)}}>ピンを削除</button>
				)}
			</div>
		</div>
		);
	}	
}
