import React, { useState } from "react";
import { writePinData, readPinData } from '../dbaccess'

type Pin = { id: number; x: number; y: number; text?: string };


interface PinInformationProps {
  pin: Pin;
  onClose: () => void;
  onSave: (id: number, text: string) => void;
  onDelete: (id: number) => void; // ← 追加：削除用 callback
}

export default function PinInformation({ pin, onClose, onSave, onDelete }: PinInformationProps) {
  const [description, setDescription] = useState(pin.text || "");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          textAlign: "center",
          minWidth: "280px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>📍 ピン情報</h3>

        {/* サークルでピン表示 */}
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "red",
            margin: "10px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {pin.id}
        </div>

        {/* 座標表示 */}
        <p>X座標: {pin?.x?.toFixed(2) ?? "N/A"}</p>
        <p>Y座標: {pin?.y?.toFixed(2) ?? "N/A"}</p>
        
        {/* 説明テキスト欄 */}
        <p>サークル名称</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="サークルの名前を入力してください"
          style={{
            width: "100%",
            height: "60px",
            marginTop: "10px",
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "none",
          }}
        />

        <p>サークル概要</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="サークルの説明を入力してください"
          style={{
            width: "100%",
            height: "60px",
            marginTop: "10px",
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "none",
          }}
        />
        
        {/* ボタン：ない・残りわずか・ある */}
        
        <p>ない</p> <p>残りわずか</p> <p>ある</p>
        <p>混雑情報</p>

        {/* ボタン：消去・閉じる・保存 */}
        <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => {
              onDelete(pin.id); // ← 削除処理
              onClose();        // モーダル閉じる
            }}
            style={{
              padding: "6px 12px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            消去
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "6px 12px",
              background: "gray",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            閉じる
          </button>

          <button
            onClick={() => {
              onSave(pin.id, description); // 保存
              onClose(); // モーダルを閉じる
            }}
            style={{
              padding: "6px 12px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
