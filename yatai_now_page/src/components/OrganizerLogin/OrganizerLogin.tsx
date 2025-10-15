import type { FormEvent } from 'react';
import './OrganizerLogin.css';

type OrganizerLoginProps = {
  onBack: () => void;
  onLoginSuccess: () => void;
};

function OrganizerLogin({ onBack, onLoginSuccess }: OrganizerLoginProps) {
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Organizer login attempt');
    onLoginSuccess();
  };

  return (
    <div className="screen login-screen">
      <header className="login-header">
        <button className="btn-back" onClick={onBack}>&lt; 戻る</button>
      </header>
      <div className="login-container">
        <h2>主催者ログインページ</h2>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <input className="login-input" type="text" placeholder="ログインID" />
          <input className="login-input" type="password" placeholder="パスワード" />
          <button className="btn" type="submit">ログイン</button>
        </form>
      </div>
    </div>
  );
}

export default OrganizerLogin;
