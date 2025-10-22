import { useState } from 'react';
import { writePinData } from './database/dbaccess';
import './App.css'; // グローバルCSSをインポート

// 新しいフォルダ構成に合わせてコンポーネントをインポート
import EventSelect from './components/EventSelect/EventSelect';
import Main from './components/Main/Main';
import OrganizerLogin from './components/OrganizerLogin/OrganizerLogin';
import VenderLogin from './components/VenderLogin/VenderLogin';
import VenderUpload from './components/VenderUpload/VenderUpload';
// import MapUpload from './components/MapUpload/MapUpload';
import LeafMap from './components/LeafMap/LeafMap';

// 表示する画面の種類を管理する型
type ScreenType = 'event_select' | 'main' | 'organizer_login' | 'leafmap' | 'vender_login' | 'vender_upload' | 'map_upload';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('event_select');

  // 各画面への遷移を実行する関数
  const showEventSelect = () => setCurrentScreen('event_select');
  // const showMain = () => setCurrentScreen('main');
  const showLeafMap = () => setCurrentScreen('leafmap');
  const showOrganizerLogin = () => setCurrentScreen('organizer_login');
  const showVendorLogin = () => setCurrentScreen('vender_login');
  const showVenderUpload = () => setCurrentScreen('vender_upload');
  // const showMapUpload = () => setCurrentScreen('map_upload');
  
  // `currentScreen` の状態に応じて表示するコンポーネントを切り替える
  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return <Main onBack={showEventSelect} onShowOrganizerLogin={showOrganizerLogin} onShowVendorLogin={showVendorLogin} />;
      case 'organizer_login':
        return <OrganizerLogin onBack={showLeafMap} onLoginSuccess={showLeafMap} />;
      case 'vender_login':
        return <VenderLogin onBack={showLeafMap} onLoginSuccess={showVenderUpload} />;
      case 'leafmap':
        return <LeafMap onBack={showEventSelect} onShowOrganizerLogin={showOrganizerLogin} onShowVendorLogin={showVendorLogin} />;
      case 'vender_upload':
        return <VenderUpload 
                  onBack={showLeafMap} 
                  eventId="0" // イベントIDを渡す (将来的には動的に)
                  writePinData={writePinData} // DB書き込み関数を渡す
               />;
    
        // case 'map_upload':
      //   return <MapUpload onBack={showOrganizerLogin} />;
      case 'event_select':
      default:
        return <EventSelect onNavigateToMap={showLeafMap} />;
    }
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}

export default App;

