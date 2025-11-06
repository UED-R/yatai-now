import './OrganizerLogin.css';
import type { FormEvent } from 'react';
import { PAGES, page_navigate } from '../../Pages';

export default function OrganizerLogin() {
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    console.log('Organizer login attempt');
  };

  return (
    <div className="screen login-screen">
      <header className="login-header">
        <button className="btn-back" onClick={() => page_navigate(PAGES.LEAF_MAP, "0")}>&lt; 戻る</button>
      </header>
      <div className="login-container">
        <h2>主催者ログインページ</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input className="login-input" type="text" placeholder="ログインID" />
          <input className="login-input" type="password" placeholder="パスワード" />
          <button className="btn" type="submit">ログイン</button>
        </form>
      </div>
    </div>
  );
}