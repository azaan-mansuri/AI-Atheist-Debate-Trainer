'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// BACKEND URL
const API_URL = 'https://debate-backend-78i0.onrender.com';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');
  const [isScholar, setIsScholar] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!isScholar) {
      setError('You must confirm that you are a scholar to continue');
      setLoading(false);
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await res.json();
      console.log('Signup Response:', data);
      
      if (data.success) {
        // Clear old data first
        localStorage.clear();
        
        // Fix: If role missing, add it
        if (!data.user.role) {
          data.user.role = role;
        }
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Account created with role:', data.user.role);
        
        // Force hard reload with window.location
        if (data.user.role === 'teacher') {
          window.location.href = '/dashboard/classroom';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setError(data.detail || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Cannot connect to server. Make sure backend is running');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: '480px',
          width: '100%',
          background: '#0a0a0a',
          borderRadius: '32px',
          border: '1px solid #222222',
          padding: '48px 40px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            margin: '0 auto 20px',
          }}>
            🎓
          </div>
          <h1 style={{
            fontSize: '34px',
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(135deg, #ffffff, #10a37f)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            Create Account
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#aaaaaa', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '16px',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#aaaaaa', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '16px',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#aaaaaa', marginBottom: '8px' }}>
              Account Type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                background: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '16px',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="student">📚 Student - Join classrooms</option>
              <option value="teacher">👨‍🏫 Teacher - Create classrooms</option>
            </select>
          </div>

          <div style={{ 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: isScholar ? 'rgba(16,163,127,0.1)' : '#1a1a1a',
            padding: '12px 16px',
            borderRadius: '12px',
            border: `1px solid ${isScholar ? 'rgba(16,163,127,0.4)' : '#333333'}`,
            cursor: 'pointer'
          }}
          onClick={() => setIsScholar(!isScholar)}
          >
            <input
              type="checkbox"
              id="isScholar"
              checked={isScholar}
              onChange={(e) => setIsScholar(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10a37f' }}
            />
            <label htmlFor="isScholar" style={{ color: '#aaaaaa', fontSize: '13px', cursor: 'pointer', flex: 1 }}>
              I confirm that I am a <span style={{ color: '#10a37f', fontWeight: '600' }}>Scholar</span>
            </label>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'center',
              fontSize: '13px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isScholar}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (loading || !isScholar) ? 'not-allowed' : 'pointer',
              opacity: (loading || !isScholar) ? 0.5 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#888888', fontSize: '13px' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#10a37f', textDecoration: 'none', fontWeight: '600' }}>
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}