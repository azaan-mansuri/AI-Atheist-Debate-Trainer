'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function MyProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [classroomInfo, setClassroomInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progressStats, setProgressStats] = useState({
    total_debates: 0,
    total_score: 0,
    average_score: 0,
    completed_classes: 0
  });
  
  const API_URL = 'https://debate-backend-78i0.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch(e) {}
    }
    
    fetchStudentProgress();
  }, []);

  const fetchStudentProgress = async () => {
    const token = localStorage.getItem('token');
    
    try {
      // Use new /api/my-progress endpoint
      const res = await fetch(`${API_URL}/api/my-progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      console.log('📊 My Progress Response:', data);
      
      if (data.success) {
        const progress = data.progress;
        setProgressStats({
          total_debates: progress.total_debates || 0,
          total_score: progress.total_score || 0,
          average_score: progress.average_score || 0,
          completed_classes: progress.completed_classes || 0
        });
        
        setClassroomInfo({
          _id: 'progress',
          madrasa_name: 'My Learning Progress'
        });
        
        // Create a summary activity
        const summaryActivity: Activity = {
          session_id: 'progress_summary',
          mode: 'Overview',
          topic: 'Your Progress Summary',
          score: progress.average_score || 0,
          duration: 0,
          messages: [],
          timestamp: Date.now() / 1000
        };
        
        setActivities(progress.total_debates > 0 ? [summaryActivity] : []);
      } else {
        console.log('No progress data found');
        setActivities([]);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #1a1a1a', borderTopColor: '#10a37f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const totalDebates = progressStats.total_debates;
  const averageScore = progressStats.average_score;
  const totalScore = progressStats.total_score;
  const completedClasses = progressStats.completed_classes;
  
  const scoreTrend = [averageScore];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: "'Inter', system-ui, sans-serif", padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ background: 'none', border: 'none', color: '#10a37f', cursor: 'pointer', marginBottom: '8px', fontSize: '14px' }}
          >
            ← Back to Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #10a37f, #1a7f64)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
              🎓
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: 0 }}>My Progress</h1>
              {classroomInfo && (
                <p style={{ color: '#888', marginTop: '4px' }}>
                  {completedClasses} Classroom{completedClasses !== 1 ? 's' : ''} Joined
                </p>
              )}
              {user && (
                <p style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>
                  Student: {user.email?.split('@')[0] || 'Student'}
                </p>
              )}
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
              {totalScore}
            </div>
            <div style={{ fontSize: '13px', color: '#888' }}>Total Points</div>
          </div>
        </div>
        
        {/* Score Display */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>📊 Overall Performance</h2>
          <div style={{ 
            width: '100%', 
            backgroundColor: '#0a0a0a', 
            borderRadius: '20px', 
            height: '30px', 
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{ 
              width: `${averageScore}%`, 
              height: '100%', 
              backgroundColor: averageScore >= 70 ? '#10a37f' : (averageScore >= 50 ? '#f59e0b' : '#ef4444'),
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end', 
              paddingRight: '8px',
              color: '#fff', 
              fontSize: '12px', 
              fontWeight: '500'
            }}>
              {averageScore}%
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: '#888', fontSize: '12px' }}>🎯 Target: 70%</span>
            </div>
            <div>
              <span style={{ color: averageScore >= 70 ? '#10a37f' : '#888', fontSize: '12px' }}>
                {averageScore >= 70 ? '✅ Goal Achieved!' : '📈 Keep Practicing!'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Completed Classes Info */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>🏆 Achievements</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '12px' }}>
              <span style={{ fontSize: '32px' }}>🏫</span>
              <div>
                <div style={{ color: '#fff', fontWeight: '500' }}>Classrooms Joined</div>
                <div style={{ color: '#10a37f', fontSize: '24px', fontWeight: '700' }}>{completedClasses}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '12px' }}>
              <span style={{ fontSize: '32px' }}>⭐</span>
              <div>
                <div style={{ color: '#fff', fontWeight: '500' }}>Total Points Earned</div>
                <div style={{ color: '#f59e0b', fontSize: '24px', fontWeight: '700' }}>{totalScore}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* All Debates Info */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>📋 Your Journey</h2>
          {totalDebates === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No debates yet. Start debating to see your progress!</p>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#0a0a0a', borderRadius: '12px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>Great Start!</h3>
              <p style={{ color: '#888' }}>
                You have completed {totalDebates} debate{totalDebates !== 1 ? 's' : ''} across {completedClasses} classroom{completedClasses !== 1 ? 's' : ''}.
                <br />
                Your average score is {averageScore}%. Keep practicing to improve!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}