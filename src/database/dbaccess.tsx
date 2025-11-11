import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";

// 呼び出し方
// 他のファイルの先頭で import { writePinData, readPinData } from '../../database/dbaccess';

// 書き込み eventidはString
// writePinData(eventId, Number(inputPinX), Number(inputPinY), inputPinText)を呼び出す

// 読み込み async関数が必要
// async function <関数名> () {
//   const data = await readPinData(eventId);
// }



// ----- 初期設定
const firebaseConfig = {
  apiKey: "AIzaSyAxxocdjMi0CkRYSwNlfa2chCE653Cqat8",
  authDomain: "yatai-now-test01.firebaseapp.com",
  databaseURL: "https://yatai-now-test01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "yatai-now-test01",
  storageBucket: "yatai-now-test01.firebasestorage.app",
  messagingSenderId: "585308141782",
  appId: "1:585308141782:web:4c1c1cbe228720dca2b177"
};
const app = initializeApp(firebaseConfig);
const fire_database = getDatabase(app);

// 現在時刻の文字列を返す(ID用)
function getCurrentTimestamp(): string {
  const now = new Date();
  const year   = now.getFullYear();
  const month  = String(now.getMonth() + 1).padStart(2, "0");
  const day    = String(now.getDate()).padStart(2, "0");
  const hour   = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}_${hour}${minute}${second}`;
}

// データ書き込み
export function writePinData(eventId: string, y_ido: number, x_keido: number, name: string, description: string) {
  const timeid = getCurrentTimestamp();
  if (eventId === "0"){
    return set(ref(fire_database, `${eventId}/${timeid}`), { "lat":y_ido, "lng":x_keido, name, description});
  }else if(eventId === "1"){
    return set(ref(fire_database, `${eventId}/${timeid}`), { "id":`shop${timeid}`, "class":"shop", y_ido, x_keido, name, description, "areagroupid":"area01" });
  }else{
    return Promise.reject(new Error("Unsupported eventId"));
  }
}

// データ読み込み
export async function readPinData(eventId: string) {
  const snapshot = await get(child(ref(fire_database), eventId));
  if (snapshot.exists()) {
    return Object.values(snapshot.val()); // 配列で返す
  } else {
    return [];
  }
}