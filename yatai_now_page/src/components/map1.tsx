import { useState, useEffect, useRef, useCallback } from 'react';
import type { MouseEvent } from 'react';

// ... (ファイル上部の型定義などは変更なし) ...
type PinData = {
  pinID: string;
  pinx: number;
  piny: number;
  text: string;
};
type ApiResponse = {
  eventid: PinData[];
};
const mockApiResponse: ApiResponse = {
  eventid: [
    { pinID: '001', pinx: 25, piny: 30, text: '中央図書館前の広場で焼きそばを販売しています！' },
    { pinID: '002', pinx: 60, piny: 45, text: '3A棟前にて、サークル活動の展示を行っています。' },
    { pinID: '003', pinx: 75, piny: 70, text: 'ステージイベント開催中！次の出演は13:00からです。' },
  ],
};
// -----------------------------------------

// ▼▼ 親から受け取るPropsの型定義を更新 ▼▼
type Map1ScreenProps = {
  onShowOrganizerLogin: () => void;
  onShowVendorLogin: () => void;
};

// ▼▼ Propsを受け取るように関数の引数を変更 ▼▼
function Map1Screen({ onShowOrganizerLogin, onShowVendorLogin }: Map1ScreenProps) {
  const [pins, setPins] = useState<PinData[]>([]);
  // ... (ファイル中盤のstateや関数は変更なし) ...
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  const [viewState, setViewState] = useState({
    scale: 1,
    position: { x: 0, y: 0 },
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const mapAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPins(mockApiResponse.eventid);
  }, []);

  const handleWheel = useCallback((e: globalThis.WheelEvent) => {
    e.preventDefault();
    const rect = mapAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const zoomFactor = 1 - e.deltaY * 0.01;
    setViewState(prev => {
      const newScale = Math.max(1, Math.min(prev.scale * zoomFactor, 5));
      const pointX = (mouseX - prev.position.x) / prev.scale;
      const pointY = (mouseY - prev.position.y) / prev.scale;
      const newX = mouseX - pointX * newScale;
      const newY = mouseY - pointY * newScale;
      return {
        scale: newScale,
        position: { x: newX, y: newY },
      };
    });
  }, []);

  useEffect(() => {
    const mapArea = mapAreaRef.current;
    mapArea?.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      mapArea?.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);


  const handlePinClick = (e: MouseEvent, pin: PinData) => {
    e.stopPropagation();
    setSelectedPin(pin);
  };
  const handleBackClick = () => {
    alert('戻るボタンが押されました');
  };
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: clientX - viewState.position.x,
      y: clientY - viewState.position.y,
    };
    setSelectedPin(null);
  };
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const newX = clientX - dragStartPos.current.x;
    const newY = clientY - dragStartPos.current.y;
    setViewState(prev => ({ ...prev, position: { x: newX, y: newY } }));
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="screen event-screen">
      <header className="event-header">
        <button className="btn-back" onClick={handleBackClick}>&lt; 戻る</button>
        <div className="header-right-buttons">
          <button className="btn-header" onClick={onShowOrganizerLogin}>主催者はこちら</button>
          {/* ▼▼ ボタンにonClickイベントを追加 ▼▼ */}
          <button className="btn-header" onClick={onShowVendorLogin}>出店者はこちら</button>
        </div>
      </header>
      
      <div 
        ref={mapAreaRef}
        className="map-area" 
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className="map-content" 
          style={{ transform: `translate(${viewState.position.x}px, ${viewState.position.y}px) scale(${viewState.scale})` }}
        >
          <img 
            src="https://res.cloudinary.com/dkmhcpr7i/image/upload/v1758176187/tsukubamap_id01.jpg" 
            alt="会場マップ"
            className="map-image"
            draggable="false"
          />
          {pins.map((pin) => (
            <button 
              key={pin.pinID} 
              className={`map-pin ${selectedPin?.pinID === pin.pinID ? 'selected' : ''}`}
              style={{ left: `${pin.pinx}%`, top: `${pin.piny}%` }}
              onClick={(e) => handlePinClick(e, pin)}
              aria-label={`Pin ${pin.pinID}`}
            />
          ))}
        </div>
      </div>
      {selectedPin && (
        <footer className="info-footer"><p>{selectedPin.text}</p></footer>
      )}
    </div>
  );
}

export default Map1Screen;

