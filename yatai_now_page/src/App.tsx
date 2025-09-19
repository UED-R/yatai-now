import { useState } from 'react';
import './App.css';
import Map1Screen from './components/map1';
import OrganizerLoginScreen from './components/OrganizerLogin';
import MapUploadScreen from './components/MapUpload';
import VendorLoginScreen from './components/VendorLogin';
// ▼▼ 新しく作成したイベント選択ページをインポート ▼▼
import EventSelectScreen from './components/EventselectScreen';

// ▼▼ 管理する画面の種類に 'event_select' を追加 ▼▼
type ScreenType = 'event_select' | 'map1' | 'organizer_login' | 'map_upload' | 'vendor_login';

function App() {
  // ▼▼ 初期画面を 'event_select' に変更 ▼▼
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('event_select');

  const showEventSelect = () => setCurrentScreen('event_select');
  const showMap1 = () => setCurrentScreen('map1');
  const showOrganizerLogin = () => setCurrentScreen('organizer_login');
  const showMapUpload = () => setCurrentScreen('map_upload');
  const showVendorLogin = () => setCurrentScreen('vendor_login');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'map_upload':
        return <MapUploadScreen onBack={showOrganizerLogin} />;
      case 'organizer_login':
        return <OrganizerLoginScreen onBack={showMap1} onLoginSuccess={showMapUpload} />;
      case 'vendor_login':
        return <VendorLoginScreen onBack={showMap1} onLoginSuccess={showMap1} />;
      case 'map1':
        // ▼▼ 戻るボタンの遷移先をイベント選択画面に変更 ▼▼
        return <Map1Screen onShowOrganizerLogin={showOrganizerLogin} onShowVendorLogin={showVendorLogin} onBack={showEventSelect} />;
      case 'event_select':
      default:
        // ▼▼ イベント選択画面を表示し、ボタン用にmap1への遷移関数を渡す ▼▼
        return <EventSelectScreen onNavigateToMap={showMap1} />;
    }
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}

export default App;

