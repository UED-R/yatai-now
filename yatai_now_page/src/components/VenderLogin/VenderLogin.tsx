import type { FormEvent } from 'react';
import './VenderLogin.css';

type VendorLoginProps = {
  onBack: () => void;
  onLoginSuccess: () => void;
};

function VendorLogin({ onBack, onLoginSuccess }: VendorLoginProps) {
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Vendor login attempt');
    alert('出店者としてログインしました（現在はダミー機能です）');
    onLoginSuccess();
  };

  return (
    <div className="screen login-screen">
      <header className="login-header">
        <button className="btn-back" onClick={onBack}>&lt; 戻る</button>
      </header>
      <div className="login-container">
        <h2>出店者ログインページ</h2>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <input className="login-input" type="text" placeholder="ログインID" />
          <input className="login-input" type="password" placeholder="パスワード" />
          <button className="btn" type="submit">ログイン</button>
        </form>
      </div>
    </div>
  );
}

export default VendorLogin;
