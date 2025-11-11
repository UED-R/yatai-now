import './EventSelect.css';
import { PAGES, page_navigate } from '../../Pages';

export default function EventSelect() {
  return (
    <div className="screen event-select-screen">
      <div className="title-container">
        <h1>屋台なう！</h1>
      </div>
      <button className="event-button" onClick={() => page_navigate(PAGES.MAIN2, "1")}>
        LeafLet + ベクタ地図
      </button>
      <br></br>
      <button className="debug-button" onClick={() => page_navigate(PAGES.LEAF_MAP, "0")}>
        LeafLet + OpenStreetMap + DB(id:0)
      </button>
      <br></br>
      <button className="debug-button" onClick={() => page_navigate(PAGES.LEAF_MAP, "1")}>
        LeafLet + OpenStreetMap + DB(id:1)
      </button>
      <br></br>
      <button className="debug-button" onClick={() => page_navigate(PAGES.MAIN)}>
        自作Viewer + ベクタ地図
      </button>
    </div>
  );
}
