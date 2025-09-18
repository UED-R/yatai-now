import { useState } from 'react';
import type {MouseEvent, TouchEvent} from 'react';
import './App.css'; // App.cssをインポート
import PinSystem from "./PinSystem";

function App() {
  const [isMapVisible, setIsMapVisible] = useState(false);
  
  // --- マップ操作のための状態管理 ---
  const [scale, setScale] = useState(1); // 拡大率
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 表示位置
  const [isDragging, setIsDragging] = useState(false); // ドラッグ中かどうかのフラグ
  const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // ドラッグ開始時のカーソル位置

  // マップ表示時に拡大率と位置をリセットする
  const showMap = () => {
    setIsMapVisible(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const hideMap = () => {
    setIsMapVisible(false);
  };

  // --- 拡大・縮小の処理 ---
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale * 1.2, 5)); // 最大5倍まで
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale / 1.2, 0.5)); // 最小0.5倍まで
  };

  // --- ドラッグ（パン）操作の処理 ---
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - startPos.x,
      y: clientY - startPos.y,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // --- イベントハンドラ ---
  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => handleDragStart(e.clientX, e.clientY);
  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => handleDragMove(e.clientX, e.clientY);
  const handleTouchStart = (e: TouchEvent<HTMLImageElement>) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: TouchEvent<HTMLImageElement>) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);


  return (
    isMapVisible ? (
      // --- マップ画面 ---
      <div className="screen">
        <h2>会場マップ</h2>
        {/* マップ画像を囲むコンテナ */}
        <div className="map-container">
          <img 
            src="https://res.cloudinary.com/dkmhcpr7i/image/upload/v1758176187/tsukubamap_id01.jpg" 
            alt="会場マップのサンプル画像" 
            className="map-image" 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            // マウス操作イベント
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            // タッチ操作イベント
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
            draggable="false" // デフォルトの画像ドラッグを無効化
          />
        </div>
        {/* 拡大・縮小ボタン */}
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={handleZoomIn}>+</button>
          <button className="zoom-btn" onClick={handleZoomOut}>-</button>
        </div>
        <button className="btn" onClick={hideMap} style={{ marginTop: '20px' }}>
          戻る
        </button>
        <div>
        <h1>ピン機能テスト</h1>
        <PinSystem />
        </div>
      </div>
      
    ) : (
      // --- ホーム画面 ---
      <div className="screen">
        <h1>屋台なう！</h1>
        <div className="button-container">
          <button className="btn">主催者はこちら</button>
          <button className="btn">出店者はこちら</button>
          <button className="btn" onClick={showMap}>
            参加者はこちら
          </button>
        </div>
      </div>
    )
  );
}

export default App;