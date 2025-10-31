import { useState } from 'react';
import './App.css'; // グローバルCSSをインポート

// 新しいフォルダ構成に合わせてコンポーネントをインポート
import EventSelect from './components/EventSelect/EventSelect';
import Main from './components/Main/Main';
import OrganizerLogin from './components/OrganizerLogin/OrganizerLogin';
import VenderLogin from './components/VenderLogin/VenderLogin';
// import MapUpload from './components/MapUpload/MapUpload';
import LeafMap from './components/LeafMap/LeafMap';

// 表示する画面の種類を管理する型
type ScreenType = 'event_select' | 'main' | 'organizer_login' | 'leafmap1' |'leafmap0' | 'vender_login' | 'vender_upload' | 'map_upload';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('event_select');

  // 各画面への遷移を実行する関数
  const showEventSelect = () => setCurrentScreen('event_select');
  const showMain = () => setCurrentScreen('main');
  const showLeafMap0 = () => setCurrentScreen('leafmap0');
  const showLeafMap1 = () => setCurrentScreen('leafmap1');
  const showOrganizerLogin = () => setCurrentScreen('organizer_login');
  const showVendorLogin = () => setCurrentScreen('vender_login');
  const showVenderUpload = () => setCurrentScreen('vender_upload');
  
  // `currentScreen` の状態に応じて表示するコンポーネントを切り替える
  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return <Main onBack={showEventSelect} onShowOrganizerLogin={showOrganizerLogin} onShowVendorLogin={showVendorLogin} />;
      case 'organizer_login':
        return <OrganizerLogin onBack={showLeafMap0} onLoginSuccess={showLeafMap0} />;
      case 'vender_login':
        return <VenderLogin onBack={showLeafMap0} onLoginSuccess={showVenderUpload} />;
      case 'leafmap0':
        return <LeafMap onBack={showEventSelect} onShowOrganizerLogin={showOrganizerLogin} 
        onShowVendorLogin={showVendorLogin} eventid="0"/>;
      case 'leafmap1':
        return <LeafMap onBack={showEventSelect} onShowOrganizerLogin={showOrganizerLogin} 
        onShowVendorLogin={showVendorLogin} eventid="1"/>;
      case 'event_select':
        return <EventSelect onNavigate={(target) =>{
          if(target === "map0"){
            showLeafMap0();
          }else if(target === "map1"){
            showLeafMap1();
          }else if(target === "debug"){
            showMain();
          }
        }} />;
      default:
        return showEventSelect
    }
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}

export default App;

