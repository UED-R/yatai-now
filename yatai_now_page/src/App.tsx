import { useState } from 'react';
import type {MouseEvent, TouchEvent, FormEvent} from 'react';
// import { useState, MouseEvent, TouchEvent, FormEvent } from 'react';
import './App.css'; // App.cssをインポート

// アップロード画面コンポーネントを読み込む
import MapsUpload from './componets/pages/MapUpload';

// 表示する画面の種類を定義
type ScreenType = 'home' | 'map' | 'login' | 'upload';

function App() {
  // 現在表示している画面を管理する状態
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  
  // --- マップ操作のための状態管理（マップ画面でのみ使用） ---
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // --- 画面遷移の関数 ---
  const showMap = () => {
    setScale(1); // マップ表示時に拡大率と位置をリセット
    setPosition({ x: 0, y: 0 });
    setCurrentScreen('map');
  };

  const showLogin = () => {
    setCurrentScreen('login');
  };

  const showHome = () => {
    setCurrentScreen('home');
  };

  const mapsUpload = () => {
    setCurrentScreen('upload')
  };

  // --- マップ操作の関数 ---
  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5));
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX - position.x, y: clientY - position.y });
  };
  const handleDragMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      setPosition({ x: clientX - startPos.x, y: clientY - startPos.y });
    }
  };
  const handleDragEnd = () => setIsDragging(false);
  const handleMouseDown = (e: MouseEvent) => handleDragStart(e.clientX, e.clientY);
  const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
  const handleTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);

  // ログインフォームの送信処理（ページリロードを防止）
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    // ここに実際のログイン処理を記述します
    console.log('ログイン試行');
    // 例: alert('ログインしました！');
  };

  // --- 表示する画面のコンポーネントを決定 ---
  if (currentScreen === 'map') {
    return (
      // --- マップ画面 ---
      <div className="screen">
        <h2>会場マップ</h2>
        <div className="map-container">
          <img 
            src="https://res.cloudinary.com/dkmhcpr7i/image/upload/v1758176187/tsukubamap_id01.jpg" 
            alt="会場マップ" 
            className="map-image" 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleDragEnd}
            draggable="false"
          />
        </div>
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={handleZoomIn}>+</button>
          <button className="zoom-btn" onClick={handleZoomOut}>-</button>
        </div>
        <button className="btn" onClick={showHome} style={{ marginTop: '20px' }}>
          戻る
        </button>
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      // --- ログイン画面 ---
      <div className="screen">
        <h2>ログイン</h2>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <input className="login-input" type="text" placeholder="ログインID" required />
          <input className="login-input" type="password" placeholder="パスワード" required />
          <button className="btn" type="submit">ログイン</button>
        </form>
        <button className="btn btn-secondary" onClick={showHome}>
          最初のページに戻る
        </button>
      </div>
    );
  }

    // ★ 追加：upload 画面の分岐
  if (currentScreen === 'upload') {
    return (
      <div className="screen">
        {/* 戻るボタン（好きな場所に置いてOK） */}
        <button className="btn btn-secondary" onClick={() => setCurrentScreen('home')} style={{ marginBottom: 16 }}>
          最初のページに戻る
        </button>

        {/* アップロード画面をそのまま表示 */}
        <MapsUpload />
      </div>
    );
  }

  return (
    // --- ホーム画面 ---
    <div className="screen">
      <h1>屋台なう！</h1>
      <div className="button-container">
        <button className="btn" onClick={mapsUpload}>主催者はこちら</button>
        <button className="btn" onClick={showLogin}>出店者はこちら</button>
        <button className="btn" onClick={showMap}>参加者はこちら</button>
      </div>
    </div>
  );
}

export default App;

