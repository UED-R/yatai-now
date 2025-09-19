import type { FormEvent } from 'react';

// ▼▼ onLoginSuccessを受け取るようにPropsを更新 ▼▼
type OrganizerLoginScreenProps = {
  onBack: () => void;
  onLoginSuccess: () => void; // ログイン成功時に呼ばれる関数
};

function OrganizerLoginScreen({ onBack, onLoginSuccess }: OrganizerLoginScreenProps) {

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Organizer login attempt');
    // alertの代わりに、親から渡された画面遷移関数を呼び出す
    onLoginSuccess();
  };

  return (
    <div className="screen login-screen">
      <header className="event-header">
        <button className="btn-back" onClick={onBack}>
          &lt; 戻る
        </button>
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

export default OrganizerLoginScreen;

