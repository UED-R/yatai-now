import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setGlobalNavigate } from "./Pages"
import './App.css';
import "./Pages";


// 追加したいページのプロジェクト上でのファイルパス
import EventSelect      from './components/TopPage/TopPage';
import MainMap          from './components/MainMap/MainMap';
import LoginPage        from './components/LoginPage/LoginPage';
import VenderUpload     from './components/VenderUpload/VenderUpload';
import OrganizerManage  from './components/OrganizerManage/OrganizerManage';
import { PAGES }        from './Pages';


// ページナビゲータをグローバル変数化
function NavigatorInitializer() {
  const navigate = useNavigate();
  setGlobalNavigate(navigate);
  return null;
}

// ページのルーティング
export default function App() {
  return (
    <Router>
      <NavigatorInitializer />
      <Routes>
        <Route path={PAGES.TOP_PAGE}      element={<EventSelect />} />
        <Route path={PAGES.MAIN_MAP}      element={<MainMap />} />
        <Route path={PAGES.LOGIN_PAGE}    element={<LoginPage />} />
        <Route path={PAGES.VEND_UPLOAD}   element={<VenderUpload />} />
        <Route path={PAGES.ORG_MANAGE}    element={<OrganizerManage />} />
      </Routes>
    </Router>
  );
}

