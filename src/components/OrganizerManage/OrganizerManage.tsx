import styles from './OrganizerManage.module.css';
import { PAGES, page_navigate } from '../../Pages';

export default function OrganizerManagement() {

  return (
    <div className={`screen-general ${styles["login-screen"]}`}>
      <header className={styles["login-header"]}>
        <button className={styles["btn-back"]} onClick={() => page_navigate(PAGES.MAIN_MAP, "1")}>&lt; 戻る</button>
      </header>
      <div className={styles["login-container"]}>
        <h2>主催者用管理ページ</h2>
      </div>
    </div>
  );
}