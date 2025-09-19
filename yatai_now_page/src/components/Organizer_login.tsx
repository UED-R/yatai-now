import type { FormEvent } from 'react';

// 親コンポーネントから受け取るPropsの型を定義
type OrganizerLoginScreenProps = {
  onBack: () => void; // 戻るボタンが押されたときに呼ばれる関数
};

function OrganizerLoginScreen({ onBack }: OrganizerLoginScreenProps) {

  // ログインボタンが押されたときの処理
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    console.log('Organizer login attempt');
    alert('ログインしました（現在はダミー機能です）');
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
