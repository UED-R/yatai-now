import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";
import React, { useState } from "react";


// ----- 初期設定
const firebaseConfig = {
  apiKey: "AIzaSyAxxocdjMi0CkRYSwNlfa2chCE653Cqat8",
  authDomain: "yatai-now-test01.firebaseapp.com",
  projectId: "yatai-now-test01",
  storageBucket: "yatai-now-test01.firebasestorage.app",
  messagingSenderId: "585308141782",
  appId: "1:585308141782:web:4c1c1cbe228720dca2b177"
};
const app = initializeApp(firebaseConfig);
const fire_database = getDatabase(app);



// -----関数
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

const eventId = "0"; // テスト用


function writePinData(pinX_data:String, pinY_data:String, text_data:String){
  const pinId_data = getCurrentTimestamp();
  // json形式
  set(ref(fire_database, eventId), {
    pinId: pinId_data,
    pinX: pinX_data,
    pinY: pinY_data,
    text: text_data
  });
}

function readPinData(){
    get(child(ref(fire_database), `${eventId}/`)).then((snapshot) => {
    if (snapshot.exists()) {
        console.log(snapshot.val());
    } else {
        console.log("No data available");
    }
    }).catch((error) => {
        console.error(error);
    });
}


// -----メイン
const Db_header = () => {
  const [inputPinX, setInputPinX] = useState("");
  const [inputPinY, setInputPinY] = useState("");
  const [inputPinText, setInputPinText] = useState("");

  // -----ハンドラ
  const writePinData_handler = () =>{
    alert("DBに書き込みます");
    writePinData(inputPinX, inputPinY, inputPinText);
  }

  const readPinData_handler = () =>{
    alert("DBから読み込みます");
    
  }



  // -----HTML要素
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '40px' }}>
      <h2>データベースアクセス</h2>
      <p>X座標</p><input
        type="number"
        value={inputPinX}
        onChange={(e) => setInputPinX(e.target.value)}
      />
      <p>Y座標</p><input
        type="number"
        value={inputPinY}
        onChange={(e) => setInputPinY(e.target.value)}
      />
      <p>テキスト</p><input
        type="text"
        value={inputPinText}
        onChange={(e) => setInputPinText(e.target.value)}
      />

      <button onClick={writePinData_handler}>データベース書き込み</button>
      <button onClick={readPinData_handler}>データベース読み込み</button>
    </div>
  )
}

export default Db_header