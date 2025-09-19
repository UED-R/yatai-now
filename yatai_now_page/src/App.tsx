import { useState } from 'react';
import './App.css';
import Map1Screen from './components/map1';
import OrganizerLoginScreen from './components/OrganizerLogin';
// ▼▼ 新しく作成したアップロードページをインポート ▼▼
import MapUploadScreen from './components/MapUpload';

// ▼▼ 管理する画面の種類に 'map_upload' を追加 ▼▼
type ScreenType = 'map1' | 'organizer_login' | 'map_upload';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('map1');

  const showMap1 = () => setCurrentScreen('map1');
  const showOrganizerLogin = () => setCurrentScreen('organizer_login');
  // ▼▼ 新しい画面への遷移関数を追加 ▼▼
  const showMapUpload = () => setCurrentScreen('map_upload');

  const renderScreen = () => {
    switch (currentScreen) {
      // ▼▼ map_upload画面の表示ロジックを追加 ▼▼
      case 'map_upload':
        return <MapUploadScreen onBack={showOrganizerLogin} />; // 戻るボタンでログイン画面へ
      case 'organizer_login':
        // ▼▼ ログイン成功時にMapUpload画面へ遷移する関数を渡す ▼▼
        return <OrganizerLoginScreen onBack={showMap1} onLoginSuccess={showMapUpload} />;
      case 'map1':
      default:
        return <Map1Screen onShowOrganizerLogin={showOrganizerLogin} />;
    }
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}

export default App;

