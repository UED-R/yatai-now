import { useEffect, useState } from 'react';
import styles from './VenderLogin.module.css';
import type { FormEvent } from 'react';
import { PAGES, page_navigate } from '../../Pages';
import { userLogin } from "../../database/dbaccess";
import { getAuth } from "firebase/auth";


export default function VendorLogin() {
  // --- State for inputs and error message ---
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) { // 認証済みかどうか確認
      // console.log("自動ログイン成功: UID =",auth.currentUser.uid);
      const redirect = async () => {
        await new Promise(res => setTimeout(res, 400)); // ミリ秒待つ
        page_navigate(PAGES.VEND_UPLOAD);
      };
      redirect(); //自動でリダイレクト、キャッシュ削除で解除
    }
  }, []);


  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault(); // デフォルトのページ遷移機能を制限
    
    if (loginId==="" || password===""){
      setError("ユーザ名とパスワードを入力してください");
      return;
    }

    const uid = await userLogin(loginId, password);
    if (uid) {
      // console.log("手動ログイン成功: UID =", uid);
      page_navigate(PAGES.VEND_UPLOAD);
    } else {
      setError("ログインに失敗しました。");
    }
  };

  return (
    <div className={`screen-general ${styles["login-screen"]}`}>
      <header className={styles["login-header"]}>
        <button className={styles["btn-back"]} onClick={() => page_navigate(PAGES.MAIN_MAP, "1")}>&lt; 戻る</button>
      </header>
      <div className={styles["login-container"]}>
        <h2>出店者ログインページ</h2>
        <form className={styles["login-form"]} onSubmit={handleLoginSubmit}>
          <input 
            className={styles["login-input"]} 
            type="text" 
            placeholder="ログインID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
          <input 
            className={styles["login-input"]} 
            type="password" 
            placeholder="パスワード" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* --- Error message display --- */}
          {error && <p className={styles["login-error"]}>{error}</p>}
          
          <button className={styles["btn"]} type="submit">ログイン</button>
        </form>
      </div>
    </div>
  );
}