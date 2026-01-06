import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname === '/admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Harap isi username dan password');
      return;
    }

    const result = login(username, password, isAdmin);
    
    if (result.success) {
      if (isAdmin) {
        alert('✅ Login Admin Berhasil!\n\nSelamat datang di Dashboard Admin NindyaMart!');
        navigate('/admin-dashboard');
      } else {
        alert('✅ Login Berhasil!\n\nSelamat berbelanja di NindyaMart, Azmi!');
        navigate('/');
      }
    } else {
      // Alert spesifik berdasarkan error
      let alertMessage = '';
      let errorMessage = '';
      
      if (isAdmin) {
        switch (result.error) {
          case 'both':
            alertMessage = `❌ Login Admin Gagal!\n\nUsername dan password salah.\n\nUsername yang benar: ${result.correctUsername}\nPassword yang benar: ${result.correctPassword}`;
            errorMessage = 'Username dan password salah';
            break;
          case 'username':
            alertMessage = `❌ Login Admin Gagal!\n\nUsername salah.\n\nUsername yang benar: ${result.correctUsername}`;
            errorMessage = 'Username salah';
            break;
          case 'password':
            alertMessage = `❌ Login Admin Gagal!\n\nPassword salah.\n\nPassword yang benar: ${result.correctPassword}`;
            errorMessage = 'Password salah';
            break;
          default:
            alertMessage = 'Login gagal';
            errorMessage = 'Terjadi kesalahan';
        }
      } else {
        switch (result.error) {
          case 'both':
            alertMessage = `❌ Login Gagal!\n\nUsername dan password salah.\n\nUsername yang benar: ${result.correctUsername}\nPassword yang benar: ${result.correctPassword}`;
            errorMessage = 'Username dan password salah';
            break;
          case 'username':
            alertMessage = `❌ Login Gagal!\n\nUsername salah.\n\nUsername yang benar: ${result.correctUsername}`;
            errorMessage = 'Username salah';
            break;
          case 'password':
            alertMessage = `❌ Login Gagal!\n\nPassword salah.\n\nPassword yang benar: ${result.correctPassword}`;
            errorMessage = 'Password salah';
            break;
          default:
            alertMessage = 'Login gagal';
            errorMessage = 'Terjadi kesalahan';
        }
      }
      
      alert(alertMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container-centered">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon">🛒</span>
            <span className="login-logo-text">NindyaMart</span>
          </div>
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">
            {isAdmin ? 'Akses Dashboard Admin' : 'Selamat datang! Silakan login untuk melanjutkan'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder={isAdmin ? "Masukkan username admin" : "Masukkan username"}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder={isAdmin ? "Masukkan password admin" : "Masukkan password"}
              required
            />
          </div>
          
          {error && <div className="login-error">{error}</div>}
          
          <button type="submit" className="login-button">
            {isAdmin ? 'Login sebagai Admin' : 'Login ke Akun'}
          </button>
          
          {!isAdmin && (
            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--gray-600)' }}>
              Admin? <a href="/admin" style={{ color: 'var(--primary-color)' }}>Login di sini</a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;