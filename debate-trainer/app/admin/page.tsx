'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const ADMIN_EMAIL = "hafiz-azaan009@gmail.com";
  const API_URL = '';
  const ADMIN_SECRET_PATH = 'xk9m2p5q8t1w4z7';

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
    
    // Auto-refresh every 10 seconds for real-time online status
    const interval = setInterval(() => {
      if (getToken()) {
        fetchAllUsers();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getToken = () => localStorage.getItem('token');

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

  // Helper function to format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp || timestamp === 0) return '-';
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading admin panel...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      padding: '30px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '28px', marginBottom: '8px' }}>
              🎛️ Admin Dashboard
            </h1>
            <p style={{ color: '#888' }}>Platform analytics and user statistics</p>
          </div>
          
          {users.length > 0 && (
            <button
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
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: '#1a1a2e',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #2d2d3a'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
              {stats?.totalUsers !== undefined ? stats.totalUsers : 0}
            </div>
            <div style={{ color: '#888', fontSize: '13px' }}>Total Users</div>
          </div>

          <div style={{
            background: '#1a1a2e',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #2d2d3a'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>
              {stats?.totalDebates || 0}
            </div>
            <div style={{ color: '#888', fontSize: '13px' }}>Total Debates</div>
          </div>

          <div style={{
            background: '#1a1a2e',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #2d2d3a'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {stats?.totalMessages || 0}
            </div>
            <div style={{ color: '#888', fontSize: '13px' }}>Total Messages</div>
          </div>

          <div style={{
            background: '#1a1a2e',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #2d2d3a'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>
              {stats?.totalPoints || 0}
            </div>
            <div style={{ color: '#888', fontSize: '13px' }}>Total Points</div>
          </div>
        </div>

        {/* Users Table with Device Tracking */}
        <div style={{
          background: '#1a1a2e',
          borderRadius: '16px',
          border: '1px solid #2d2d3a',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #2d2d3a',
            background: '#16213e'
          }}>
            <h2 style={{ color: 'white', fontSize: '18px', margin: 0 }}>📋 All Users</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d2d3a' }}>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#888' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#888' }}>Device</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#888' }}>Browser / OS</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#888' }}>IP Address</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#888' }}>Debates</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#888' }}>Points</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#888' }}>Last Login</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#888' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #2d2d3a' }}>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: user.is_online ? '#22c55e' : '#64748b',
                        boxShadow: user.is_online ? '0 0 8px #22c55e' : 'none'
                      }}></span>
                      <span style={{ fontSize: '11px', marginLeft: '6px', color: user.is_online ? '#22c55e' : '#888' }}>
                        {user.is_online ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'white', fontSize: '13px' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>
                      {user.last_device === 'Mobile' ? '📱 Mobile' : user.last_device === 'Tablet' ? '📟 Tablet' : '💻 Desktop'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>
                      <span style={{ color: '#667eea' }}>{user.last_browser || '-'}</span>
                      <br/>
                      <span style={{ color: '#888', fontSize: '10px' }}>{user.last_os || '-'}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{user.last_ip || '-'}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#22c55e' }}>
                      {user.debates}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#667eea' }}>
                      {user.totalPoints}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '11px' }}>
                      {formatTime(user.last_login_time)}
                      <br/>
                      <span style={{ color: '#888', fontSize: '10px' }}>({user.login_count || 0} times)</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
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
                      </button>
                    </td>
                   </tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                      No users yet
                    </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            color: '#fca5a5',
            textAlign: 'center'
          }}>
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
}