import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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

// データ書き込み
export function writePinData(eventId: string, y_ido: number, x_keido: number, name: string, description: string) {
  const auth = getAuth();
	const owneruid = auth.currentUser?.uid as string;
  if (eventId === "0"){
    return set(ref(fire_database, `${eventId}/${owneruid}`), { "lat":y_ido, "lng":x_keido, name, description});
  }else if(eventId === "1"){
    return set(ref(fire_database, `${eventId}/${owneruid}`), { "class":"shop", y_ido, x_keido, name, description, "areagroupid":"area01" });
  }else{
    return Promise.reject(new Error("Unsupported eventId"));
  }
}

// データ読み込み
export async function readPinData(eventId: string) {
  const snapshot = await get(child(ref(fire_database), eventId));
  if (snapshot.exists()) { //jsonのkeyがuidなので、それをidにしてvalueに含める
    return Object.entries(snapshot.val()).map(([key, value]) => ({ id: key, ...(value as Record<string, any>) }));
  } else {
    return [];
  }
}

export async function updatePinData(eventid: string, newValues: any) {
    const auth = getAuth();
    const owneruid = auth.currentUser?.uid as string;
    return update(ref(fire_database, `${eventid}/${owneruid}`), newValues);
}

// 通常ログイン関数
export async function userLogin(userID: string, userPwd: string): Promise<string|null>{
  const auth = getAuth();
  try{
    const userCredential = 
    await signInWithEmailAndPassword(auth, userID+"@u.tsukuba.example.test.ac.jp", userPwd)
    const user = userCredential.user;
    return user.uid; // 成功時：uidを返す
  }catch (error: any) {
    console.error("ログイン失敗:", error.code, error.message);
    return null; // 失敗時：nullを返す
  }
}
