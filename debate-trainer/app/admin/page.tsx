'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userAnalysis, setUserAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();

  const ADMIN_EMAIL = "hafiz-azaan009@gmail.com";
  const API_URL = 'https://debate-backend-78i0.onrender.com';
  const ADMIN_SECRET_PATH = 'xk9m2p5q8t1w4z7';

  // ========== THEME PERSIST ==========
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ========== AUTH CHECK & DATA FETCH ==========
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/admin-login');
      return;
    }
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.email !== ADMIN_EMAIL) {
          router.push('/dashboard');
          return;
        }
      } catch(e) {
        router.push('/admin-login');
        return;
      }
    }
    
    fetchStats();
    fetchAllUsers();
    
    const interval = setInterval(() => {
      if (getToken()) {
        fetchAllUsers();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getToken = () => localStorage.getItem('token');

  // ========== FETCH STATS ==========
  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('No token');
      
      const res = await fetch(`${API_URL}/${ADMIN_SECRET_PATH}/admin/stats?email=${ADMIN_EMAIL}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.status === 401 || res.status === 403) {
        setError('Session expired. Please login again.');
        setTimeout(() => router.push('/admin-login'), 2000);
        return;
      }
      
      const data = await res.json();
      
      if (data.success) {
        setStats(data.stats);
        setError('');
      } else {
        setError(data.detail || 'Unauthorized access');
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      setError('Failed to load stats. Make sure backend is running.');
    }
  };

  // ========== FETCH ALL USERS ==========
  const fetchAllUsers = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('No token');
      
      const res = await fetch(`${API_URL}/${ADMIN_SECRET_PATH}/admin/all-users?email=${ADMIN_EMAIL}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========== FETCH USER ANALYSIS - REAL DATA ONLY ==========
  const fetchUserAnalysis = async (userEmail) => {
    setAnalyzing(true);
    setUserAnalysis(null);
    
    try {
      const token = getToken();
      
      const res = await fetch(`${API_URL}/${ADMIN_SECRET_PATH}/admin/user-analysis?email=${ADMIN_EMAIL}&user_email=${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await res.json();
      
      if (data.success && data.analysis) {
        setUserAnalysis(data.analysis);
      } else {
        setUserAnalysis(null);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setUserAnalysis(null);
    } finally {
      setAnalyzing(false);
    }
  };

  // ========== VIEW USER DETAILS ==========
  const viewUserDetails = async (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    await fetchUserAnalysis(user.email);
  };

  // ========== DELETE SINGLE USER ==========
  const deleteUser = async (userId, userEmail) => {
    if (!confirm(`⚠️ Delete user "${userEmail}"?\n\nThis will delete ALL their chat history and cannot be undone!`)) {
      return;
    }
    
    setDeleting(true);
    try {
      const token = getToken();
      
      const res = await fetch(`${API_URL}/${ADMIN_SECRET_PATH}/admin/delete-user/${userId}?email=${ADMIN_EMAIL}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        alert(`✅ User "${userEmail}" deleted successfully!`);
        fetchStats();
        fetchAllUsers();
      } else {
        const data = await res.json();
        alert(`❌ Failed: ${data.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('❌ Network error.');
    } finally {
      setDeleting(false);
    }
  };

  // ========== DELETE ALL USERS ==========
  const deleteAllUsers = async () => {
    if (!confirm('⚠️⚠️⚠️ DANGER: Delete ALL users?\n\nThis will delete EVERY user account and ALL chat history!\n\nThis action CANNOT be undone! ⚠️⚠️⚠️')) {
      return;
    }
    
    const confirmText = prompt('Type "DELETE" to confirm:');
    if (confirmText !== 'DELETE') {
      alert('Deletion cancelled');
      return;
    }
    
    setDeleting(true);
    try {
      const token = getToken();
      
      const res = await fetch(`${API_URL}/${ADMIN_SECRET_PATH}/admin/delete-all-users?email=${ADMIN_EMAIL}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert(`✅ ${data.message}`);
        fetchStats();
        fetchAllUsers();
      } else {
        alert(`❌ Failed: ${data.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete all error:', err);
      alert('❌ Network error.');
    } finally {
      setDeleting(false);
    }
  };

  // ========== HELPER: FORMAT TIME ==========
  const formatTime = (timestamp) => {
    if (!timestamp || timestamp === 0) return '-';
    return new Date(timestamp * 1000).toLocaleString();
  };

  // ========== GET TOP PERFORMERS ==========
  const getTopPerformers = () => {
    const sorted = [...users].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    return sorted.slice(0, 5);
  };

  // ========== GET ACTIVE USERS ==========
  const getActiveUsers = () => {
    return users.filter(u => u.is_online).length;
  };

  // ========== LOADING SCREEN ==========
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme === 'dark' ? '#000000' : '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme === 'dark' ? '#ffffff' : '#111111',
        fontSize: '18px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #10a37f30', 
            borderTop: '3px solid #10a37f',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <div style={{ color: theme === 'dark' ? '#888' : '#666' }}>
            Loading admin panel...
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        background: theme === 'dark' ? '#000000' : '#f5f5f5',
        padding: '30px',
        fontFamily: "'Inter', sans-serif",
        color: theme === 'dark' ? '#ffffff' : '#111111'
      }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ===== HEADER ===== */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h1 style={{ 
              color: theme === 'dark' ? '#ffffff' : '#111111', 
              fontSize: '28px', 
              marginBottom: '8px',
              fontWeight: '700'
            }}>
              🎛️ Admin Dashboard
            </h1>
            <p style={{ 
              color: theme === 'dark' ? '#888' : '#666' 
            }}>
              Platform analytics and user statistics
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{
                background: 'transparent',
                border: `1px solid ${theme === 'dark' ? '#444444' : '#cccccc'}`,
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: theme === 'dark' ? '#ffffff' : '#111111',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = theme === 'dark' ? '#1a1a1a' : '#e5e5e5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.button>
            
            {users.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={deleteAllUsers}
                disabled={deleting}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  opacity: deleting ? 0.6 : 1
                }}
              >
                {deleting ? '⌛ Deleting...' : '🗑️ Delete All Users'}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* ===== EXTRA STATS ROW ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '30px'
          }}
        >
          <div style={{
            background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            border: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}`
          }}>
            <div style={{ fontSize: '14px', color: theme === 'dark' ? '#888' : '#666' }}>🟢 Active Now</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
              {getActiveUsers()}
            </div>
          </div>
          
          <div style={{
            background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            border: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}`
          }}>
            <div style={{ fontSize: '14px', color: theme === 'dark' ? '#888' : '#666' }}>🏆 Top Performer</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
              {getTopPerformers().length > 0 ? getTopPerformers()[0]?.email?.split('@')[0] || '-' : '-'}
            </div>
          </div>
          
          <div style={{
            background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            border: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}`
          }}>
            <div style={{ fontSize: '14px', color: theme === 'dark' ? '#888' : '#666' }}>📊 Total Classes</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {stats?.totalClassrooms || 0}
            </div>
          </div>
        </motion.div>

        {/* ===== STATS CARDS ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          {[
            { icon: '👥', label: 'Total Users', value: stats?.totalUsers !== undefined ? stats.totalUsers : 0, color: '#667eea' },
            { icon: '💬', label: 'Total Debates', value: stats?.totalDebates || 0, color: '#22c55e' },
            { icon: '📝', label: 'Total Messages', value: stats?.totalMessages || 0, color: '#f59e0b' },
            { icon: '⭐', label: 'Total Points', value: stats?.totalPoints || 0, color: '#ef4444' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, boxShadow: theme === 'dark' ? '0 8px 30px rgba(0,0,0,0.3)' : '0 8px 30px rgba(0,0,0,0.08)' }}
              style={{
                background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
                padding: '24px',
                borderRadius: '16px',
                border: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}`,
                boxShadow: theme === 'dark' ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: item.color }}>
                {item.value}
              </div>
              <div style={{ color: theme === 'dark' ? '#888' : '#666', fontSize: '13px' }}>
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== TOP PERFORMERS ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{
            marginBottom: '30px',
            background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
            borderRadius: '16px',
            border: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}`,
            padding: '20px'
          }}
        >
          <h3 style={{ 
            color: theme === 'dark' ? '#ffffff' : '#111111',
            fontSize: '16px',
            marginBottom: '16px'
          }}>
            🏆 Top 5 Performers
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {getTopPerformers().map((user, idx) => (
              <motion.div 
                key={user.id} 
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: theme === 'dark' ? '#0a0a0a' : '#f5f5f5',
                  borderRadius: '10px'
                }}
              >
                <span style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7f32' : '#888'
                }}>
                  #{idx + 1}
                </span>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px', color: theme === 'dark' ? '#fff' : '#111' }}>
                    {user.email?.split('@')[0]}
                  </div>
                  <div style={{ fontSize: '12px', color: '#667eea' }}>
                    {user.totalPoints || 0} pts · {user.debates || 0} debates
                  </div>
                </div>
              </motion.div>
            ))}
            {getTopPerformers().length === 0 && (
              <div style={{ color: theme === 'dark' ? '#888' : '#666', padding: '12px' }}>
                No users yet
              </div>
            )}
          </div>
        </motion.div>

        {/* ===== USERS TABLE ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{
            background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
            borderRadius: '16px',
            border: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}`,
            overflow: 'hidden'
          }}
        >
          <div style={{
            padding: '20px',
            borderBottom: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}`,
            background: theme === 'dark' ? '#16213e' : '#f0f0f0'
          }}>
            <h2 style={{ 
              color: theme === 'dark' ? '#ffffff' : '#111111', 
              fontSize: '18px', 
              margin: 0 
            }}>
              📋 All Users ({users.length})
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}` }}>
                  <th style={{ padding: '12px', textAlign: 'center', color: theme === 'dark' ? '#888' : '#555', fontSize: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? '#888' : '#555', fontSize: '12px' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: theme === 'dark' ? '#888' : '#555', fontSize: '12px' }}>Device</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: theme === 'dark' ? '#888' : '#555', fontSize: '12px' }}>IP Address</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: theme === 'dark' ? '#888' : '#555', fontSize: '12px' }}>Debates</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: theme === 'dark' ? '#888' : '#555', fontSize: '12px' }}>Points</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: theme === 'dark' ? '#888' : '#555', fontSize: '12px' }}>Last Login</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: theme === 'dark' ? '#888' : '#555', fontSize: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <motion.tr 
                    key={user.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    style={{ borderBottom: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}` }}
                  >
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: user.is_online ? '#22c55e' : '#64748b',
                        boxShadow: user.is_online ? '0 0 8px #22c55e' : 'none'
                      }}></span>
                      <span style={{ fontSize: '11px', marginLeft: '6px', color: user.is_online ? '#22c55e' : (theme === 'dark' ? '#888' : '#666') }}>
                        {user.is_online ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: theme === 'dark' ? '#ffffff' : '#111111', fontSize: '13px' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: theme === 'dark' ? '#cccccc' : '#333333' }}>
                      {user.last_device === 'Mobile' ? '📱 Mobile' : user.last_device === 'Tablet' ? '📟 Tablet' : '💻 Desktop'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: theme === 'dark' ? '#cccccc' : '#333333' }}>
                        {user.last_ip || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#22c55e', fontWeight: '500' }}>
                      {user.debates}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#667eea', fontWeight: '500' }}>
                      {user.totalPoints}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: theme === 'dark' ? '#cccccc' : '#333333' }}>
                      {formatTime(user.last_login_time)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => viewUserDetails(user)}
                          style={{
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          📊 View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteUser(user.id, user.email)}
                          disabled={deleting}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: deleting ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            opacity: deleting ? 0.6 : 1
                          }}
                        >
                          🗑️ Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: theme === 'dark' ? '#666' : '#999' }}>
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ===== USER DETAILS MODAL ===== */}
        {showUserModal && selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }} onClick={() => setShowUserModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
                borderRadius: '20px',
                padding: '30px',
                border: `1px solid ${theme === 'dark' ? '#2d2d3a' : '#dddddd'}`
              }} onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div>
                  <h2 style={{ color: theme === 'dark' ? '#ffffff' : '#111111', margin: 0 }}>
                    📊 User Analysis
                  </h2>
                  <p style={{ color: theme === 'dark' ? '#888' : '#666', fontSize: '14px', margin: '4px 0 0' }}>
                    {selectedUser.email}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUserModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: theme === 'dark' ? '#888' : '#666',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {analyzing ? (
                <div style={{ textAlign: 'center', padding: '40px', color: theme === 'dark' ? '#888' : '#666' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '3px solid #10a37f30', 
                    borderTop: '3px solid #10a37f',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                  }} />
                  Analyzing user data...
                </div>
              ) : userAnalysis ? (
                <>
                  {/* Score */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                      background: theme === 'dark' ? '#0a0a0a' : '#f5f5f5',
                      borderRadius: '12px',
                      marginBottom: '20px'
                    }}
                  >
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>
                      {userAnalysis.score || 0}/100
                    </div>
                    <div style={{ color: theme === 'dark' ? '#888' : '#666' }}>
                      Overall Performance Score
                    </div>
                  </motion.div>

                  {/* Breakdown */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    {Object.entries(userAnalysis.breakdown || {}).map(([key, value]) => {
                      const maxValue = key === 'logic' ? 25 : key === 'evidence' ? 20 : key === 'counterArguments' ? 20 : key === 'clarity' ? 20 : 15;
                      const displayValue = typeof value === 'number' ? value : 0;
                      return (
                        <motion.div 
                          key={key} 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            textAlign: 'center',
                            padding: '12px',
                            background: theme === 'dark' ? '#0a0a0a' : '#f5f5f5',
                            borderRadius: '8px'
                          }}
                        >
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>
                            {displayValue}/{maxValue}
                          </div>
                          <div style={{ fontSize: '11px', color: theme === 'dark' ? '#888' : '#666', textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Best Moments */}
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ color: '#22c55e', marginBottom: '8px' }}>✅ Best Moments</h4>
                    {userAnalysis.bestMoments && userAnalysis.bestMoments.length > 0 ? (
                      userAnalysis.bestMoments.map((item, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          style={{
                            padding: '10px 14px',
                            background: 'rgba(34,197,94,0.1)',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            borderLeft: '3px solid #22c55e'
                          }}
                        >
                          <div style={{ fontSize: '13px', color: theme === 'dark' ? '#ddd' : '#333' }}>
                            "{item.quote || 'No quote available'}"
                          </div>
                          <div style={{ fontSize: '11px', color: theme === 'dark' ? '#888' : '#666' }}>
                            {item.reason || 'No reason provided'}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div style={{ color: theme === 'dark' ? '#888' : '#666', fontSize: '13px' }}>
                        No best moments recorded yet.
                      </div>
                    )}
                  </div>

                  {/* Areas to Improve */}
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>⚠️ Areas to Improve</h4>
                    {userAnalysis.areasToImprove && userAnalysis.areasToImprove.length > 0 ? (
                      userAnalysis.areasToImprove.map((item, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          style={{
                            padding: '10px 14px',
                            background: 'rgba(239,68,68,0.1)',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            borderLeft: '3px solid #ef4444'
                          }}
                        >
                          <div style={{ fontSize: '13px', color: theme === 'dark' ? '#ddd' : '#333' }}>
                            <strong>Issue:</strong> {item.issue || 'No issue specified'}
                          </div>
                          <div style={{ fontSize: '11px', color: theme === 'dark' ? '#888' : '#666' }}>
                            <strong>Example:</strong> "{item.example || 'No example provided'}"
                          </div>
                          <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                            💡 {item.suggestion || 'No suggestion provided'}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div style={{ color: theme === 'dark' ? '#888' : '#666', fontSize: '13px' }}>
                        No areas to improve identified yet.
                      </div>
                    )}
                  </div>

                  {/* Feedback */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      padding: '14px',
                      background: 'rgba(102,126,234,0.1)',
                      borderRadius: '8px',
                      borderLeft: '3px solid #667eea'
                    }}
                  >
                    <div style={{ fontSize: '13px', color: theme === 'dark' ? '#ddd' : '#333' }}>
                      {userAnalysis.feedback || 'No feedback available.'}
                    </div>
                  </motion.div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: theme === 'dark' ? '#888' : '#666' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                  <h3 style={{ color: theme === 'dark' ? '#ffffff' : '#111111', marginBottom: '8px' }}>
                    No analysis data available
                  </h3>
                  <p style={{ fontSize: '14px' }}>
                    This user hasn't completed any debates yet.
                    <br/>
                    Analysis will appear once they have debate history.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '20px',
              padding: '12px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              color: '#fca5a5',
              textAlign: 'center'
            }}
          >
            ❌ {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}