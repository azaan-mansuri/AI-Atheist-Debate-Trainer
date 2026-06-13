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

export default function ClassroomDebateSetup() {
  const router = useRouter();
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [classroomName, setClassroomName] = useState('');
  
  // Setup states
  const [mode, setMode] = useState('Debate');
  const [persona, setPersona] = useState('New Atheist');
  const [topic, setTopic] = useState('Problem of Evil');
  const [difficulty, setDifficulty] = useState('Advanced');
  const [language, setLanguage] = useState('English');
  const [voiceOutput, setVoiceOutput] = useState('Spoken aloud');
  
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
    // Get classroom info from localStorage
    const debateMode = localStorage.getItem('debateMode');
    const storedClassroomId = localStorage.getItem('classroomId');
    
    if (debateMode !== 'classroom' || !storedClassroomId) {
      router.push('/dashboard');
      return;
    }
    
    setClassroomId(storedClassroomId);
    fetchClassroomInfo(storedClassroomId);
  }, []);

  const fetchClassroomInfo = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/classroom/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setClassroomName(data.classroom.madrasa_name || data.classroom.teacher_name || 'Classroom');
      }
    } catch (err) {
      console.error('Error fetching classroom:', err);
    }
  };

 const startDebate = () => {
  const newSessionId = Date.now();
  
  const config: Config = {
    mode, 
    persona, 
    topic, 
    difficulty, 
    language: languageMap[language] || 'en-US',  // ✅ YEH LINE CHANGE KARO
    voiceOutput,
    isClassroomDebate: true,
    classroomId: classroomId || undefined
  };
  
  localStorage.setItem(`session_${newSessionId}_config`, JSON.stringify(config));
  localStorage.removeItem('debateMode');
  localStorage.removeItem('classroomId');
  
  router.push(`/dashboard/arena?id=${newSessionId}&classroom=true`);
};
  const goBack = () => {
    localStorage.removeItem('debateMode');
    localStorage.removeItem('classroomId');
    router.push('/dashboard');
  };

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
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>
              Classroom Debate Setup
            </h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
              {classroomName} · Your teacher will track your progress
            </p>
          </div>
          <button
            onClick={goBack}
            style={{
              padding: '8px 20px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '40px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Classroom Info Banner */}
        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px',
          border: '1px solid #f59e0b40',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #1a1a1a 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '40px' }}>👨‍🏫</span>
            <div>
              <div style={{ fontSize: '14px', color: '#f59e0b' }}>Classroom Debate Mode</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#fff' }}>{classroomName}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                Your teacher will track your scores, progress, and debate history
              </div>
            </div>
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

        {/* Start Debate Button */}
        <button
          onClick={startDebate}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#f59e0b',
            border: 'none',
            borderRadius: '40px',
            color: '#000',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e67e22'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f59e0b'; }}
        >
          🚀 Start Classroom Debate →
        </button>
      </div>
    </div>
  );
}