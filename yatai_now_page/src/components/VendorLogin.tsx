import type { FormEvent } from 'react';

// 親コンポーネントから受け取るPropsの型を定義
type VendorLoginScreenProps = {
  onBack: () => void;
  onLoginSuccess: () => void; // ログイン成功時に呼ばれる関数
};

function VendorLoginScreen({ onBack, onLoginSuccess }: VendorLoginScreenProps) {

  // ログインボタンが押されたときの処理
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    console.log('Vendor login attempt');
    alert('出店者としてログインしました（現在はダミー機能です）');
    // 親から渡された画面遷移関数を実行
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
        {/* ▼▼ タイトルを変更 ▼▼ */}
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

export default VendorLoginScreen;
