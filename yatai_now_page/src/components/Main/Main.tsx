import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
// ▼▼▼ この行を修正しました ▼▼▼
import TsukubaMap from '../../image/map_test2.svg?react';
import './Main.css';

// Propsの型定義
type MainProps = {
  onShowOrganizerLogin: () => void;
  onShowVendorLogin: () => void;
  onBack: () => void;
};

function Main({ onShowOrganizerLogin, onShowVendorLogin, onBack }: MainProps) {
  return (
    <div className="screen main-screen">
      <header className="main-header">
        <button className="btn-back" onClick={onBack}>&lt; 戻る</button>
        <div className="header-right-buttons">
          <button className="btn-header" onClick={onShowOrganizerLogin}>主催者はこちら</button>
          <button className="btn-header" onClick={onShowVendorLogin}>出店者はこちら</button>
        </div>
      </header>
      
      <div className="map-area">
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={5}
          limitToBounds={true}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            <div className="map-content-vector">
              {/* ▼▼▼ SVGコンポーネントをそのまま使います ▼▼▼ */}
              <TsukubaMap className="map-svg" />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}

export default Main;