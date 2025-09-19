import { useState } from 'react';
import './App.css';
import Map1Screen from './components/map1';
// ▼▼ 新しく作成したログインページをインポート ▼▼
import OrganizerLoginScreen from './components/Organizer_login';

// ▼▼ 管理する画面の種類に 'organizer_login' を追加 ▼▼
type ScreenType = 'map1' | 'organizer_login';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('map1');

  const showMap1 = () => setCurrentScreen('map1');
  const showOrganizerLogin = () => setCurrentScreen('organizer_login');

  // ▼▼ 表示する画面を切り替えるロジックを更新 ▼▼
  const renderScreen = () => {
    switch (currentScreen) {
      case 'organizer_login':
        return <OrganizerLoginScreen onBack={showMap1} />;
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

