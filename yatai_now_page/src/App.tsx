import { useState } from 'react';
import './App.css';
import Map1Screen from './components/map1';
// ▼▼ ファイル名の変更を反映 ▼▼
import OrganizerLoginScreen from './components/OrganizerLogin';
import MapUploadScreen from './components/MapUpload';
import VendorLoginScreen from './components/VendorLogin';

type ScreenType = 'map1' | 'organizer_login' | 'map_upload' | 'vendor_login';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('map1');

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
        // ログイン成功後はmap1に戻る（仮の遷移先）
        return <VendorLoginScreen onBack={showMap1} onLoginSuccess={showMap1} />;
      case 'map1':
      default:
        return <Map1Screen onShowOrganizerLogin={showOrganizerLogin} onShowVendorLogin={showVendorLogin} />;
    }
  };
  
  return (
    <>
      {renderScreen()}
    </>
  );
}

export default App;

