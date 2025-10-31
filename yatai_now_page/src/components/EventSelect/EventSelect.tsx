import './EventSelect.css'; // 専用CSSをインポート

type EventSelectProps = {
  onNavigate: (target: "map" | "debug") => void;
};

function EventSelect({ onNavigate}: EventSelectProps) {
  return (
    <div className="screen event-select-screen">
      <div className="title-container">
        <h1>屋台なう！</h1>
      </div>
      <button className="btn event-button" onClick={() => onNavigate("map")}>
        雙峰祭(LeafMap)
      </button>
      <br></br>
      <button className="btn event-button" onClick={() => onNavigate("debug")}>
        雙峰祭(ベクタマップ)
      </button>
    </div>
  );
}

export default EventSelect;