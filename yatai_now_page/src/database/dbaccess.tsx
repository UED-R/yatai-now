import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAxxocdjMi0CkRYSwNlfa2chCE653Cqat8",
  authDomain: "yatai-now-test01.firebaseapp.com",
  databaseURL: "https://yatai-now-test01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "yatai-now-test01",
  storageBucket: "yatai-now-test01.appspot.com",
  messagingSenderId: "585308141782",
  appId: "1:585308141782:web:4c1c1cbe228720dca2b177"
};

const app = initializeApp(firebaseConfig);
const fire_database = getDatabase(app);

function getCurrentTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}_${hour}${minute}${second}`;
}

export function writePinData(eventId: string, pinX: number, pinY: number, text: string) {
  const pinId = getCurrentTimestamp();
  return set(ref(fire_database, `${eventId}/${pinId}`), { pinX, pinY, text });
}

export async function readPinData(eventId: string) {
  const snapshot = await get(child(ref(fire_database), eventId));
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  } else {
    return [];
  }
}
