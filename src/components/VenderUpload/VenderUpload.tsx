import styles from './VenderUpload.module.css';
import "leaflet/dist/leaflet.css";

import { useEffect, useState, useRef } from "react";
import { MapContainer, useMapEvents, Marker, Popup, ImageOverlay, Tooltip } from "react-leaflet";
import L from "leaflet";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { page_navigate, PAGES } from "../../Pages"
import { readPinData, writePinData, updatePinData } from '../../database/dbaccess';

import MAP_SVG from '../../image/2025_11_19.svg';
// 画像パスはプロジェクト構成に合わせて確認してください
import PIN_RED from '../../image/pin400x300.png'; 
import PIN_GREEN from '../../image/pin256_green.png';

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
    const [_zoomLevel, setZoomLevel] = useState(defaultZoom); // _zoomLevelとして使用しない変数を明示
    const visibleGroup = (_zoomLevel >= 19) ? "shop" : "area"; // グループ切替
    const bounds: [[number, number], [number, number]] = [
        // bounds: [[南西緯度, 南西経度], [北東緯度, 北東経度]]
        [36.108, 140.098], // 左下y,x
        [36.112, 140.104]  // 右上y,x
    ];
    const [otherPins, setOtherPins] = useState<any[]>([]);
    const [myPin, setMyPin] = useState<any | null>(null);

    const [isCreating, setIsCreating] = useState(false);
    const [newPinPos, setNewPinPos] = useState<[number, number] | null>(null);
    const [newPinData, setNewPinData] = useState({
        name: "",
        descr: ""
    });
    
    function clearNewPinData(){
        setNewPinPos(null);
        setNewPinData({name:"",descr:""});
    }

    // ズームイベントの処理
    function ZoomWatcher() {
        useMapEvents({
            zoomend: (e) => {
                setZoomLevel(e.target.getZoom());
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
    async function saveNewPinToDB(y_ido: number, x_keido: number, name: string, description: string) {
        if (!myPin) {
            // 新規作成
            await writePinData(eventid, y_ido, x_keido, name, description);
        } else {
            // 更新処理
            await updatePinData(eventid, {y_ido, x_keido, name, description});
        }

        function sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // DB反映待ちのための簡易的なWait（本来は書き込み完了をawaitすべき）
        await sleep(1000);
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
            // visibleGroupによるフィルタリングは、必要に応じて有効化してください
            // if(pin.class !== visibleGroup) return null;

            // 簡略化のため、全てのピンを表示するロジックにしています
            // 必要に応じてMainMap同様のフィルタリングを追加してください
            return (
                <Marker key={pin.ownerid || Math.random()} position={[pin.y_ido, pin.x_keido]} icon={useIcon}>
                    <Tooltip direction="top" offset={[0, -40]} permanent>
                        <strong>{pin.name}</strong>
                    </Tooltip>
                    <Popup>
                        <div>
                            <strong>{pin.name}</strong>
                            <br />
                            <p>概要：{pin.description}</p>
                            {pin.imageURL && <img src={pin.imageURL} style={{ width: "100%", maxWidth: "300px", height: "auto" }} alt="shop" />}
                            <p>出店団体：{pin.teamname}</p>
                        </div>
                    </Popup>
                </Marker>
            );
        }
    }  

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

    return (
        <div className={`screen-general ${styles["leafmap-screen"]}`}>
            
            {/* ▼▼▼ ヘッダー部分：App.cssの共通クラスを使用 ▼▼▼ */}
            <header className="common-header">
                <button className="common-btn-back" onClick={() => page_navigate(PAGES.MainMap, "1")}>&lt; 地図に戻る</button>
            </header>
            {/* ▲▲▲ ヘッダー部分終了 ▲▲▲ */}

            <MapContainer
                ref={mapRef}
                center={[36.110251, 140.100381]} 
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
                {!isCreating && myPin && renderPinMarker(myPin, myIcon)} 

                {/* 自分の新しいピン */}
                {newPinPos && ( 
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
                                    <input 
                                        type="text"
                                        value={newPinData.descr}
                                        onChange={(e) => setNewPinData({ ...newPinData, descr: e.target.value })}
                                    />
                                </div>

                                <button onClick={() => {
                                    saveNewPinToDB(newPinPos[0], newPinPos[1], newPinData.name, newPinData.descr);
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

            {/* フッター部分（ピン作成ボタン） */}
            <div className={styles["leafmap-footer"]}>
                <button className={styles["btn-create"]} onClick={() => {
                    if(isCreating){
                        setIsCreating(false);
                    }else{
                        setIsCreating(true);
                    }
                    clearNewPinData();
                }}>
                    {isCreating ? "キャンセル" : (myPin ? "ピンを更新" : "ピンを新規作成")}
                </button>
            </div>
        </div>
    );
}