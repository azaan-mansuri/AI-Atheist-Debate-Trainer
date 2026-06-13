'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ClassroomDetailPage() {
  const router = useRouter();
  const { classId } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
const API_URL = 'https://debate-backend-78i0.onrender.com';

  useEffect(() => {
    fetchClassroomData();
    fetchActivities();
  }, [classId]);
  
  const fetchClassroomData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/classroom/${classId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setClassroom(data.classroom);
      } else {
        router.push('/dashboard/classroom');
      }
    } catch (err) {
      console.error(err);
      router.push('/dashboard/classroom');
    }
  };
  
  const fetchActivities = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/classroom/${classId}/activities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff' }}>Loading...</div>
      </div>
    );
  }
  
  if (!classroom) return null;
  
  const students = classroom.students || [];
  
  // Calculate average score for a student
  const getStudentAvgScore = (studentId) => {
    const studentActivities = activities.filter(a => a.student_id === studentId);
    if (studentActivities.length === 0) return 0;
    const total = studentActivities.reduce((sum, a) => sum + (a.score || 0), 0);
    return Math.round(total / studentActivities.length);
  };
  
  // Get student activity count
  const getStudentActivityCount = (studentId) => {
    return activities.filter(a => a.student_id === studentId).length;
  };
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: "'Inter', system-ui, sans-serif", padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => router.push('/dashboard/classroom')}
            style={{ background: 'none', border: 'none', color: '#10a37f', cursor: 'pointer', marginBottom: '8px', fontSize: '14px' }}
          >
            ← Back to Classrooms
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: 0 }}>🏫 {classroom.madrasa_name || 'Classroom'}</h1>
          <p style={{ color: '#888', marginTop: '4px' }}>
            Class Code: <span style={{ color: '#10a37f', fontFamily: 'monospace', fontSize: '16px' }}>{classroom.class_code}</span>
          </p>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
            Teacher: {classroom.teacher_name} · Subject: {classroom.subject}
          </p>
        </div>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #333' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10a37f' }}>{students.length}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Total Students</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #333' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10a37f' }}>{activities.length}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Total Debates</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #333' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10a37f' }}>
              {activities.length > 0 
                ? Math.round(activities.reduce((sum, a) => sum + (a.score || 0), 0) / activities.length) 
                : 0}%
            </div>
            <div style={{ fontSize: '13px', color: '#888' }}>Average Score</div>
          </div>
        </div>
        
        {/* Students List */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}> Students ({students.length})</h2>
          {students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#888', marginBottom: '16px' }}>No students joined yet.</p>
              <div style={{ backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '12px', display: 'inline-block' }}>
                <p style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Share this code with your students:</p>
                <p style={{ color: '#10a37f', fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>{classroom.class_code}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {students.map((student, idx) => {
                const avgScore = getStudentAvgScore(student.student_id);
                const debateCount = getStudentActivityCount(student.student_id);
                
                return (
                  <div
                    key={idx}
                    onClick={() => router.push(`/dashboard/classroom/${classId}/student/${student.student_id}`)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '12px',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                  >
                    <div>
                      <div style={{ color: '#fff', fontWeight: '500' }}>{student.student_name}</div>
                      <div style={{ color: '#666', fontSize: '11px', marginTop: '2px' }}>
                        {debateCount} debate{debateCount !== 1 ? 's' : ''} · Joined {new Date(student.joined_at * 1000).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        color: avgScore >= 70 ? '#10a37f' : (avgScore >= 50 ? '#f59e0b' : '#ef4444'), 
                        fontSize: '18px', 
                        fontWeight: '600' 
                      }}>
                        {avgScore}%
                      </span>
                      <span style={{ color: '#10a37f' }}>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Recent Activities */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}> Recent Debates</h2>
          {activities.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No debates yet. Students need to start debating!</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {activities.slice(0, 20).map((activity, idx) => (
                <div key={idx} style={{ padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#10a37f', fontWeight: '500' }}>{activity.student_name}</span>
                      <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>
                        {activity.mode} · {activity.topic}
                      </span>
                    </div>
                    <span style={{ 
                      color: activity.score >= 70 ? '#10a37f' : (activity.score >= 50 ? '#f59e0b' : '#ef4444'),
                      fontWeight: '600' 
                    }}>
                      {activity.score}%
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: '11px', marginTop: '6px' }}>
                    {new Date(activity.timestamp * 1000).toLocaleString()}
                  </div>
                  <div style={{ color: '#555', fontSize: '11px', marginTop: '4px' }}>
                    Duration: {Math.floor(activity.duration / 60)} min {activity.duration % 60} sec
                  </div>
                </div>
              ))}
            </div>
          )}
          {activities.length > 20 && (
            <p style={{ color: '#666', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
              Showing last 20 debates
            </p>
          )}
        </div>
      </div>
    </div>
  );
}