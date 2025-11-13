import './VenderLogin.css';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { PAGES, page_navigate } from '../../Pages';
import { userLogin } from "../../database/dbaccess";

export default function VendorLogin() {
  // --- State for inputs and error message ---
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault(); // デフォルトのページ遷移機能を制限
    
    if (loginId==="" || password===""){
      setError("ユーザ名とパスワードを入力してください");
      return;
    }

    const uid = await userLogin(loginId, password);
    if (uid) {
      console.log("ログイン成功: UID =", uid);
      page_navigate(PAGES.VEND_UPLOAD);
    } else {
      setError("ログインに失敗しました。");
    }
  };

  return (
    <div className="screen login-screen">
      <header className="login-header">
        <button className="btn-back" onClick={() => page_navigate(PAGES.LEAF_MAP)}>&lt; 戻る</button>
      </header>
      <div className="login-container">
        <h2>出店者ログインページ</h2>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <input 
            className="login-input" 
            type="text" 
            placeholder="ログインID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
          <input 
            className="login-input" 
            type="password" 
            placeholder="パスワード" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* --- Error message display --- */}
          {error && <p className="login-error">{error}</p>}
          
          <button className="btn" type="submit">ログイン</button>
        </form>
      </div>
    </div>
  );
}