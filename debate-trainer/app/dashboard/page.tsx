'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface Config {
  mode: string;
  persona: string;
  topic: string;
  difficulty: string;
  language: string;
  voiceOutput: string;
  isClassroomDebate?: boolean;
  classroomId?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Setup states
  const [mode, setMode] = useState('Debate');
  const [persona, setPersona] = useState('New Atheist');
  const [topic, setTopic] = useState('Problem of Evil');
  const [difficulty, setDifficulty] = useState('Advanced');
  const [language, setLanguage] = useState('English');
  const [voiceOutput, setVoiceOutput] = useState('Spoken aloud');
  
  // Session states
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  // Classroom states
  const [entryMode, setEntryMode] = useState<string | null>(null);
  const [hasJoinedClass, setHasJoinedClass] = useState(false);
  const [joinedClassInfo, setJoinedClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  
  // Personas data
  const personas = [
    { name: 'New Atheist', icon: '🤖', description: 'Hitchens/Dawkins lineage. Confrontational, soundbite-driven, treats religion as sociologically harmful.', color: '#10a37f' },
    { name: 'Philosopher', icon: '🧠', description: 'Analytic philosopher. Logical arguments, syllogisms, metaphysical rigor.', color: '#3b82f6' },
    { name: 'Secular Feminist', icon: '⚡', description: 'Focus on religious patriarchy, bodily autonomy, institutional critique.', color: '#ec4899' },
    { name: 'Historian', icon: '📜', description: 'Historical criticism, textual analysis, source criticism.', color: '#f59e0b' },
    { name: 'Scientific Materialist', icon: '🔬', description: 'Empiricism, falsifiability, methodological naturalism.', color: '#8b5cf6' },
    { name: 'Ex-Muslim Atheist', icon: '🕌', description: 'Personal experience + theological critique. Insider perspective.', color: '#ef4444' },
    { name: 'Rationalist', icon: '⚖️', description: 'Reason, logic, argumentation. Focus on logical consistency.', color: '#06b6d4' },
    { name: 'Evolutionary Biologist', icon: '🧬', description: 'Evolution, natural selection, intelligent design critique.', color: '#84cc16' },
    { name: 'Secular Liberal', icon: '🗳️', description: 'Political secularism, church-state separation, religious freedom.', color: '#a855f7' },
    { name: 'Skeptic', icon: '🧪', description: 'Agnostic-leaning, demands empirical evidence, focuses on burden of proof.', color: '#f43f5e' }
  ];
  
  // Topics data
  const topics = [
    { name: 'Problem of Evil', description: 'Logical (Mackie), evidential (Rowe), soul-making (Hick), Islamic theodicy' },
    { name: 'God\'s Existence', description: 'Cosmological, teleological, moral arguments. Contingency, design, morality.' },
    { name: 'Prophethood', description: 'Prophethood, miracles, finality. Rationality of belief in prophets.' },
    { name: 'Quranic Preservation', description: 'Textual criticism, oral tradition, manuscript evidence.' },
    { name: 'Trinity & Tawheed', description: 'Monotheism vs. Trinity. Logical consistency, scriptural analysis.' },
    { name: 'Science & Religion', description: 'Conflict thesis, compatibility, methodological naturalism.' },
    { name: 'Morality without God', description: 'Moral realism, evolutionary ethics, objective morality.' },
    { name: 'Afterlife & Justice', description: 'Problem of injustice, divine justice, resurrection.' },
    { name: 'Religious Diversity', description: 'Pluralism, exclusivism, salvific efficacy.' },
    { name: 'Free Will & Predestination', description: 'Divine foreknowledge, human agency, theological determinism.' },
    { name: 'Secularism & Blasphemy', description: 'Religious laws, apostasy penalties, freedom of speech vs divine law.' },
    { name: 'Religious Trauma', description: 'Psychological harm, leaving faith, family rejection, deconstruction.' }
  ];
  
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const languages = ['English', 'اردو', 'العربية'];
  const voiceOptions = ['Text only', 'Spoken aloud'];
  const modes = ['Debate', 'Cross-Examination', 'Learning', 'Mock Public'];

  const languageMap = {
  'English': 'en-US',
  'اردو': 'ur-PK',
  'العربية': 'ar-SA'
};
  
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
    
    checkJoinedClassrooms();
  }, []);

  const checkJoinedClassrooms = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/classroom/joined-classes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.classrooms && data.classrooms.length > 0) {
        setHasJoinedClass(true);
        setJoinedClassInfo(data.classrooms[0]);
      } else {
        setHasJoinedClass(false);
      }
    } catch (err) {
      console.error('Error checking joined classrooms:', err);
      setHasJoinedClass(false);
    } finally {
      setLoading(false);
    }
  };

 const startSession = () => {
  const newSessionId = Date.now();
  setSessionId(newSessionId);
  setSessionStarted(true);
  
  // Check if classroom debate mode is active
  const debateMode = localStorage.getItem('debateMode');
  const classroomId = localStorage.getItem('classroomId');
  
  const config: Config = {
    mode, 
    persona, 
    topic, 
    difficulty, 
    language: languageMap[language] || 'en-US',  
    voiceOutput
  };
    
    if (debateMode === 'classroom' && classroomId) {
      config.isClassroomDebate = true;
      config.classroomId = classroomId;
      // Clear after use
      localStorage.removeItem('debateMode');
      localStorage.removeItem('classroomId');
    }
    
    localStorage.setItem(`session_${newSessionId}_config`, JSON.stringify(config));
    router.push(`/dashboard/arena?id=${newSessionId}`);
  };

  const goToClassroom = () => {
    router.push('/dashboard/classroom');
  };

 const goToStudentProgress = () => {
  router.push('/dashboard/my-progress');
};

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Entry Mode Selection Screen
  if (!entryMode) {
    const isStudent = user?.role === 'student';
    
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #10a37f, #1a7f64)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>🎙️</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Welcome, {user?.email?.split('@')[0]}!</h2>
            <p style={{ color: '#888' }}>How would you like to proceed?</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Option 1: Individual Practice */}
            <button
              onClick={() => setEntryMode('individual')}
              style={{
                padding: '28px 24px',
                backgroundColor: '#1a1a1a',
                border: '2px solid #10a37f',
                borderRadius: '24px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#10a37f20'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '40px' }}>👤</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Individual Practice</div>
                  <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Practice alone, track your own progress and history</p>
                </div>
                <span style={{ color: '#10a37f', fontSize: '24px' }}>→</span>
              </div>
            </button>
            
            {/* Option 2: Classroom Mode */}
            <button
              onClick={goToClassroom}
              style={{
                padding: '28px 24px',
                backgroundColor: '#1a1a1a',
                border: '2px solid #10a37f',
                borderRadius: '24px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#10a37f20'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '40px' }}>🏫</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Classroom Mode</div>
                  <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Create a class for your students or join as a student</p>
                </div>
                <span style={{ color: '#10a37f', fontSize: '24px' }}>→</span>
              </div>
            </button>

            {/* Option 3: Join Classroom Debate - Only for students who joined a class */}
            {isStudent && hasJoinedClass && (
              <button
                onClick={() => setEntryMode('student-debate')}
                style={{
                  padding: '28px 24px',
                  backgroundColor: '#1a1a1a',
                  border: '2px solid #f59e0b',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f59e0b20'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '40px' }}>🎯</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Join Classroom Debate</div>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Practice with your class! Your teacher will track your progress.</p>
                  </div>
                  <span style={{ color: '#f59e0b', fontSize: '24px' }}>→</span>
                </div>
              </button>
            )}
          </div>

          {/* Show message if student hasn't joined any class */}
          {isStudent && !hasJoinedClass && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#1a1a1a', borderRadius: '16px', textAlign: 'center', border: '1px solid #10a37f40' }}>
              <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                💡 <span style={{ color: '#10a37f' }}>Join a classroom</span> using your teacher's code to see the "Join Classroom Debate" option.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Student Debate Mode Selection (After joining classroom) - ONLY 2 OPTIONS
 // Student Debate Mode Selection (After joining classroom) - ONLY 2 OPTIONS
if (entryMode === 'student-debate') {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setEntryMode(null)}
            style={{ background: 'none', border: 'none', color: '#10a37f', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}
          >
            ← Back
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #10a37f, #1a7f64)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 16px' }}>🏫</div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: 0 }}>Student Debate Mode</h1>
            <p style={{ color: '#888', marginTop: '8px' }}>
              You joined: <span style={{ color: '#10a37f', fontWeight: '500' }}>{joinedClassInfo?.madrasa_name || joinedClassInfo?.teacher_name || 'Classroom'}</span>
            </p>
          </div>
        </div>

        {/* ✅ 2 OPTIONS - SIDE BY SIDE */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',  // Side by side
          justifyContent: 'center',
          gap: '32px', 
          flexWrap: 'wrap',  // Mobile pe wrap ho jayega
          maxWidth: '900px', 
          margin: '0 auto' 
        }}>
          
          {/* Option 1: Classroom Debate */}
          <button
            onClick={() => {
              localStorage.setItem('debateMode', 'classroom');
              localStorage.setItem('classroomId', joinedClassInfo?._id);
              router.push('/dashboard/classroom-debate');
            }}
            style={{
              flex: 1,
              minWidth: '280px',
              backgroundColor: '#1a1a1a',
              border: '2px solid #f59e0b',
              borderRadius: '20px',
              padding: '40px 24px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f59e0b20'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>👨‍🏫</div>
            <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>Classroom Debate</h3>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
              Choose your persona, topic, and difficulty level. Your teacher will track your progress.
            </p>
            <div style={{ marginTop: '24px', color: '#f59e0b', fontSize: '15px', fontWeight: '500' }}>
              Let's Debate →
            </div>
          </button>

          {/* Option 2: View Progress */}
          <button
            onClick={goToStudentProgress}
            style={{
              flex: 1,
              minWidth: '280px',
              backgroundColor: '#1a1a1a',
              border: '2px solid #3b82f6',
              borderRadius: '20px',
              padding: '40px 24px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3b82f620'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>View My Progress</h3>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
              See your debate scores, progress chart, and teacher feedback.
            </p>
            <div style={{ marginTop: '24px', color: '#3b82f6', fontSize: '15px', fontWeight: '500' }}>
              View Progress →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

  // EXISTING DASHBOARD UI (Individual Mode)
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{
  position: 'sticky',
  top: 0,
  zIndex: 50,
  backgroundColor: '#0a0a0a',
  borderBottom: '1px solid #2d2d3a',
  padding: '16px 24px'
}}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>
        AI Atheism Debate Simulator
      </h1>
      <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
        AI-powered training for scholars & students of knowledge
      </p>
    </div>
    
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      
      {/* ✅ MY PROGRESS BUTTON - YAHAN ADD KARO */}
      <button 
        onClick={() => router.push('/individual-progress')} 
        style={{
          padding: '8px 20px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #10a37f',
          borderRadius: '40px',
          color: '#10a37f',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#10a37f20'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
      >
        📊 My Progress
      </button>
      
      {/* Classroom Button */}
      {hasJoinedClass && user?.role === 'student' && (
        <button
          onClick={() => setEntryMode('student-debate')}
          style={{
            padding: '8px 20px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #f59e0b',
            borderRadius: '40px',
            color: '#f59e0b',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f59e0b20'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
        >
          🏫 Go to Classroom
        </button>
      )}
      
    </div>
  </div>
</div>
      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '40px'
        }}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #2d2d3a' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#10a37f' }}>10</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Personas</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #2d2d3a' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#10a37f' }}>12</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Topics</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #2d2d3a' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#10a37f' }}>3</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Languages</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #2d2d3a' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#10a37f' }}>6</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Criteria</div>
          </div>
        </div>

        {/* Mode Selection */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Mode</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {modes.map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: mode === m ? '#10a37f' : '#1a1a1a',
                  border: '1px solid #2d2d3a',
                  borderRadius: '40px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
            {mode === 'Debate' && 'AI argues back at you — full two-way debate'}
            {mode === 'Cross-Examination' && 'AI only asks questions — you defend your position'}
            {mode === 'Learning' && 'AI evaluates your answers and gives feedback with scores'}
            {mode === 'Mock Public' && '🎤 AI acts as a live audience — tough questions, heckling & real-world challenges'}
          </p>
        </div>

        {/* Persona Selection */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Persona</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {personas.map(p => (
              <button
                key={p.name}
                onClick={() => setPersona(p.name)}
                style={{
                  padding: '16px',
                  backgroundColor: persona === p.name ? p.color + '20' : '#1a1a1a',
                  border: `1px solid ${persona === p.name ? p.color : '#2d2d3a'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{p.icon}</span>
                  <span style={{ fontWeight: '600', color: '#fff' }}>{p.name}</span>
                  {persona === p.name && <span style={{ marginLeft: 'auto', color: p.color }}>✓</span>}
                </div>
                <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: '1.4' }}>
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Topic Selection */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Topic</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {topics.map(t => (
              <button
                key={t.name}
                onClick={() => setTopic(t.name)}
                style={{
                  padding: '16px',
                  backgroundColor: topic === t.name ? '#10a37f20' : '#1a1a1a',
                  border: `1px solid ${topic === t.name ? '#10a37f' : '#2d2d3a'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#fff' }}>{t.name}</span>
                  {topic === t.name && <span style={{ marginLeft: 'auto', color: '#10a37f' }}>✓</span>}
                </div>
                <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: '1.4' }}>
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty & Language Row */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Difficulty</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: difficulty === d ? '#10a37f' : '#1a1a1a',
                    border: '1px solid #2d2d3a',
                    borderRadius: '40px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Language</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {languages.map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: language === l ? '#10a37f' : '#1a1a1a',
                    border: '1px solid #2d2d3a',
                    borderRadius: '40px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Voice Output */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>AI Voice Output</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {voiceOptions.map(v => (
              <button
                key={v}
                onClick={() => setVoiceOutput(v)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: voiceOutput === v ? '#10a37f' : '#1a1a1a',
                  border: '1px solid #2d2d3a',
                  borderRadius: '40px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Begin Session Button */}
        <button
          onClick={startSession}
          style={{
            width: 'auto',
            padding: '12px 32px',
            backgroundColor: '#10a37f',
            border: 'none',
            borderRadius: '40px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a7f64'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#10a37f'; }}
        >
          Start Debate →
        </button>
      </div>
    </div>
  );
}