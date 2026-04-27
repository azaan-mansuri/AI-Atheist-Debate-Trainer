'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('Debate');
  const [difficulty, setDifficulty] = useState('Advanced');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(0.85);
  const [pitch, setPitch] = useState(0.7);
  const [manualInput, setManualInput] = useState('');
  const [useVoice, setUseVoice] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [points, setPoints] = useState(0);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debateHistory, setDebateHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [debateStarted, setDebateStarted] = useState(false);
  
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-detect language from text
  const detectLanguageFromText = (text) => {
    const urduPattern = /[اآبپتٹثجچحخدڈذرزژسشصضطظعغفقکگلمنںوہھیئ]/;
    const arabicPattern = /[ء-ي]/;
    const hindiPattern = /[अ-ह]/;
    
    if (urduPattern.test(text)) return 'ur-PK';
    if (arabicPattern.test(text) && !urduPattern.test(text)) return 'ar-SA';
    if (hindiPattern.test(text)) return 'hi-IN';
    return 'en-US';
  };

  const uiText = {
    'en-US': { 
      title: 'AI Debate Simulator', 
      start: 'Start Debate', 
      listening: 'Listening...', 
      logout: 'Logout', 
      points: 'Points', 
      typePlaceholder: 'Type your response...', 
      send: 'Send', 
      replay: 'Replay', 
      stop: 'Stop', 
      clear: 'Clear', 
      typeMode: 'Type',
      voiceMode: 'Voice',
      history: 'History', 
      search: 'Search chats', 
      noHistory: 'No conversation history',
      speed: 'Speed', 
      pitch: 'Pitch', 
      vol: 'Volume',
      learning: 'Learning', 
      debate: 'Debate', 
      chooseLevel: 'Choose Your Level',
      beginner: 'Beginner', 
      intermediate: 'Intermediate', 
      advanced: 'Advanced',
      chooseMode: 'Choose Your Mode',
      user: 'User'
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Save current session to localStorage
  const saveCurrentSession = () => {
    if (messages.length === 0 || !currentSessionId) return;
    const sessionTitle = messages[0]?.content?.substring(0, 40) || 'New debate';
    const newSession = {
      id: currentSessionId,
      title: sessionTitle,
      messages: messages,
      timestamp: new Date().toISOString(),
      mode: mode,
      difficulty: difficulty
    };
    const updatedHistory = [newSession, ...debateHistory.filter(s => s.id !== currentSessionId)].slice(0, 30);
    setDebateHistory(updatedHistory);
    localStorage.setItem('debateHistory', JSON.stringify(updatedHistory));
    // Also save as last active session
    localStorage.setItem('lastActiveSession', JSON.stringify({
      id: currentSessionId,
      messages: messages,
      title: sessionTitle,
      mode: mode,
      difficulty: difficulty
    }));
  };

  // Load last active session on page refresh
 // Load saved data on page load
useEffect(() => {
  const savedHistory = localStorage.getItem('debateHistory');
  if (savedHistory) {
    try {
      setDebateHistory(JSON.parse(savedHistory));
    } catch(e) {
      localStorage.removeItem('debateHistory');
    }
  }
  
  // Load last active session - FIXED
  const lastSession = localStorage.getItem('lastActiveSession');
  if (lastSession) {
    try {
      const session = JSON.parse(lastSession);
      if (session.messages && session.messages.length > 0) {
        setMessages(session.messages);
        setCurrentSessionId(session.id);
        setDebateStarted(true);
        setMode(session.mode || 'Debate');
        setDifficulty(session.difficulty || 'Advanced');
        console.log('✅ Session loaded from refresh:', session.messages.length, 'messages');
      }
    } catch(e) {
      console.error('Failed to load session:', e);
    }
  }
}, []);

  // Auto-save when messages change
  useEffect(() => {
    if (debateStarted && messages.length > 0 && currentSessionId) {
      const timeout = setTimeout(saveCurrentSession, 500);
      return () => clearTimeout(timeout);
    }
  }, [messages, debateStarted]);

  // Save on page before unload (refresh/close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (debateStarted && messages.length > 0 && currentSessionId) {
        localStorage.setItem('lastActiveSession', JSON.stringify({
          id: currentSessionId,
          messages: messages,
          title: messages[0]?.content?.substring(0, 40) || 'New debate',
          mode: mode,
          difficulty: difficulty
        }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [messages, debateStarted, currentSessionId, mode, difficulty]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) router.push('/login');
    else setUser(JSON.parse(userData));
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const filteredHistory = debateHistory.filter(item => {
    return item?.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const groupHistoryByDate = () => {
    const groups = { today: [], yesterday: [], older: [] };
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    filteredHistory.forEach(item => {
      if (!item?.timestamp) {
        groups.older.push(item);
        return;
      }
      try {
        const itemDate = new Date(item.timestamp);
        if (itemDate.toDateString() === today.toDateString()) {
          groups.today.push(item);
        } else if (itemDate.toDateString() === yesterday.toDateString()) {
          groups.yesterday.push(item);
        } else {
          groups.older.push(item);
        }
      } catch(e) {
        groups.older.push(item);
      }
    });
    return groups;
  };

  const speak = (text, lang) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try { window.speechSynthesis.cancel(); } catch(e) {}
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = volume;
        utterance.rate = rate;
        utterance.pitch = pitch;
        
        if (lang === 'ur-PK' || lang === 'hi-IN') {
          utterance.lang = 'hi-IN';
        } else if (lang === 'ar-SA') {
          utterance.lang = 'ar-SA';
        } else {
          utterance.lang = 'en-US';
        }
        
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch(e) { setSpeaking(false); }
    }, 50);
  };

  const initSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice not supported');
      setUseVoice(false);
      return null;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) {
        setLiveTranscript(finalTranscript);
        setTimeout(() => {
          if (finalTranscript.trim()) {
            const detectedLang = detectLanguageFromText(finalTranscript);
            sendMessageWithText(finalTranscript, detectedLang, true);
            setLiveTranscript('');
          }
        }, 800);
      }
    };
    recognition.onerror = () => setLiveTranscript('❌ Try again');
    recognition.onend = () => setIsListening(false);
    return recognition;
  };

  const startListening = () => {
    if (!useVoice) return;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        if (recognitionRef.current) try { recognitionRef.current.abort(); } catch(e) {}
        recognitionRef.current = initSpeechRecognition();
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
        }
      })
      .catch(() => setNotification('🎤 Microphone access denied'));
  };

  const stopListening = () => {
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e) {}
    setIsListening(false);
  };

  const startDebate = async () => {
    setLoading(true);
    setDebateStarted(true);
    const newSessionId = Date.now();
    setCurrentSessionId(newSessionId);
    setPoints(prev => prev + 5);
    
    try {
      const res = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: `Mode: ${mode}, Difficulty: ${difficulty}, Language: en-US` }] }),
      });
      const data = await res.json();
      setMessages([{ role: 'assistant', content: data.reply }]);
      speak(data.reply, 'en-US');
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const sendMessageWithText = async (text, detectedLang, isVoiceMode = false) => {
    if (!text.trim()) return;
    
    const language = detectedLang || detectLanguageFromText(text);
    
    const userMessage = { role: 'user', content: `[${language}] ${text}` };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    
    try {
      const res = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const aiMessage = { role: 'assistant', content: data.reply };
      setMessages([...newMessages, aiMessage]);
      
      if (isVoiceMode) {
        speak(data.reply, language);
      }
      
      setPoints(prev => prev + 10);
    } catch(e) { console.error(e); }
    setLoading(false);
    setManualInput('');
  };

  const handleManualSend = () => {
    if (manualInput.trim()) {
      const detectedLang = detectLanguageFromText(manualInput);
      sendMessageWithText(manualInput, detectedLang, false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActiveSession');
    router.push('/login');
  };

  const loadChatFromHistory = (session) => {
    setMessages(session.messages || []);
    setCurrentSessionId(session.id);
    setMode(session.mode || 'Debate');
    setDifficulty(session.difficulty || 'Advanced');
    setDebateStarted(true);
    setShowSidebar(false);
    scrollToBottom();
    localStorage.setItem('lastActiveSession', JSON.stringify(session));
  };

  const clearHistory = () => {
    setDebateHistory([]);
    localStorage.removeItem('debateHistory');
    localStorage.removeItem('lastActiveSession');
  };

  const clearCurrentChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setDebateStarted(false);
    localStorage.removeItem('lastActiveSession');
  };

  const historyGroups = groupHistoryByDate();
  const t = uiText['en-US'];
  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0a0a0a' : '#f7f7f8',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      
     {/* Sidebar */}
<AnimatePresence>
  {showSidebar && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowSidebar(false)}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }}
      />
      <motion.div
        initial={{ x: -350, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -350, opacity: 0 }}
        style={{
          position: 'fixed', left: 0, top: 0, width: '320px', height: '100%',
          backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
          zIndex: 999,
          display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header - Fixed */}
        <div style={{ 
          padding: '20px 20px 16px 20px', 
          borderBottom: `1px solid ${darkMode ? '#2d2d3a' : '#e5e5e5'}`,
          backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 5
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '10px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '20px'
              }}>🤖</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: darkMode ? '#fff' : '#1a1a2e' }}>{t.title}</h3>
                <p style={{ marginTop: '2px', marginBottom: 0, fontSize: '11px', color: '#8e8ea0' }}>{user?.email?.split('@')[0]}</p>
              </div>
            </div>
            <button onClick={() => setShowSidebar(false)} style={{
              background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: darkMode ? '#fff' : '#333'
            }}>✕</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ padding: '20px', display: 'flex', gap: '12px', borderBottom: `1px solid ${darkMode ? '#2d2d3a' : '#e5e5e5'}` }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: 'rgba(102,126,234,0.1)', borderRadius: '10px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>{points}</div>
            <div style={{ fontSize: '11px', color: '#8e8ea0' }}>{t.points}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: 'rgba(102,126,234,0.1)', borderRadius: '10px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>{debateHistory.length}</div>
            <div style={{ fontSize: '11px', color: '#8e8ea0' }}>Debates</div>
          </div>
        </div>

        {/* Search Bar - STICKY */}
        <div style={{ 
          position: 'sticky', 
          top: '0px', 
          zIndex: 10,
          backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
          padding: '16px 20px',
          borderBottom: `1px solid ${darkMode ? '#2d2d3a' : '#e5e5e5'}`
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: darkMode ? '#2d2d3a' : '#f0f0f0',
            borderRadius: '8px', padding: '8px 12px'
          }}>
            <span style={{ fontSize: '14px', color: '#8e8ea0' }}>🔍</span>
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: darkMode ? '#fff' : '#333', fontSize: '13px'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#8e8ea0'
              }}>✕</button>
            )}
          </div>
        </div>

        {/* History Section - Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '12px', color: '#8e8ea0' }}>📜 {t.history}</h4>
            {debateHistory.length > 0 && (
              <button onClick={clearHistory} style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
            )}
          </div>
          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8e8ea0' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>💬</div>
              <p style={{ fontSize: '12px' }}>{t.noHistory}</p>
            </div>
          ) : (
            <>
              {historyGroups.today.map((item) => (
                <div key={item.id} onClick={() => loadChatFromHistory(item)} style={{
                  padding: '8px 12px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: darkMode ? '#2d2d3a' : '#f0f0f0'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', color: darkMode ? '#fff' : '#333' }}>
                    {item?.title?.substring(0, 35) || 'New debate'}...
                  </p>
                </div>
              ))}
              {historyGroups.yesterday.map((item) => (
                <div key={item.id} onClick={() => loadChatFromHistory(item)} style={{
                  padding: '8px 12px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: darkMode ? '#2d2d3a' : '#f0f0f0'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', color: darkMode ? '#fff' : '#333' }}>{item?.title?.substring(0, 35) || 'New debate'}...</p>
                </div>
              ))}
              {historyGroups.older.map((item) => (
                <div key={item.id} onClick={() => loadChatFromHistory(item)} style={{
                  padding: '8px 12px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: darkMode ? '#2d2d3a' : '#f0f0f0'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', color: darkMode ? '#fff' : '#333' }}>{item?.title?.substring(0, 35) || 'New debate'}...</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Bottom Settings */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${darkMode ? '#2d2d3a' : '#e5e5e5'}` }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{
            width: '100%', padding: '8px', background: 'none', border: 'none', textAlign: 'left',
            color: darkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '13px'
          }}>{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</button>
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} style={{
            width: '100%', padding: '8px', background: 'none', border: 'none', textAlign: 'left',
            color: voiceEnabled ? '#22c55e' : '#ef4444', cursor: 'pointer', fontSize: '13px'
          }}>{voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}</button>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '8px', background: 'none', border: 'none', textAlign: 'left',
            color: '#ef4444', cursor: 'pointer', fontSize: '13px'
          }}>🚪 {t.logout}</button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

      {/* Main Chat Area */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        
        {/* Top Toolbar - STICKY */}
        <div style={{
          position: 'sticky',
          top: '0px',
          zIndex: 100,
          backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
          borderRadius: '16px',
          border: `1px solid ${darkMode ? '#2d2d3a' : '#e5e5e5'}`,
          padding: '12px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          
          {/* Left Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setShowSidebar(true)} style={{
              background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: darkMode ? '#fff' : '#333'
            }}>☰</button>
            <div style={{
              width: '32px', height: '32px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
            }}>🤖</div>
            <span style={{ fontSize: '14px', fontWeight: '500', color: darkMode ? '#fff' : '#333' }}>{t.title}</span>
          </div>

          {/* Center Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '11px', color: '#8e8ea0' }}>{t.chooseLevel}</div>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{
              padding: '5px 10px', borderRadius: '20px', border: `1px solid ${darkMode ? '#40404f' : '#e0e0e0'}`,
              backgroundColor: darkMode ? '#1a1a2e' : '#ffffff', color: darkMode ? '#fff' : '#333', fontSize: '12px', cursor: 'pointer'
            }}>
              <option value="Beginner">🌱 {t.beginner}</option>
              <option value="Intermediate">⚙️ {t.intermediate}</option>
              <option value="Advanced">🔥 {t.advanced}</option>
            </select>
            
            <div style={{ width: '1px', height: '20px', backgroundColor: darkMode ? '#2d2d3a' : '#e5e5e5' }} />
            
            <div style={{ fontSize: '11px', color: '#8e8ea0' }}>{t.chooseMode}</div>
            <select value={mode} onChange={(e) => setMode(e.target.value)} style={{
              padding: '5px 10px', borderRadius: '20px', border: `1px solid ${darkMode ? '#40404f' : '#e0e0e0'}`,
              backgroundColor: darkMode ? '#1a1a2e' : '#ffffff', color: darkMode ? '#fff' : '#333', fontSize: '12px', cursor: 'pointer'
            }}>
              <option value="Learning">🎓 {t.learning}</option>
              <option value="Debate">⚡ {t.debate}</option>
            </select>
            
            <button onClick={startDebate} style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white', padding: '5px 14px', borderRadius: '20px', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '12px'
            }}>
              🚀 {t.start}
            </button>
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: darkMode ? '#2d2d3a' : '#e5e5e5', borderRadius: '20px', padding: '2px', display: 'inline-flex' }}>
              <button onClick={() => setUseVoice(false)} style={{
                backgroundColor: !useVoice ? '#667eea' : 'transparent',
                color: !useVoice ? 'white' : (darkMode ? '#fff' : '#666'),
                padding: '5px 12px', borderRadius: '18px', border: 'none', cursor: 'pointer', fontSize: '12px'
              }}>
                {t.typeMode}
              </button>
              <button onClick={() => setUseVoice(true)} style={{
                backgroundColor: useVoice ? '#667eea' : 'transparent',
                color: useVoice ? 'white' : (darkMode ? '#fff' : '#666'),
                padding: '5px 12px', borderRadius: '18px', border: 'none', cursor: 'pointer', fontSize: '12px'
              }}>
                {t.voiceMode}
              </button>
            </div>

            {useVoice && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: darkMode ? '#2d2d3a' : '#f0f0f0', padding: '4px 12px', borderRadius: '20px' }}>
                <span style={{ fontSize: '10px', color: '#8e8ea0' }}>{t.speed}</span>
                <input type="range" min="0.5" max="1.5" step="0.05" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} style={{ width: '60px' }} />
                <span style={{ fontSize: '10px', color: '#8e8ea0' }}>{t.pitch}</span>
                <input type="range" min="0.5" max="1.5" step="0.05" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} style={{ width: '60px' }} />
                <span style={{ fontSize: '10px', color: '#8e8ea0' }}>{t.vol}</span>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: '60px' }} />
                <button onClick={isListening ? stopListening : startListening} style={{
                  backgroundColor: isListening ? '#ef4444' : '#22c55e',
                  width: '32px', height: '32px', borderRadius: '50%', fontSize: '14px', border: 'none', cursor: 'pointer'
                }}>
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
            )}

            <div style={{ padding: '4px 10px', backgroundColor: darkMode ? '#2d2d3a' : '#f0f0f0', borderRadius: '20px', fontSize: '11px', color: darkMode ? '#fff' : '#333', display: 'flex', alignItems: 'center', gap: '6px' }}>
              👤 {t.user}: {user?.email?.split('@')[0]}
            </div>

            {messages.length > 0 && voiceEnabled && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => speak(messages[messages.length - 1].content)} style={{
                  background: 'none', border: 'none', color: '#8e8ea0', cursor: 'pointer', fontSize: '12px', padding: '4px 8px'
                }}>
                  {t.replay}
                </button>
                <button onClick={() => window.speechSynthesis.cancel()} style={{
                  background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', padding: '4px 8px'
                }}>
                  {t.stop}
                </button>
                <button onClick={clearCurrentChat} style={{
                  background: 'none', border: 'none', color: '#8e8ea0', cursor: 'pointer', fontSize: '12px', padding: '4px 8px'
                }}>
                  {t.clear}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Type Mode Indicator */}
        {!useVoice && (
          <div style={{
            backgroundColor: 'rgba(102,126,234,0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <span style={{ color: '#667eea', fontSize: '12px' }}>⌨️ {t.typeMode} Mode — Type your response (AI will NOT speak)</span>
          </div>
        )}

        {/* Voice Mode Indicator */}
        {useVoice && isListening && (
          <div style={{
            backgroundColor: 'rgba(34,197,94,0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <span style={{ color: '#22c55e', fontSize: '12px' }}>🎤 {t.voiceMode} Mode — Speak now, AI will respond</span>
            <p style={{ fontSize: '13px', marginTop: '4px', marginBottom: 0, color: darkMode ? '#fff' : '#333' }}>{liveTranscript || '...'}</p>
          </div>
        )}

        {/* AI Typing Indicator */}
        {loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
            padding: '10px 16px', backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
            borderRadius: '20px', width: 'fit-content', border: `1px solid ${darkMode ? '#2d2d3a' : '#e5e5e5'}`
          }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#667eea', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></span>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#667eea', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }}></span>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#667eea', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }}></span>
            </div>
            <span style={{ fontSize: '12px', color: '#8e8ea0' }}>AI is thinking...</span>
          </div>
        )}

       {/* Messages Container - Fixed Height with Scroll */}
<div style={{ 
  height: 'calc(100vh - 300px)', 
  overflowY: 'auto', 
  marginBottom: '20px',
  paddingRight: '8px',
  display: 'flex',
  flexDirection: 'column'
}}>
  {messages.length === 0 ? (
    <div style={{ textAlign: 'center', padding: '80px 20px', margin: 'auto' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
      <h3 style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: darkMode ? '#fff' : '#333' }}>Strengthen your reasoning</h3>
      <p style={{ color: '#8e8ea0', fontSize: '13px', marginTop: '8px', marginBottom: 0 }}>Choose your level and mode, then click Start Debate</p>
    </div>
  ) : (
    messages.map((msg, idx) => (
      <div key={idx} style={{
        display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px'
      }}>
        <div style={{
          maxWidth: '75%',
          backgroundColor: msg.role === 'user' ? '#667eea' : (darkMode ? '#2d2d3a' : '#ffffff'),
          color: msg.role === 'user' ? 'white' : (darkMode ? '#fff' : '#333'),
          padding: '10px 14px', borderRadius: '18px', fontSize: '13px', lineHeight: 1.4
        }}>
          {msg.content}
        </div>
      </div>
    ))
  )}
  {loading && (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
      <div style={{ backgroundColor: darkMode ? '#2d2d3a' : '#e5e5e5', padding: '10px 14px', borderRadius: '18px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#667eea', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></span>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#667eea', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }}></span>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#667eea', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }}></span>
        </div>
      </div>
    </div>
  )}
  <div ref={messagesEndRef} />
</div>

        {/* Input Area */}
        {!useVoice ? (
  <div style={{
    position: 'sticky',
    bottom: '0px',
    zIndex: 100,
    display: 'flex', gap: '8px', alignItems: 'center',
    backgroundColor: darkMode ? '#2d2d3a' : '#ffffff',
    border: `1px solid ${darkMode ? '#40404f' : '#e5e5e5'}`,
    borderRadius: '24px', padding: '8px 16px',
    marginTop: '16px'
  }}>
    <input
      ref={inputRef}
      type="text"
      value={manualInput}
      onChange={(e) => setManualInput(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleManualSend()}
      placeholder={t.typePlaceholder}
      style={{
        flex: 1, background: 'none', border: 'none', outline: 'none',
        color: darkMode ? '#fff' : '#333', fontSize: '14px'
      }}
      autoFocus
    />
    <button onClick={handleManualSend} style={{
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      border: 'none', borderRadius: '20px', padding: '6px 16px',
      color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: '500'
    }}>
      {t.send}
    </button>
  </div>
) : (
  <div style={{
    position: 'sticky',
    bottom: '0px',
    zIndex: 100,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundColor: darkMode ? '#2d2d3a' : '#ffffff',
    border: `1px solid ${darkMode ? '#40404f' : '#e5e5e5'}`,
    borderRadius: '40px', padding: '12px',
    marginTop: '16px'
  }}>
    <button onClick={isListening ? stopListening : startListening} style={{
      backgroundColor: isListening ? '#ef4444' : '#22c55e',
      color: 'white', padding: '10px 20px', borderRadius: '40px',
      border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
    }}>
      {isListening ? '🔴 Stop Recording' : '🎤 Start Speaking'}
    </button>
  </div>
)}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${darkMode ? '#1a1a2e' : '#f0f0f0'}; }
        ::-webkit-scrollbar-thumb { background: ${darkMode ? '#2d2d3a' : '#cbd5e1'}; border-radius: 4px; }
      `}</style>
    </div>
  );
}