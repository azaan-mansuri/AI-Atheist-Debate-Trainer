'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = '';
  const ADMIN_SECRET_PATH = 'xk9m2p5q8t1w4z7';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/${ADMIN_SECRET_PATH}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password
        })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ email: username, role: 'admin' }));
        router.push('/admin');
      } else {
        setError(data.detail || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'rgba(15,25,45,0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 16px'
          }}>
            🔐
          </div>
          <h1 style={{ color: 'white', fontSize: '24px', margin: 0 }}>Admin Access</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '8px' }}>
            Enter your credentials
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '12px'
            }}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Verifying...' : 'Login →'}
          </button>
        </form>
      </div>
    </div>
  );
}