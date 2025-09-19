import { useState, useEffect } from "react";
import mapPin from "./image/map_pin.png";

type Pin = { id: number; x: number; y: number; text?: string };

export default function PinSystem() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [draftText, setDraftText] = useState("");
  const [scale, setScale] = useState(1); // 拡大縮小率

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

  // ピン設置（scale補正あり）
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();

    // scale補正：拡縮後のクリック位置を元の座標系に変換
    const offsetX = (e.clientX - rect.left) / scale;
    const offsetY = (e.clientY - rect.top) / scale;

    const newPin: Pin = {
      id: Date.now(),
      x: offsetX,
      y: offsetY,
      text: "",
    };
    setPins([...pins, newPin]);
  };

  // ピン削除
  const handleDelete = (id: number) => {
    setPins(pins.filter((pin) => pin.id !== id));
    setSelectedPin(null);
  };

  // ピン保存
  const handleSave = () => {
    if (!selectedPin) return;
    setPins(
      pins.map((pin) =>
        pin.id === selectedPin.id ? { ...pin, text: draftText } : pin
      )
    );
    setSelectedPin({ ...selectedPin, text: draftText });
  };

  )}
      </div>

      {/* 詳細画面（ズームの影響を受けないように fixed にする） */}
      {selectedPin && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "white",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "200px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p>ピンの詳細</p>
          <p>
            X: {Math.round(selectedPin.x)}, Y: {Math.round(selectedPin.y)}
          </p>
          <textarea
            style={{ width: "100%", minHeight: "60px" }}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
          />
          <div style={{ marginTop: "8px" }}>
            <button onClick={handleSave} style={{ marginRight: "8px" }}>
              保存
            </button>
            <button
              style={{
                padding: "4px 8px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => handleDelete(selectedPin.id)}
            >
              削除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
