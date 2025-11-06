import './VenderLogin.css';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { PAGES, page_navigate } from '../../Pages';

export default function VendorLogin() {
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
      page_navigate(PAGES.VEND_UPLOAD)
    } else {
      setError('ログインIDまたはパスワードが違います');
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