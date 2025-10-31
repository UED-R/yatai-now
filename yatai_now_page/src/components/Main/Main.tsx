import { useState } from "react";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ICON from '../../image/map_test2.svg';
import PIN from '../../image/pin400x300.png';
import './Main.css';

// Propsの型定義
type MainProps = {
  onShowOrganizerLogin: () => void;
  onShowVendorLogin: () => void;
  onBack: () => void;
};

type PinData = {
  id: number;
  x: number; // マップ上での位置（%指定をおすすめ）
  y: number;
  name: string;
  description: string;
};

const pinList: PinData[] = [
  { id: 1, x: 600, y: 600, name: "たこ焼き屋", description: "新作！イカ入りたこ焼き！" },
  { id: 2, x: 700, y: 800, name: "クレープ屋", description: "チョトバカナクレープ" },
];

function Main({ onShowOrganizerLogin, onShowVendorLogin, onBack }: MainProps) {
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  return (
    <div className="screen main-screen">
      <header className="main-header">
        <button className="btn-back" onClick={onBack}>&lt; 戻る</button>
        <div className="header-right-buttons">
          <button className="btn-header" onClick={onShowOrganizerLogin}>主催者はこちら</button>
          <button className="btn-header" onClick={onShowVendorLogin}>出店者はこちら</button>
        </div>
      </header>
      <TransformWrapper
        initialScale={0.5}
        minScale={0.5}
        maxScale={8}
        wheel={{ step: 0.5 }}
        limitToBounds={true}
        doubleClick={{ disabled: true }}
        centerOnInit={true}
      >
        <TransformComponent
          wrapperClass='map-area'
          contentClass='map-content-vector'>
          <div  onClick={() => setSelectedPin(null)}>
            <img src={ICON} alt="map" className='map-svg'/>
          </div>
          {pinList.map((pin) => (
            <div
              key={pin.id}
              className={`pin-box`}
              style={{
                left: `${pin.x}px`,
                top: `${pin.y}px`
              }}
              onClick={() => setSelectedPin(pin)}
            >
              <img src={PIN} alt="pin" className="map-pin"/>
            </div>
          ))}
          {selectedPin && (
            <div
              style={{
                position: "absolute",
                left: `${selectedPin.x+40}px`,
                top: `${selectedPin.y+40}px`,
                backgroundColor: 'white'
              }}
              onClick={() => setSelectedPin(null)}
            >
              <h3>{selectedPin.name}</h3>
              <p>{selectedPin.description}</p>
            </div>
          )}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default Main;