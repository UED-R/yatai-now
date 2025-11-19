import styles from './OrganizerLogin.module.css';
import type { FormEvent } from 'react';
import { PAGES, page_navigate } from '../../Pages';

export default function OrganizerLogin() {
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    console.log('Organizer login attempt');
  };

  return (
    <div className={`screen-general ${styles["login-screen"]}`}>
      <header className={styles["login-header"]}>
        <button className={styles["btn-back"]} onClick={() => page_navigate(PAGES.MainMap, "1")}>&lt; 戻る</button>
      </header>
      <div className={styles["login-container"]}>
        <h2>主催者ログインページ</h2>
        <form className={styles["login-form"]} onSubmit={handleLogin}>
          <input className={styles["login-input"]} type="text" placeholder="ログインID" />
          <input className={styles["login-input"]} type="password" placeholder="パスワード" />
          <button className={styles["btn"]} type="submit">ログイン</button>
        </form>
      </div>
    </div>
  );
}