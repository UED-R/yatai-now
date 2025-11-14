import styles from './TopPage.module.css';
import { PAGES, page_navigate } from '../../Pages';

export default function EventSelect() {
  return (
    <div className={`screen-general ${styles['event-select-screen']}`}>
      <div className={styles["title-container"]}>
        <h1>屋台なう！</h1>

        <p className={styles["subtitle"]}>
          屋台なう！は「雙峰祭」のイベントや屋台の情報をリアルタイムに知ることが出来る情報マップです。
        </p>
      </div>
      <button className={styles["event-button"]} onClick={() => page_navigate(PAGES.MainMap, "1")}>
        ご利用はこちらから！！
      </button>
    </div>
  );
}