import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setGlobalNavigate } from "./Pages"
import './App.css';
import "./Pages";

import EventSelect from './components/EventSelect/EventSelect';
import Main from './components/Main/Main';
import OrganizerLogin from './components/OrganizerLogin/OrganizerLogin';
import VenderLogin from './components/VenderLogin/VenderLogin';
import VenderUpload from './components/VenderUpload/VenderUpload';
import LeafMap from './components/LeafMap/LeafMap';
import { PAGES } from './Pages';

function NavigatorInitializer() {
  const navigate = useNavigate();
  setGlobalNavigate(navigate);
  return null;
}

export default function App() {
  return (
    <Router>
      <NavigatorInitializer />
      <Routes>
        <Route path={PAGES.EVENT_SELECT} element={<EventSelect />} />
        <Route path={PAGES.MAIN} element={<Main />} />
        <Route path={PAGES.ORG_LOGIN} element={<OrganizerLogin />} />
        <Route path={PAGES.VEND_LOGIN} element={<VenderLogin />} />
        <Route path={PAGES.VEND_UPLOAD} element={<VenderUpload />} />
        <Route path={PAGES.LEAF_MAP} element={<LeafMap />} />
      </Routes>
    </Router>
  );
}

