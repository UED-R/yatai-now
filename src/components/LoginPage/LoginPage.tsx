import styles from './LoginPage.module.css';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { PAGES, page_navigate } from '../../Pages';
import { userCheck, userLogin } from "../../database/dbaccess";
import { getAuth } from "firebase/auth";

//編集

export default function LoginPage() {
  // --- State for inputs and error message ---
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) { // 認証済みかどうか確認
      // console.log("自動ログイン成功: UID =",auth.currentUser.uid);
      const redirect = async () => {
        await new Promise(res => setTimeout(res, 400)); // ミリ秒待つ
        const userRes = await userCheck(auth.currentUser?.uid);
        if(userRes==="org"){
          // console.log("org");
          page_navigate(PAGES.ORG_MANAGE); //主催者画面に移行予定
        }else if(userRes==="vend"){
          // console.log("vend");
          page_navigate(PAGES.VEND_UPLOAD);
        }else{
          // console.log("err");
        }
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
    setError("");
    setLoading(true);
    await new Promise(res => setTimeout(res, 1000)); // ミリ秒待つ

    try{
      const usertemp = await userLogin(loginId, password);
      const userres = await userCheck(usertemp);
      if (userres==="org") {
        // console.log("org");
        page_navigate(PAGES.ORG_MANAGE);
      }else if(userres==="vend"){
        // console.log("vend");
        page_navigate(PAGES.VEND_UPLOAD);
      } else {
        setError("ログインできません");
        setLoading(false);
      }
    } catch(e){
      setError("ログイン中にエラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <div className={`screen-general ${styles["login-screen"]}`}>
      <header className={styles["login-header"]}>
        <button className={styles["btn-back"]} onClick={() => page_navigate(PAGES.MAIN_MAP, "1")}>&lt; 戻る</button>
      </header>
      <div className={styles["login-container"]}>
        <h2>ログインページ</h2>
        <form className={styles["login-form"]} onSubmit={handleLoginSubmit}>
          <input 
            className={styles["login-input"]} 
            type="text" 
            placeholder="ログインID"
            value={loginId}
            disabled={loading}
            onChange={(e) => setLoginId(e.target.value)}
          />
          <input 
            className={styles["login-input"]} 
            type="password" 
            placeholder="パスワード" 
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className={styles["login-error"]}>{error}</p>}
          
          <button className={styles["btn"]} type="submit" disabled={loading}>{loading ? "ログイン中…" : "ログイン"}</button>
        </form>
      </div>
    </div>
  );
}