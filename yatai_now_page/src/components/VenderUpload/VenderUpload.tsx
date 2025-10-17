import { useState } from "react";
import "./PinInput.css";

type PinInputProps = {
  eventId: string | number;
  writePinData: (eventId: string | number, x: number, y: number, text: string) => void;
};

export default function PinInput({ eventId, writePinData }: PinInputProps) {
  const [inputPinX, setInputPinX] = useState("");
  const [inputPinY, setInputPinY] = useState("");
  const [inputPinText, setInputPinText] = useState("");

  // 送信ボタン
  const handleSubmit = () => {
    if (!inputPinX || !inputPinY || !inputPinText) {
      alert("全ての項目を入力してください");
      return;
    }

    writePinData(eventId, Number(inputPinX), Number(inputPinY), inputPinText);
    alert("送信しました！");
  };

  // 削除ボタン
  const handleClear = () => {
    setInputPinX("");
    setInputPinY("");
    setInputPinText("");
  };

  return (
    <div className="pin-input-container">
      <h2>ピン情報を入力</h2>
      <div className="input-group">
        <label>X座標</label>
        <input
          type="number"
          value={inputPinX}
          onChange={(e) => setInputPinX(e.target.value)}
          placeholder="例: 36.11025"
        />
      </div>

      <div className="input-group">
        <label>Y座標</label>
        <input
          type="number"
          value={inputPinY}
          onChange={(e) => setInputPinY(e.target.value)}
          placeholder="例: 140.10238"
        />
      </div>

      <div className="input-group">
        <label>ピンの説明</label>
        <input
          type="text"
          value={inputPinText}
          onChange={(e) => setInputPinText(e.target.value)}
          placeholder="例: 屋台の場所"
        />
      </div>

      <div className="button-group">
        <button className="btn submit" onClick={handleSubmit}>送信</button>
        <button className="btn delete" onClick={handleClear}>削除</button>
      </div>
    </div>
  );
}