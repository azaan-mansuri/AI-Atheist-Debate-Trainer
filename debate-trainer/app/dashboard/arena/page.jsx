'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';

// Main component that uses useSearchParams
function ArenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');
  
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useLocalStorage(`arena_messages_${sessionId}`, []);
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [sessionConfig, setSessionConfig] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [useVoice, setUseVoice] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);
const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debateHistory, setDebateHistory] = useLocalStorage('dashboard_history', []);
  const [pinnedChats, setPinnedChats] = useLocalStorage('pinned_chats', []);
  const [points, setPoints] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
const shareMenuRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const sidebarRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
const profileMenuRef = useRef(null);
  
const API_URL = 'https://debate-backend-78i0.onrender.com';

  // Fix: Mark component as mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check mobile
  useEffect(() => {
  if (!mounted) return;
  
  const checkMobile = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, [mounted]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !sidebarOpen) return;
    
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);


  // Close share menu when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
      setShowShareMenu(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    if (!mounted) return;
    scrollToBottom();
  }, [messages, loading, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
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
    
    const config = localStorage.getItem(`session_${sessionId}_config`);
    if (config) {
      setSessionConfig(JSON.parse(config));
    } else {
      router.push('/dashboard');
    }
    
    const savedHistory = localStorage.getItem('dashboard_history');
    if (savedHistory) {
      try {
        setDebateHistory(JSON.parse(savedHistory));
      } catch(e) {}
    }
  }, [mounted, sessionId]);

  const cleanMessage = (content) => {
    if (!content) return '';
    return content.replace(/^\[(ur-PK|en-US|ar-SA)\]\s*/, '');
  };

  const sendMessage = async (text) => {
  if (!text.trim() || loading) return;

  if (messages.length === 0 && !sessionStartTime) {
    setSessionStartTime(Date.now());
  }

  let messagesToSend = [...messages];

  // FIRST MESSAGE: Inject persona/topic/difficulty info for backend
  let userContent = text;
  
 if (messages.length === 0 && sessionConfig) {
  // ✅ Get language from sessionConfig (default to en-US)
  let languageCode = 'en-US';
  const selectedLang = sessionConfig.language;
  
  if (selectedLang === 'ur-PK' || selectedLang === 'اردو') {
    languageCode = 'ur-PK';
  } else if (selectedLang === 'ar-SA' || selectedLang === 'العربية') {
    languageCode = 'ar-SA';
  } else if (selectedLang === 'en-US' || selectedLang === 'English') {
    languageCode = 'en-US';
  }
  
  userContent = `Persona: ${sessionConfig.persona || 'New Atheist'}
Topic: ${sessionConfig.topic || 'Problem of Evil'}
Difficulty: ${sessionConfig.difficulty || 'Advanced'}
Mode: ${sessionConfig.mode || 'Debate'}
Language: ${languageCode}

User: ${userContent}`;
}

  const userMessage = { role: 'user', content: userContent };
  messagesToSend = [...messagesToSend, userMessage];

  setMessages(messagesToSend);
  setManualInput('');
  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/api/debate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messagesToSend }),
    });
    const data = await res.json();
    const aiMessage = { role: 'assistant', content: data.reply };
    setMessages([...messagesToSend, aiMessage]);

    const scoreMatch = data.reply.match(/(\d+)\/10/);
    if (scoreMatch) {
      setPoints(prev => prev + parseInt(scoreMatch[1]));
    }
  } catch (err) {
    console.error('Send message error:', err);
  } finally {
    setLoading(false);
  }
};
     

  const handleManualSend = () => {
    if (manualInput.trim()) {
      sendMessage(manualInput);
    }
  };

  const startListening = () => {
    if (!mounted) return;
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice not supported in this browser');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      sendMessage(text);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const endSession = async () => {
  if (!mounted) return;
  
  const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;
  const classroomId = localStorage.getItem('current_classroom_id');
  
  if (classroomId && sessionConfig) {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/classroom/log-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          class_id: classroomId,
          student_name: user?.email?.split('@')[0] || 'Student',
          session_id: sessionId,
          mode: sessionConfig.mode,
          persona: sessionConfig.persona,
          topic: sessionConfig.topic,
          messages: messages.slice(-20),
          score: points,
          duration: duration
        })
      });
      console.log('✅ Activity logged to classroom');
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  }

  const historyItem = {
    id: sessionId,
    title: `${sessionConfig.persona} · ${sessionConfig.topic}`,
    messages: messages,
    points: points,
    timestamp: Date.now()
  };

  const existingHistory = JSON.parse(localStorage.getItem('dashboard_history') || '[]');
  const updatedHistory = [historyItem, ...existingHistory].slice(0, 50);
  localStorage.setItem('dashboard_history', JSON.stringify(updatedHistory));
  
  localStorage.setItem(`review_${sessionId}_messages`, JSON.stringify(messages));
  localStorage.setItem(`review_${sessionId}_points`, points);
  router.push(`/dashboard/review?id=${sessionId}`);
};

  const shareViaWhatsApp = () => {
    if (messages.length === 0) {
      alert('No messages to share');
      return;
    }
    
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? '👤 User' : '🤖 AI'}:\n${msg.content}`
    ).join('\n\n---\n\n');
    
    const encodedText = encodeURIComponent(chatText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    setShowShareMenu(false);
  };

  const copyChatToClipboard = () => {
    if (messages.length === 0) {
      alert('No messages to copy');
      return;
    }
    
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? '👤 User' : '🤖 AI'}:\n${msg.content}`
    ).join('\n\n---\n\n');
    
    navigator.clipboard.writeText(chatText);
    alert('Chat copied to clipboard!');
    setShowShareMenu(false);
  };

  const downloadChat = () => {
    if (messages.length === 0) {
      alert('No messages to download');
      return;
    }
    
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? '👤 User' : '🤖 AI'}:\n${msg.content}`
    ).join('\n\n---\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate_chat_${new Date().toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowShareMenu(false);
  };

  const shareCurrentChat = () => {
    if (messages.length === 0) {
      alert('No messages to share');
      return;
    }
    
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'AI'}:\n${msg.content}`
    ).join('\n\n---\n\n');
    
    navigator.clipboard.writeText(chatText);
    alert('Chat copied to clipboard!');
  };

  const loadChatFromHistory = (session) => {
    setMessages(session.messages || []);
    setPoints(session.points || 0);
    if (isMobile) setSidebarOpen(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setPoints(0);
    if (isMobile) setSidebarOpen(false);
  };

  const filteredHistory = debateHistory.filter(item => 
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const handleSettings = () => {
    alert('Settings coming soon!');
    setShowProfileMenu(false);
  };

  const handleAbout = () => {
    alert('AI Atheism Debate Simulator v1.0\n\nAI-powered training for scholars & students of knowledge');
    setShowProfileMenu(false);
  };

  const pinned = filteredHistory.filter(i => pinnedChats.includes(i.id));
  const unpinned = filteredHistory.filter(i => !pinnedChats.includes(i.id));

  if (!mounted || !user || !sessionConfig) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: '#000', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', overflow: 'hidden', position: 'relative' }}>
      
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, transition: 'all 0.3s ease' }} />
      )}

      <div ref={sidebarRef} style={{
        width: isMobile ? (sidebarOpen ? 280 : 0) : (sidebarOpen ? 280 : 72),
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid #222',
        height: '100vh',
        position: isMobile ? 'fixed' : 'relative',
        left: 0,
        top: 0,
        zIndex: isMobile ? 1000 : 10,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s ease, transform 0.3s ease',
        transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        flexShrink: 0
      }}>
        
        {!isMobile && (
          <div style={{ padding: sidebarOpen ? '16px 16px 8px 16px' : '12px 0', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 36, height: 36, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>
        )}

        {isMobile && sidebarOpen && (
          <div style={{ padding: '16px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}></span>
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' }}>✕</button>
          </div>
        )}

        <div style={{ padding: '16px', borderBottom: '1px solid #222', flexShrink: 0 }}>
          <button onClick={startNewChat} style={{ width: '100%', padding: sidebarOpen ? '12px 16px' : '12px 0', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: 10 }}>
            <span>+</span>
            {sidebarOpen && <span>New chat</span>}
          </button>
        </div>

        {sidebarOpen && (
          <div style={{ padding: '16px', borderBottom: '1px solid #222', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#1a1a1a', borderRadius: 8, padding: '8px 12px', border: '1px solid #333' }}>
              <span>🔍</span>
              <input type="text" placeholder="Search chats" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13 }} />
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: sidebarOpen ? '16px' : '8px', minHeight: 0 }}>
          {sidebarOpen && <h4 style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>History</h4>}
          
          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 8px', color: '#888' }}>
              <div style={{ fontSize: sidebarOpen ? 32 : 24 }}>💬</div>
              {sidebarOpen && <p style={{ fontSize: 12 }}>No history</p>}
            </div>
          ) : (
            <>
              {pinned.map(item => (
                <div key={item.id} onClick={() => loadChatFromHistory(item)} style={{ padding: sidebarOpen ? '8px 12px' : '8px', marginBottom: 4, borderRadius: 8, backgroundColor: 'rgba(245,158,11,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
                  <div style={{ fontSize: 13, color: '#fff' }}>📌</div>
                  {sidebarOpen && (
                    <div style={{ marginLeft: 8 }}>
                      <div style={{ fontSize: 13, color: '#fff' }}>{item.title?.substring(0, 28)}</div>
                      <div style={{ fontSize: 10, color: '#888' }}>{item.points || 0} pts</div>
                    </div>
                  )}
                </div>
              ))}
              {unpinned.map(item => (
                <div key={item.id} onClick={() => loadChatFromHistory(item)} style={{ padding: sidebarOpen ? '8px 12px' : '8px', marginBottom: 4, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
                  <div style={{ fontSize: 13, color: '#fff' }}>💬</div>
                  {sidebarOpen && (
                    <div style={{ marginLeft: 8 }}>
                      <div style={{ fontSize: 13, color: '#fff' }}>{item.title?.substring(0, 30)}</div>
                      <div style={{ fontSize: 10, color: '#888' }}>{item.points || 0} pts</div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ padding: sidebarOpen ? '16px' : '12px', borderTop: '1px solid #222', flexShrink: 0, position: 'relative' }} ref={profileMenuRef}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #10a37f, #1a7f64)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
              {sidebarOpen && (
                <div>
                  <div style={{ fontSize: 12, color: '#fff' }}>{user?.email?.split('@')[0]}</div>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px', padding: '4px 8px', borderRadius: '4px', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                ⋮
              </button>
            )}
          </div>
          
          {showProfileMenu && sidebarOpen && (
            <div style={{ position: 'absolute', bottom: '100%', left: '16px', marginBottom: '8px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 200, minWidth: '150px', overflow: 'hidden' }}>
              <button onClick={handleSettings} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <span></span> Settings
              </button>
              <button onClick={handleAbout} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <span></span> About
              </button>
              <div style={{ height: '1px', backgroundColor: '#333', margin: '4px 0' }} />
              <button onClick={handleLogout} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <span></span> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <div style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#0a0a0a', borderBottom: '1px solid #2d2d3a', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ width: '36px', height: '36px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☰</button>
            )}
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0 }}>AI Atheism Debate Simulator</h1>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{sessionConfig.persona} · {sessionConfig.topic} · {sessionConfig.difficulty}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }} ref={shareMenuRef}>
              <button onClick={() => setShowShareMenu(!showShareMenu)} style={{ padding: '8px 16px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '20px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🔗</span> Share <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
              </button>
              {showShareMenu && (
                <div style={{ position: 'absolute', top: '45px', right: '0', width: '180px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden' }}>
                  <button onClick={shareViaWhatsApp} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}><span></span> WhatsApp</button>
                  <button onClick={copyChatToClipboard} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}><span></span> Copy Chat</button>
                  <button onClick={downloadChat} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}><span></span> Download Chat</button>
                </div>
              )}
            </div>
            <button onClick={endSession} style={{ padding: '8px 16px', backgroundColor: '#dc2626', border: 'none', borderRadius: '20px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>End Session</button>
          </div>
        </div>

        <div style={{ position: 'sticky', top: isMobile ? '72px' : '72px', zIndex: 49, backgroundColor: '#0a0a0a', padding: isMobile ? '8px 16px' : '10px 24px', borderBottom: '1px solid #2d2d3a', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? 12 : 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 24, padding: '3px', gap: '4px', border: '1px solid #333' }}>
              <button onClick={() => setUseVoice(false)} style={{ padding: isMobile ? '6px 16px' : '8px 24px', backgroundColor: !useVoice ? '#10a37f' : 'transparent', color: !useVoice ? 'white' : '#e5e5e5', border: 'none', borderRadius: 20, cursor: 'pointer', fontSize: isMobile ? 12 : 14, fontWeight: '500' }}>⌨️ Type</button>
              <button onClick={() => setUseVoice(true)} style={{ padding: isMobile ? '6px 16px' : '8px 24px', backgroundColor: useVoice ? '#10a37f' : 'transparent', color: useVoice ? 'white' : '#e5e5e5', border: 'none', borderRadius: 20, cursor: 'pointer', fontSize: isMobile ? 12 : 14, fontWeight: '500' }}>🎤 Voice</button>
            </div>
            {messages.length === 0 && (
  <button onClick={() => {
    let defaultMessage = "I'm ready to debate";
    if (sessionConfig?.language === 'ur-PK') {
      defaultMessage = "میں بحث کرنے کے لیے تیار ہوں";
    } else if (sessionConfig?.language === 'ar-SA') {
      defaultMessage = "أنا مستعد للمناظرة";
    }
    sendMessage(defaultMessage);
  }} style={{ padding: isMobile ? '6px 16px' : '8px 24px', backgroundColor: '#10a37f', border: 'none', borderRadius: 24, color: '#fff', cursor: 'pointer', fontSize: isMobile ? 12 : 14, fontWeight: '500' }}> Start Debate</button>
)}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 16px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎙️</div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>Ready to debate?</h3>
              <p style={{ color: '#888', fontSize: 14 }}>Type or speak your response below</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
                <div style={{ maxWidth: '80%', backgroundColor: msg.role === 'user' ? '#10a37f' : '#1a1a1a', color: '#fff', padding: '10px 14px', borderRadius: 18, fontSize: 14, lineHeight: 1.5 }}>
                  {cleanMessage(msg.content)}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
              <div style={{ backgroundColor: '#1a1a1a', padding: '10px 14px', borderRadius: 18 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ width: 8, height: 8, backgroundColor: '#10a37f', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></span>
                  <span style={{ width: 8, height: 8, backgroundColor: '#10a37f', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }}></span>
                  <span style={{ width: 8, height: 8, backgroundColor: '#10a37f', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #2d2d3a', backgroundColor: '#0a0a0a' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {!useVoice ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <textarea ref={inputRef} value={manualInput} onChange={(e) => setManualInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleManualSend(); } }} placeholder="Type your response..." rows={1} style={{ flex: 1, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 20, padding: '10px 14px', color: '#fff', fontSize: 14, resize: 'none', fontFamily: 'inherit', outline: 'none' }} onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'; }} />
                <button onClick={handleManualSend} style={{ padding: '0 20px', backgroundColor: '#10a37f', border: 'none', borderRadius: 20, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Send</button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={isListening ? stopListening : startListening} style={{ padding: '12px 20px', backgroundColor: isListening ? '#dc2626' : '#10a37f', border: 'none', borderRadius: 40, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isListening ? '🔴 Stop Recording' : '🎤 Start Speaking'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

// Wrap with Suspense boundary
export default function ArenaPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
        <div>Loading arena...</div>
      </div>
    }>
      <ArenaContent />
    </Suspense>
  );
}
