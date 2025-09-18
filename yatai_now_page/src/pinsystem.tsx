import { useState, useEffect } from "react";

type Pin = { id: number; x: number; y: number; text?: string };

export default function PinSystem() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [draftText, setDraftText] = useState("");

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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const newPin: Pin = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text: "",
    };
    setPins([...pins, newPin]);
  };

  const handleDelete = (id: number) => {
    setPins(pins.filter((pin) => pin.id !== id));
    setSelectedPin(null);
  };

  const handleSave = () => {
    if (!selectedPin) return;
    setPins(
      pins.map((pin) =>
        pin.id === selectedPin.id ? { ...pin, text: draftText } : pin
      )
    );
    setSelectedPin({ ...selectedPin, text: draftText });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "80vh",
        background:
          "url(https://res.cloudinary.com/dkmhcpr7i/image/upload/v1758176187/tsukubamap_id01.jpg)",
        backgroundSize: "cover",
      }}
      onClick={handleClick}
    >
      {/* ピン表示 */}
      {pins.map((pin) => (
        <div
          key={pin.id}
          style={{
            position: "absolute",
            left: pin.x - 12,
            top: pin.y - 12,
            width: "24px",
            height: "24px",
            background: "red",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPin(pin);
            setDraftText(pin.text || "");
          }}
        />
      ))}

      {/* 詳細画面 */}
      {selectedPin && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "white",
            padding: "12px",
            border: "1px solid #aaa",
            borderRadius: "8px",
            width: "200px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p>ピンの詳細</p>
          <p>
            X: {selectedPin.x}, Y: {selectedPin.y}
          </p>
          <textarea
            style={{ width: "100%", minHeight: "60px" }}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
          />
          <button
            style={{ marginTop: "8px", marginRight: "8px" }}
            onClick={handleSave}
          >
            保存
          </button>
          <button
            style={{
              marginTop: "8px",
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
      )}
    </div>
  );
}
