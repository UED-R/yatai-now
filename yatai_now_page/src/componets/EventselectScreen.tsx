import { useState } from "react";
import mapPin from "./public/map_pin.png"; // ピン画像 (public や image フォルダに置く)

type Pin = { id: number; x: number; y: number };

export default function PinSystem() {
  const [pins, setPins] = useState<Pin[]>([]);

  // クリックでピンを追加
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPins((prev) => [
      ...prev,
      { id: Date.now(), x, y }
    ]);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        overflow: "hidden",
      }}
      onClick={handleClick}
    >
      {/* ピン表示 */}
      {pins.map((pin) => (
        <img
          key={pin.id}
          src={mapPin}
          alt="pin"
          style={{
            position: "absolute",
            left: pin.x - 12, // ピンの中心を合わせる調整
            top: pin.y - 24, // ピンの先端を合わせる調整
            width: "24px",
            height: "24px",
            pointerEvents: "none", // ピンの上でもクリックを通す
          }}
        />
      ))}
    </div>
  );
}
