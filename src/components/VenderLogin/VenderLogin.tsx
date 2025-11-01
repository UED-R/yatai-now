import { useState } from 'react';
import type { FormEvent } from 'react';
import './VenderLogin.css';

type VendorLoginProps = {
  onBack: () => void;
  onLoginSuccess: () => void;
};

function VendorLogin({ onBack, onLoginSuccess }: VendorLoginProps) {
  // --- State for inputs and error message ---
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // --- Login validation logic ---
    if (loginId === 'yatai' && password === 'now') {
      console.log('Vendor login successful');
      setError(''); // Clear any previous errors
      onLoginSuccess(); // Navigate to the next screen (LeafMap)
    } else {
      setError('ログインIDまたはパスワードが違います');
    }
  };

  return (
    <div className="screen login-screen">
      <header className="login-header">
        <button className="btn-back" onClick={onBack}>&lt; 戻る</button>
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

export default VendorLogin;
