import React, { useState } from 'react';

const AdminLogin = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '12345') { // Şifreyi buradan belirleyebilirsin
      setIsLoggedIn(true);
    } else {
      alert('Yanlış şifre!');
    }
  };

  if (isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="admin-login">
      <h2>Yönetici Girişi</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default AdminLogin;