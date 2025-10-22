import './EventSelect.css'; // 専用CSSをインポート

type EventSelectProps = {
  onNavigateToMap: () => void;
  onNavigateToVenderUpload: () => void;
};

function EventSelect({ onNavigateToMap, onNavigateToVenderUpload  }: EventSelectProps) {
  return (
    <div className="screen event-select-screen">
      <div className="title-container">
        <h1>屋台なう！</h1>
      </div>
      {/* 1つ目：地図画面に遷移 */}
      <button className="btn event-button" onClick={onNavigateToMap}>
        雙峰祭
      </button>

      {/* 2つ目：Debugページに遷移 */}
      <button className="btn event-button" onClick={onNavigateToVenderUpload}>
        Debug
      </button>
    </div>
  );
}

export default EventSelect;