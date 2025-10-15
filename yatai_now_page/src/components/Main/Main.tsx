import { useState, useEffect, useRef, useCallback } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import { readPinData } from '../../database/dbaccess'; // パスを更新
import './Main.css'; // 専用CSSをインポート

type PinData = {
  pinX: number;
  pinY: number;
  text: string;
};

type MainProps = {
  onShowOrganizerLogin: () => void;
  onShowVendorLogin: () => void;
  onBack: () => void;
};

function Main({ onShowOrganizerLogin, onShowVendorLogin, onBack }: MainProps) {
  const [pins, setPins] = useState<PinData[]>([]);
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  const [viewState, setViewState] = useState({ scale: 1, position: { x: 0, y: 0 } });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const mapAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPins = async () => {
      const eventId = 'sohosai-2025';
      const pinsDataFromDb = await readPinData(eventId) as PinData[];
      if (pinsDataFromDb) {
        setPins(pinsDataFromDb);
      }
    };
    fetchPins();
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
      return { scale: newScale, position: { x: newX, y: newY } };
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

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartPos.current = { x: clientX - viewState.position.x, y: clientY - viewState.position.y };
    setSelectedPin(null);
  };
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const newX = clientX - dragStartPos.current.x;
    const newY = clientY - dragStartPos.current.y;
    setViewState(prev => ({ ...prev, position: { x: newX, y: newY } }));
  };
  const handleDragEnd = () => setIsDragging(false);

  return (
    <div className="screen main-screen">
      <header className="main-header">
        <button className="btn-back" onClick={onBack}>&lt; 戻る</button>
        <div className="header-right-buttons">
          <button className="btn-header" onClick={onShowOrganizerLogin}>主催者はこちら</button>
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
        <div className="map-content" style={{ transform: `translate(${viewState.position.x}px, ${viewState.position.y}px) scale(${viewState.scale})` }}>
          <img src="https://res.cloudinary.com/dkmhcpr7i/image/upload/v1758176187/tsukubamap_id01.jpg" alt="会場マップ" className="map-image" draggable="false" />
          {pins.map((pin, index) => (
            <button key={index} className={`map-pin ${selectedPin === pin ? 'selected' : ''}`} style={{ left: `${pin.pinX}%`, top: `${pin.pinY}%` }} onClick={(e) => handlePinClick(e, pin)} aria-label={`Pin ${pin.text}`} />
          ))}
        </div>
      </div>
      {selectedPin && (<footer className="info-footer"><p>{selectedPin.text}</p></footer>)}
    </div>
  );
}

export default Main;
