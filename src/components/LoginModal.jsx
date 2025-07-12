import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ show, onClose, onLogin }) => {
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill all fields');
      return;
    }
    // Demo: Save user to localStorage
    localStorage.setItem('demoUser', JSON.stringify({ username }));
    setError('');
    onLogin({ username });
    onClose();
  };

  const handleTab = (t) => {
    setTab(t);
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={e => e.stopPropagation()}>
        <div className="login-modal-header">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => handleTab('login')}>Login</button>
          <button className={tab === 'signup' ? 'active' : ''} onClick={() => handleTab('signup')}>Sign-up</button>
          <span className="login-modal-close" onClick={onClose}>×</span>
        </div>
        <form className="login-modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="login-modal-error">{error}</div>}
          <button type="submit" className="login-modal-submit">
            {tab === 'login' ? 'Login' : 'Sign-up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 