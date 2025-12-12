import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get, update, remove } from "firebase/database";
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

// データ読み込み
export async function readPinData(eventId: string) {
  const snapshot = await get(child(ref(fire_database), eventId));
  if (snapshot.exists()) { //jsonのkeyがuidなので、それをidにしてvalueに含める
    return Object.entries(snapshot.val()).map(([key, value]) => ({ ownerid: key, ...(value as Record<string, any>) }));
  } else {
    return [];
  }
}

// データ書き込み
export function writePinData(eventId: string, newValues: any) {
  const auth = getAuth();
	const owneruid = auth.currentUser?.uid as string;
  if(eventId !== "1"){
    return Promise.reject(new Error("Unsupported eventId"));
  }
  // --- 1. 必須項目チェック ---
  const requiredKeys = ["y_ido", "x_keido", "name"];
  for (const key of requiredKeys) {
    if (!(key in newValues)) {
      return Promise.reject(new Error(`Missing required value: ${key}`));
    }
  }

  // --- 2. ownerid が入っていたら除外 ---
  if ("ownerid" in newValues) {
    const { ownerid, ...rest } = newValues;
    newValues = rest;
  }

  // --- 3. 不足しているkeyを追加 ---
  if (!("class" in newValues)) newValues.class = "shop";
  if (!("description" in newValues)) newValues.description = "sample text";
  if (!("areagroupid" in newValues)) newValues.areagroupid = "area01";
  if (!("floor" in newValues)) newValues.floor = "1F";

  
  // --- 4. updatetime を追加（現在時刻） ---
  newValues.updatetime = new Date().toISOString();
  // 例: "2025-11-26T12:34:56.789Z"

  return set(ref(fire_database, `${eventId}/${owneruid}`), newValues);

}

export async function updatePinData(eventId: string, newValues: any) {
    if(eventId !== "1"){
      return Promise.reject(new Error("Unsupported eventId"));
    }
    const auth = getAuth();
    const owneruid = auth.currentUser?.uid as string;
    if ("ownerid" in newValues) {
      const { ownerid, ...rest } = newValues;
      newValues = rest;
    } 

    for (const key in newValues) {// undefined → "" に置き換える処理
      if (newValues[key] === undefined) {
        newValues[key] = "";
      }
    }
    
    newValues.updatetime = new Date().toISOString();
    return update(ref(fire_database, `${eventId}/${owneruid}`), newValues);
}

export async function deletePin(path: string) {
  const db = getDatabase();
  return remove(ref(db, path));
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
