import { useState } from 'react';
import './App.css'; // グローバルCSSをインポート

// 新しいフォルダ構成に合わせてコンポーネントをインポート
import EventSelect from './components/EventSelect/EventSelect';
import Main from './components/Main/Main';
import OrganizerLogin from './components/OrganizerLogin/OrganizerLogin';
import VenderLogin from './components/VenderLogin/VenderLogin';
// import MapUpload from './components/MapUpload/MapUpload';


// 表示する画面の種類を管理する型
type ScreenType = 'event_select' | 'main' | 'organizer_login' | 'vender_login' | 'map_upload';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('event_select');

  // 各画面への遷移を実行する関数
  const showEventSelect = () => setCurrentScreen('event_select');
  const showMain = () => setCurrentScreen('main');
  const showOrganizerLogin = () => setCurrentScreen('organizer_login');
  const showVendorLogin = () => setCurrentScreen('vender_login');
  const showMapUpload = () => setCurrentScreen('map_upload');
  
  // `currentScreen` の状態に応じて表示するコンポーネントを切り替える
  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return <Main onBack={showEventSelect} onShowOrganizerLogin={showOrganizerLogin} onShowVendorLogin={showVendorLogin} />;
      case 'organizer_login':
        return <OrganizerLogin onBack={showMain} onLoginSuccess={showMapUpload} />;
      case 'vender_login':
        return <VenderLogin onBack={showMain} onLoginSuccess={showMain} />;
      // case 'map_upload':
      //   return <MapUpload onBack={showOrganizerLogin} />;
      case 'event_select':
      default:
        return <EventSelect onNavigateToMap={showMain} />;
    }
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}

export default App;

