import { useState, useEffect } from "react";
import PinInformation from "./PinInformation"

type Pin = { id: number; x: number; y: number; text?: string };

export default function PinSystem() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [mode, setMode] = useState<"view" | "add">("view"); // ← モード追加
  const [pinToDelete, setPinToDelete] = useState<Pin | null>(null); // ← 削除対象のピン

  // ページ読み込み時に localStorage からデータを読み込む
  useEffect(() => {
    const stored = localStorage.getItem("pins");
    if (stored) {
      setPins(JSON.parse(stored));
    }
  }, []);

  // pins が変わるたびに保存
  useEffect(() => {
    localStorage.setItem("pins", JSON.stringify(pins));
  }, [pins]);

  // ピン追加（設置モードのみ動作）
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "add") return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const newPin: Pin = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text: "",
    };
    setPins([...pins, newPin]);
  };

  // ピン削除
  const handleDelete = (id: number) => {
    setPins(pins.filter((pin) => pin.id !== id));
    setPinToDelete(null);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* モード切り替えボタン */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setMode(mode === "view" ? "add" : "view")}
          style={{
            padding: "8px 16px",
            background: mode === "add" ? "green" : "gray",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {mode === "add" ? "📍 ピン設置モード" : "👀 閲覧モード"}
        </button>
      </div>

      {/* 背景マップ */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background:
            "url(https://res.cloudinary.com/dkmhcpr7i/image/upload/v1758176187/tsukubamap_id01.jpg)",
          backgroundSize: "cover",
        }}
        onClick={handleClick}
      >
        {/* ピン表示 */}
        {pins.map((pin) => (
          <img
            key={pin.id}
            src="./map_pin.png"
            alt="ピン"
            style={{
              position: "absolute",
              left: pin.x - 3.5,
              top: pin.y - 3.5,
              width: "7px",
              height: "7px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (mode === "add") {
                // 設置モードのときは削除確認
                setPinToDelete(pin);
              }
            }}
          />
        ))}
      </div>

      {/* ピンの中身 */}
     {pinToDelete && (
      <PinInformation
        pin={pinToDelete}
        onClose={() => setPinToDelete(null)}
      />
    )}
      </div>
  );
}
