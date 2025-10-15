import './EventSelect.css'; // 専用CSSをインポート

type EventSelectProps = {
  onNavigateToMap: () => void;
};

function EventSelect({ onNavigateToMap }: EventSelectProps) {
  return (
    <div className="screen event-select-screen">
      <div className="title-container">
        <h1>屋台なう！</h1>
      </div>
      <button className="btn event-button" onClick={onNavigateToMap}>
        雙峰祭
      </button>
    </div>
  );
}

export default EventSelect;
