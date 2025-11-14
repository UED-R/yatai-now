import styles from './TopPage.module.css';
import { PAGES, page_navigate } from '../../Pages';

export default function EventSelect() {
  return (
    <div className={`screen-general ${styles['event-select-screen']}`}>
      <div className={styles["title-container"]}>
        <h1>屋台なう！</h1>
      </div>
      <button className={styles["event-button"]} onClick={() => page_navigate(PAGES.MainMap, "1")}>
        LeafLet + ベクタ地図
      </button>
    </div>
  );
}