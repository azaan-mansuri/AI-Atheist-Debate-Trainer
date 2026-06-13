'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ========== ADD TYPES ==========
interface Student {
  student_name: string;
  joined_at: number;
}

interface Activity {
  session_id: string;
  mode: string;
  topic: string;
  score: number;
  duration: number;
  messages: any[];
  timestamp: number;
}

interface ModeStats {
  [key: string]: { count: number; totalScore: number };
}

interface TopicStats {
  [key: string]: { count: number; totalScore: number };
}

export default function StudentDetailPage() {
  const router = useRouter();
  const { classId, studentId } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Activity | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  
  const API_URL = 'https://debate-backend-78i0.onrender.com';

  useEffect(() => {
    fetchStudentData();
  }, [classId, studentId]);
  
  const fetchStudentData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/classroom/${classId}/student/${studentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudent(data.student);
        setActivities(data.activities);
      } else {
        router.push(`/dashboard/classroom/${classId}`);
      }
    } catch (err) {
      console.error(err);
      router.push(`/dashboard/classroom/${classId}`);
    } finally {
      setLoading(false);
    }
  };
  
  const viewDebateDetail = (activity: Activity) => {
    setSelectedChat(activity);
    setShowChatModal(true);
  };
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #1a1a1a', borderTopColor: '#10a37f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  if (!student) return null;
  
  const totalDebates = activities.length;
  const totalScore = activities.reduce((sum, a) => sum + (a.score || 0), 0);
  const averageScore = totalDebates > 0 ? Math.round(totalScore / totalDebates) : 0;
  
  const modeStats: ModeStats = {};
  activities.forEach(a => {
    if (!modeStats[a.mode]) {
      modeStats[a.mode] = { count: 0, totalScore: 0 };
    }
    modeStats[a.mode].count++;
    modeStats[a.mode].totalScore += (a.score || 0);
  });
  
  const topicStats: TopicStats = {};
  activities.forEach(a => {
    if (!topicStats[a.topic]) {
      topicStats[a.topic] = { count: 0, totalScore: 0 };
    }
    topicStats[a.topic].count++;
    topicStats[a.topic].totalScore += (a.score || 0);
  });
  
  const scoreTrend = activities.slice(-10).map(a => a.score);
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: "'Inter', system-ui, sans-serif", padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => router.push(`/dashboard/classroom/${classId}`)}
            style={{ background: 'none', border: 'none', color: '#10a37f', cursor: 'pointer', marginBottom: '8px', fontSize: '14px' }}
          >
            ← Back to Classroom
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #10a37f, #1a7f64)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
              🎓
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: 0 }}>{student.student_name}</h1>
              <p style={{ color: '#888', marginTop: '4px' }}>
                Joined: {new Date(student.joined_at * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #333' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10a37f' }}>{totalDebates}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Total Debates</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #333' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: averageScore >= 70 ? '#10a37f' : (averageScore >= 50 ? '#f59e0b' : '#ef4444') }}>
              {averageScore}%
            </div>
            <div style={{ fontSize: '13px', color: '#888' }}>Average Score</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #333' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10a37f' }}>
              {scoreTrend.length > 0 ? scoreTrend[scoreTrend.length - 1] : 0}%
            </div>
            <div style={{ fontSize: '13px', color: '#888' }}>Latest Score</div>
          </div>
        </div>
        
        {/* Score Trend Graph */}
        {scoreTrend.length > 1 && (
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>📈 Score Trend (Last {scoreTrend.length} Debates)</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '150px', padding: '10px 0' }}>
              {scoreTrend.map((score, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '100%', 
                    height: `${score}px`, 
                    backgroundColor: score >= 70 ? '#10a37f' : (score >= 50 ? '#f59e0b' : '#ef4444'),
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }} />
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>{idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Performance by Mode */}
        {Object.keys(modeStats).length > 0 && (
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}> Performance by Mode</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.entries(modeStats).map(([mode, stats]) => {
                const avg = Math.round(stats.totalScore / stats.count);
                return (
                  <div key={mode} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ width: '140px' }}>
                      <span style={{ color: '#fff' }}>{mode}</span>
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#0a0a0a', borderRadius: '20px', height: '30px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${avg}%`, 
                        height: '100%', 
                        backgroundColor: avg >= 70 ? '#10a37f' : (avg >= 50 ? '#f59e0b' : '#ef4444'),
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px',
                        color: '#fff', fontSize: '12px', fontWeight: '500'
                      }}>
                        {avg}%
                      </div>
                    </div>
                    <div style={{ width: '80px', textAlign: 'right' }}>
                      <span style={{ color: '#888', fontSize: '12px' }}>{stats.count} debates</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Performance by Topic */}
        {Object.keys(topicStats).length > 0 && (
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}> Performance by Topic</h2>
            <div style={{ display: 'grid', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {Object.entries(topicStats)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([topic, stats]) => {
                  const avg = Math.round(stats.totalScore / stats.count);
                  return (
                    <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ width: '160px' }}>
                        <span style={{ color: '#fff', fontSize: '13px' }}>{topic.length > 20 ? topic.substring(0, 18) + '...' : topic}</span>
                      </div>
                      <div style={{ flex: 1, backgroundColor: '#0a0a0a', borderRadius: '20px', height: '30px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${avg}%`, 
                          height: '100%', 
                          backgroundColor: avg >= 70 ? '#10a37f' : (avg >= 50 ? '#f59e0b' : '#ef4444'),
                          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px',
                          color: '#fff', fontSize: '12px', fontWeight: '500'
                        }}>
                          {avg}%
                        </div>
                      </div>
                      <div style={{ width: '80px', textAlign: 'right' }}>
                        <span style={{ color: '#888', fontSize: '12px' }}>{stats.count} debates</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        
        {/* All Debates List - WITH CLICK INDICATOR */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}> All Debates ({totalDebates})</h2>
          {activities.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No debates yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {activities.map((activity, idx) => (
                <div
                  key={idx}
                  onClick={() => viewDebateDetail(activity)}
                  style={{
                    padding: '16px',
                    backgroundColor: '#0a0a0a',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.backgroundColor = '#1a1a1a';
                    e.currentTarget.style.borderColor = '#10a37f';
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.backgroundColor = '#0a0a0a';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#10a37f', fontWeight: '500' }}>{activity.mode}</span>
                      <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>{activity.topic}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        color: activity.score >= 70 ? '#10a37f' : (activity.score >= 50 ? '#f59e0b' : '#ef4444'),
                        fontWeight: '600',
                        fontSize: '16px'
                      }}>
                        {activity.score}%
                      </span>
                      {/* RIGHT ARROW - View Full Debate Indicator */}
                      <span style={{ color: '#10a37f', fontSize: '14px' }}>→</span>
                    </div>
                  </div>
                  <div style={{ color: '#666', fontSize: '11px', marginTop: '8px' }}>
                    {new Date(activity.timestamp * 1000).toLocaleString()} · Duration: {Math.floor(activity.duration / 60)} min {activity.duration % 60} sec
                  </div>
                  {/* VIEW FULL DEBATE TEXT */}
                  <div style={{ color: '#10a37f', fontSize: '11px', marginTop: '8px' }}>
                     {activity.messages?.length || 0} messages · Click to view full debate →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal - View Full Debate */}
      <AnimatePresence>
        {showChatModal && selectedChat && (
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
              backgroundColor: 'rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(8px)'
            }}
            onClick={() => setShowChatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                backgroundColor: '#121212',
                borderRadius: '24px',
                width: '700px',
                maxWidth: '90%',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #333',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #333',
                background: '#1a1a1a',
                borderRadius: '24px 24px 0 0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '20px' }}> Full Debate</h3>
                  <button onClick={() => setShowChatModal(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#10a37f', fontSize: '13px', background: 'rgba(16,163,127,0.1)', padding: '4px 12px', borderRadius: '20px' }}>Topic: {selectedChat.topic}</span>
                  <span style={{ color: '#f59e0b', fontSize: '13px', background: 'rgba(245,158,11,0.1)', padding: '4px 12px', borderRadius: '20px' }}>Mode: {selectedChat.mode}</span>
                  <span style={{ color: selectedChat.score >= 70 ? '#10a37f' : (selectedChat.score >= 50 ? '#f59e0b' : '#ef4444'), fontSize: '13px', background: 'rgba(16,163,127,0.1)', padding: '4px 12px', borderRadius: '20px' }}>Score: {selectedChat.score}%</span>
                </div>
                <p style={{ color: '#666', fontSize: '12px', marginTop: '12px' }}>{new Date(selectedChat.timestamp * 1000).toLocaleString()} · Duration: {Math.floor(selectedChat.duration / 60)} min {selectedChat.duration % 60} sec</p>
              </div>
              
              {/* Chat Messages */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1, maxHeight: '50vh' }}>
                {selectedChat.messages && selectedChat.messages.length > 0 ? (
                  selectedChat.messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
                      <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', backgroundColor: msg.role === 'user' ? '#10a37f' : '#2a2a2a', color: '#fff' }}>
                        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px' }}>{msg.role === 'user' ? '👤 Student' : '🤖 AI Coach'}</div>
                        <div style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No messages available</div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div style={{ padding: '20px', borderTop: '1px solid #333', background: '#1a1a1a', borderRadius: '0 0 24px 24px' }}>
                <button onClick={() => setShowChatModal(false)} style={{ width: '100%', padding: '12px', background: '#10a37f', border: 'none', borderRadius: '40px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}