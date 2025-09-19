// 親コンポーネントから受け取るPropsの型を定義
type EventSelectScreenProps = {
  onNavigateToMap: () => void; // map1.tsxへ遷移するための関数
};

function EventSelectScreen({ onNavigateToMap }: EventSelectScreenProps) {
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

export default EventSelectScreen;

