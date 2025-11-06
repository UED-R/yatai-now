import './EventSelect.css';
import { PAGES, page_navigate } from '../../Pages';

export default function EventSelect() {
  return (
    <div className="screen event-select-screen">
      <div className="title-container">
        <h1>屋台なう！</h1>
      </div>
      <button className="btn event-button" onClick={() => page_navigate(PAGES.LEAF_MAP, "0")}>
        LeafMap + OpenStreetMap + DB(id:0)
      </button>
      <br></br>
      <button className="btn event-button" onClick={() => page_navigate(PAGES.LEAF_MAP, "1")}>
        LeafMap + OpenStreetMap + DB(id:1)
      </button>
      <br></br>
      <button className="btn event-button" onClick={() => page_navigate(PAGES.MAIN)}>
        自作Viewer + ベクタ地図
      </button>
      <br></br>
      <button className="btn event-button" onClick={() => page_navigate(PAGES.EVENT_SELECT)}>
        LeafMap + ベクタ地図
      </button>
    </div>
  );
}
