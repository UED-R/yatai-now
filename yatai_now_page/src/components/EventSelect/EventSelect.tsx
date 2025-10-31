import './EventSelect.css'; // 専用CSSをインポート

type EventSelectProps = {
  onNavigate: (target: "map0" | "map1" | "debug") => void;
};

function EventSelect({ onNavigate}: EventSelectProps) {
  return (
    <div className="screen event-select-screen">
      <div className="title-container">
        <h1>屋台なう！</h1>
      </div>
      <button className="btn event-button" onClick={() => onNavigate("map0")}>
        LeafMap (id:0)
      </button>
      <br></br>
      <button className="btn event-button" onClick={() => onNavigate("map1")}>
        LeafMap (id:1)
      </button>
      <br></br>
      <button className="btn event-button" onClick={() => onNavigate("debug")}>
        VectorMap (noDB)
      </button>
    </div>
  );
}

export default EventSelect;