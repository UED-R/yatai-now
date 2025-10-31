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
      <TransformWrapper
        initialScale={0.5}
        minScale={0.5}
        maxScale={8}
        wheel={{ step: 0.2 }}
        limitToBounds={true}
        doubleClick={{ disabled: true }}
        // centerZoomedOut={true}
        centerOnInit={true}
      >
        <TransformComponent
          wrapperClass='map-area'
          contentClass='map-content-vector'>
            <img src={ICON} alt="map" className='map-svg'/>
            <img src={PIN} className='map-pin'/>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default Main;