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
const [messages, setMessages] = useState([]);
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
  const [showShareSubMenu, setShowShareSubMenu] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
const shareMenuRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const sidebarRef = useRef(null);
  const useVoiceRef = useRef(false);
  const loadingRef = useRef(false);
  const messagesRef = useRef([]);
  const manualStopRef = useRef(false);
const [showProfileMenu, setShowProfileMenu] = useState(false);
const profileMenuRef = useRef(null);
const silenceTimerRef = useRef(null);
const [showAboutModal, setShowAboutModal] = useState(false);
  
const API_URL = 'https://debate-backend-78i0.onrender.com';

  // Fix: Mark component as mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep refs in sync with state so closures always see latest value
  useEffect(() => {
    useVoiceRef.current = useVoice;
  }, [useVoice]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

 useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
      setShowShareSubMenu(false); // ✅ Sub-menu bhi band karo
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
  
  // ✅ Load messages from localStorage
  const savedMessages = localStorage.getItem(`arena_messages_${sessionId}`);
  if (savedMessages) {
    try {
      const parsed = JSON.parse(savedMessages);
      if (parsed.length > 0) {
        setMessages(parsed);
        console.log('📦 Loaded', parsed.length, 'messages from storage');
      }
    } catch(e) {
      console.error('Error loading messages:', e);
    }
  }
}, [mounted, sessionId]);

  // Save messages to localStorage whenever they change
useEffect(() => {
  if (mounted && sessionId && messages.length > 0) {
    localStorage.setItem(`arena_messages_${sessionId}`, JSON.stringify(messages));
    console.log('💾 Saved messages to localStorage:', messages.length);
  }
}, [messages, sessionId, mounted]);

 const cleanMessage = (content) => {
  if (!content) return '';
  
  // Remove language tags
  let cleaned = content.replace(/^\[(ur-PK|en-US|ar-SA)\]\s*/, '');
  
  // ✅ Remove score from display
  cleaned = cleaned.replace(/\s*Score:\s*\d+\s*\/\s*10\s*$/i, '');
  cleaned = cleaned.replace(/\s*نمبر:\s*\d+\s*\/\s*10\s*$/i, '');
  
  return cleaned;
};

 const sendMessage = async (text) => {
  if (!text.trim() || loading) return;

  if (messages.length === 0 && !sessionStartTime) {
    setSessionStartTime(Date.now());
     localStorage.setItem(`session_${sessionId}_start_time`, String(Date.now()));
  }

  let userContent = text;
  
  if (messages.length === 0 && sessionConfig) {
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
  
  // ✅ Directly add user message
  setMessages(prev => [...prev, userMessage]);
  setManualInput('');
  setLoading(true);

  try {
   const res = await fetch(`${API_URL}/api/debate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [...messages, userMessage] }),
});

// ✅ CHECK RESPONSE STATUS FIRST
if (!res.ok) {
  console.error('❌ Backend error:', res.status);
  setLoading(false);
  return;
}

const data = await res.json();

// ✅ CHECK IF DATA EXISTS
if (!data || !data.reply) {
  console.error('❌ Invalid response from backend:', data);
  setLoading(false);
  return;
}

let reply = data.reply;
    const hasScore = reply.match(/(\d+)\/10/);
    
    if (!hasScore) {
      reply = reply + "\n\nScore: 5/10";
      console.log('⚠️ No score found, added default 5/10');
    }
    
    // ✅ Clean reply - score hatao display se
// ✅ Clean reply - score hatao display se (STRONGER)
let cleanReply = reply;
// Remove Score: X/10 from anywhere in the text
cleanReply = cleanReply.replace(/Score:\s*\d+\s*\/\s*10/gi, '');
cleanReply = cleanReply.replace(/نمبر:\s*\d+\s*\/\s*10/gi, '');
// Remove any extra spaces or punctuation after score removal
cleanReply = cleanReply.replace(/\s*[،,.]?\s*$/, '');
// Remove double spaces
cleanReply = cleanReply.replace(/\s{2,}/g, ' ');

const aiMessage = { role: 'assistant', content: cleanReply };
setMessages(prev => [...prev, aiMessage]);

    const scoreMatch = reply.match(/(\d+)\/10/);
    if (scoreMatch) {
      setPoints(prev => prev + parseInt(scoreMatch[1]));
    }
  } catch (err) {
    console.error('Send message error:', err);
    setMessages(prev => prev.slice(0, -1));
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
  if (isListening) {
    console.log('⚠️ Already listening');
    return;
  }
  manualStopRef.current = false; // user ne fresh se start kiya hai, ab auto-restart allowed hai

  // ✅ Seedha recognition start karo — click gesture turant use karo, beech me koi async step nahi.
  // Mic permission recognition khud maang lega; agar deny hoga toh onerror me 'not-allowed' pakdenge.
  console.log('🎤 Attempting to start recognition directly...');
  startRecognition();
};

const startRecognition = () => {
  // ✅ AGAR PEHLE SE ACTIVE HAI TOH BAND KARO
  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    } catch(e) {
      console.log('⚠️ Error stopping existing recognition:', e);
    }
  }

  // ✅ THORA SA DELAY DO TAAKE STOP COMPLETE HO
  setTimeout(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // ✅ CHECK KARO BROWSER SUPPORT
    if (!SpeechRecognition) {
      alert('❌ Your browser does not support speech recognition. Please use Chrome or Edge.');
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    const langMap = {
      'en-US': 'en-US',
      'ur-PK': 'en-US',
      'ar-SA': 'en-US',
    };
    const userLang = sessionConfig?.language || 'en-US';
    recognition.lang = langMap[userLang] || 'en-US';
    console.log('🌐 Recognition language:', recognition.lang);

    let isProcessing = false;
    let currentTranscript = '';
    let speechDetected = false;

    recognition.onstart = () => {
      console.log('🎤 Mic is ON - Start speaking');
      setIsListening(true);
      isProcessing = false;
      currentTranscript = '';
      speechDetected = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    recognition.onsound = () => {
      console.log('🔊 Sound detected!');
      speechDetected = true;
    };

    recognition.onaudiostart = () => {
      console.log('🎧 Audio capturing started — mic se data aa raha hai');
    };

    recognition.onspeechstart = () => {
      console.log('🗣️ Speech started — awaz detect ho rahi hai');
      speechDetected = true;
    };

    recognition.onaudioend = () => {
      console.log('🎧 Audio capturing ended');
    };

    recognition.onspeechend = () => {
      console.log('🛑 Speech ended');
    };

    recognition.onend = () => {
      console.log('🛑 Recognition ended');
      recognitionRef.current = null;

      if (manualStopRef.current) {
        console.log('✅ Manual stop — restart nahi karenge');
        setIsListening(false);
        return;
      }

      if (useVoiceRef.current && !loadingRef.current) {
        console.log('🔄 Continuous mode: auto-restarting mic...');
        setTimeout(() => {
          if (!manualStopRef.current && recognitionRef.current === null) {
            startListening();
          }
        }, 300);
      } else {
        setIsListening(false);
      }
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          console.log('✅ Final:', finalTranscript);
        } else {
          interimTranscript += transcript;
          console.log('⏳ Interim:', interimTranscript);
        }
      }

      if (finalTranscript) {
        speechDetected = true;
        currentTranscript = finalTranscript;
        setManualInput(currentTranscript);

        if (useVoiceRef.current && !isProcessing && finalTranscript.trim()) {
          console.log('📤 Sending:', finalTranscript);
          isProcessing = true;
          const textToSend = finalTranscript;
          currentTranscript = '';
          setManualInput('');
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          sendMessage(textToSend);
          setTimeout(() => { isProcessing = false; }, 500);
        }
        return;
      }

      if (interimTranscript) {
        speechDetected = true;
        setManualInput(interimTranscript);
      }
    };

    // ✅ FIXED: Better error handling
    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      
      // ✅ "aborted" error ko ignore karo (yeh tab aata hai jab hum .stop() call karte hain)
      if (event.error === 'aborted') {
        console.log('ℹ️ Recognition aborted (normal when stopping)');
        return;
      }
      
      if (event.error === 'no-speech') {
        // Kuch mat karo — onend khud fire hoga aur continuous mode me apne aap restart kar dega
        return;
      }
      
      if (event.error === 'not-allowed') {
        alert('🔴 Please allow microphone access in browser settings');
        manualStopRef.current = true;
        setIsListening(false);
        return;
      }
      
      // Kisi anjaan error pe bhi continuous mode me restart try karo (agar manual stop nahi hua)
      if (!manualStopRef.current && useVoiceRef.current) {
        setTimeout(() => startListening(), 500);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      console.log('▶️ recognition.start() called successfully');
    } catch (err) {
      console.error('❌ recognition.start() threw an error:', err);
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, 100); // ✅ 100ms DELAY
};

    

 const stopListening = () => {
  console.log('🛑 Stopping mic manually');
  manualStopRef.current = true; // ab auto-restart bilkul nahi hoga
  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop();
    } catch(e) {}
    recognitionRef.current = null;
  }
  setIsListening(false);
  if (silenceTimerRef.current) {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  }
};

 const endSession = async () => {
  if (!mounted) return;
  
  // ✅ Mic band karo agar chal raha hai
  if (isListening) {
    stopListening();
  }
  
  const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;
  const classroomId = localStorage.getItem('current_classroom_id');
  
  // ✅ CALCULATE FINAL SCORE (0-100)
  let totalScore = 0;
  let messageCount = 0;
  
  messages.forEach((msg) => {
    if (msg.role === 'assistant') {
      const scoreMatch = msg.content.match(/(\d+)\/10/);
      if (scoreMatch) {
        totalScore += parseInt(scoreMatch[1]);
        messageCount++;
      }
    }
  });
  
  const finalScore = messageCount > 0 ? Math.round((totalScore / messageCount) * 10) : 0;
  
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
          score: finalScore,
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
    title: `${sessionConfig?.persona || 'Debate'} · ${sessionConfig?.topic || 'Topic'}`,
    messages: messages,
    points: finalScore,
    timestamp: Date.now()
  };

  const existingHistory = JSON.parse(localStorage.getItem('dashboard_history') || '[]');
  const updatedHistory = [historyItem, ...existingHistory].slice(0, 50);
  localStorage.setItem('dashboard_history', JSON.stringify(updatedHistory));
  
  localStorage.setItem(`review_${sessionId}_messages`, JSON.stringify(messages));
  localStorage.setItem(`review_${sessionId}_points`, String(finalScore));
  
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
  setShowAboutModal(true);
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

      {/* Sidebar Bottom - Completely Empty */}
<div style={{ flexShrink: 0, minHeight: '10px' }}></div>
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
    {/* 3 Dots Button */}
    <div style={{ position: 'relative' }} ref={shareMenuRef}>
      <button 
        onClick={() => {
          setShowShareMenu(!showShareMenu);
          setShowShareSubMenu(false);
        }} 
        style={{ 
          padding: '8px 12px', 
          backgroundColor: '#1a1a1a', 
          border: '1px solid #333', 
          borderRadius: '8px', 
          color: '#fff', 
          cursor: 'pointer', 
          fontSize: '20px', 
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          transition: 'all 0.2s ease',
          lineHeight: '1'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
      >
        ⋮
      </button>
      
      {/* Pehla Menu - Sirf "Share" option */}
      {showShareMenu && !showShareSubMenu && (
        <div style={{ 
          position: 'absolute', 
          top: '45px', 
          right: '0', 
          width: '180px', 
          backgroundColor: '#1a1a1a', 
          border: '1px solid #333', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)', 
          zIndex: 200, 
          overflow: 'hidden' 
        }}>
          <button 
            onClick={() => setShowShareSubMenu(true)} 
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '14px', 
              textAlign: 'left', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span>🔗</span> Share <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#666' }}>›</span>
          </button>
        </div>
      )}

      {/* Sub-Menu - Share ke andar 3 options */}
      {showShareSubMenu && (
        <div style={{ 
          position: 'absolute', 
          top: '45px', 
          right: '0', 
          width: '200px', 
          backgroundColor: '#1a1a1a', 
          border: '1px solid #333', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)', 
          zIndex: 201, 
          overflow: 'hidden'
        }}>
          <button 
            onClick={() => setShowShareSubMenu(false)} 
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              borderBottom: '1px solid #333',
              color: '#888', 
              cursor: 'pointer', 
              fontSize: '12px', 
              textAlign: 'left', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              transition: 'all 0.2s ease' 
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span>←</span> Back
          </button>
          
          <button 
            onClick={() => { shareViaWhatsApp(); setShowShareSubMenu(false); setShowShareMenu(false); }} 
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '13px', 
              textAlign: 'left', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              transition: 'all 0.2s ease' 
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span></span> WhatsApp
          </button>
          
          <button 
            onClick={() => { copyChatToClipboard(); setShowShareSubMenu(false); setShowShareMenu(false); }} 
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '13px', 
              textAlign: 'left', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              transition: 'all 0.2s ease' 
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span></span> Copy Chat
          </button>
          
          <button 
            onClick={() => { downloadChat(); setShowShareSubMenu(false); setShowShareMenu(false); }} 
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '13px', 
              textAlign: 'left', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              transition: 'all 0.2s ease' 
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span></span> Download Chat
          </button>
        </div>
      )}
    </div>
    
    {/* End Session Button */}
    <button onClick={endSession} style={{ padding: '8px 16px', backgroundColor: '#dc2626', border: 'none', borderRadius: '20px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>End Session</button>
    
    {/* ✅ Profile Circle with Dropdown - Yahan sahi jagah */}
    <div style={{ position: 'relative' }} ref={profileMenuRef}>
      <div 
        onClick={() => setShowProfileMenu(!showProfileMenu)} 
        style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: '2px solid #333',
          transition: 'all 0.2s ease',
          flexShrink: 0,
          userSelect: 'none'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10a37f'; e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <span style={{ 
          color: '#fff', 
          fontSize: '16px', 
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          {user?.email?.charAt(0) || 'U'}
        </span>
      </div>

      {/* Profile Dropdown Menu */}
      {showProfileMenu && (
        <div style={{ 
          position: 'absolute', 
          top: '50px', 
          right: '0', 
          backgroundColor: '#1a1a1a', 
          border: '1px solid #333', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)', 
          zIndex: 200, 
          minWidth: '200px', 
          overflow: 'hidden' 
        }}>
          {/* User Info */}
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>
                {user?.email?.split('@')[0] || 'User'}
              </div>
              <div style={{ color: '#888', fontSize: '11px' }}>
                {user?.email || ''}
              </div>
            </div>
          </div>

          {/* Settings */}
          <button 
            onClick={handleSettings} 
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '13px', 
              textAlign: 'left', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              transition: 'all 0.2s ease' 
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span></span> Settings
          </button>
          
          {/* About */}
          <button 
            onClick={handleAbout} 
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '13px', 
              textAlign: 'left', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              transition: 'all 0.2s ease' 
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span></span> About
          </button>
          
          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#333', margin: '4px 0' }} />
          
          {/* Logout */}
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#ef4444', 
              cursor: 'pointer', 
              fontSize: '13px', 
              textAlign: 'left', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              transition: 'all 0.2s ease' 
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2d3a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span></span> Logout
          </button>
        </div>
      )}
    </div>
  </div>
</div>
        

        <div style={{ position: 'sticky', top: isMobile ? '72px' : '72px', zIndex: 49, backgroundColor: '#0a0a0a', padding: isMobile ? '8px 16px' : '10px 24px', borderBottom: '1px solid #2d2d3a', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? 12 : 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 24, padding: '3px', gap: '4px', border: '1px solid #333' }}>
             <button 
  onClick={() => {
    // Type mode select karo
    setUseVoice(false);
    // Agar mic ON hai toh band karo
    if (isListening) {
      stopListening();
    }
  }} 
  style={{ 
    padding: isMobile ? '6px 16px' : '8px 24px', 
    backgroundColor: !useVoice ? '#10a37f' : 'transparent', 
    color: !useVoice ? 'white' : '#e5e5e5', 
    border: 'none', 
    borderRadius: 20, 
    cursor: 'pointer', 
    fontSize: isMobile ? 12 : 14, 
    fontWeight: '500' 
  }}
>
  ⌨️ Type
</button>

<button 
  onClick={() => {
    // Sirf voice mode select karo — mic tabhi start hoga jab "Start Speaking" button dabaoge
    setUseVoice(true);
  }}
  style={{ 
    padding: isMobile ? '6px 16px' : '8px 24px', 
    backgroundColor: useVoice ? '#10a37f' : 'transparent', 
    color: useVoice ? 'white' : '#e5e5e5', 
    border: 'none', 
    borderRadius: 20, 
    cursor: 'pointer', 
    fontSize: isMobile ? 12 : 14, 
    fontWeight: '500' 
  }}
>
  🎤 Voice
</button>
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

   {/* About Modal */}
{showAboutModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }} onClick={() => setShowAboutModal(false)}>
    <div style={{
      maxWidth: '650px',
      width: '100%',
      backgroundColor: '#1a1a1a',
      borderRadius: '24px',
      border: '1px solid #333',
      maxHeight: '85vh',
      overflowY: 'auto',
      position: 'relative'
    }} onClick={(e) => e.stopPropagation()}>
      
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#1a1a1a',
        padding: '20px 24px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: 0 }}>ℹ️ About</h2>
        <button 
          onClick={() => setShowAboutModal(false)} 
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            margin: '0 auto 16px',
            boxShadow: '0 4px 15px rgba(16,163,127,0.3)'
          }}>🎙️</div>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
            AI Atheism Debate Training Platform
          </h3>
          <div style={{ 
            display: 'inline-block',
            background: '#10a37f20',
            padding: '4px 12px',
            borderRadius: '20px',
            marginTop: '4px'
          }}>
            <p style={{ color: '#10a37f', fontSize: '12px', margin: 0 }}>⚡ Empowering Ulama e Ikram ⚡</p>
          </div>
        </div>

        {/* ===== MISSION & VISION ===== */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* Mission */}
          <div style={{
            background: '#0a0a0a',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #2a2a2a'
          }}>
            <h4 style={{ color: '#10a37f', fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span></span> Our Mission
            </h4>
            <p style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
              To provide scholars and students of knowledge with a structured, repeatable, and effective AI-powered platform to strengthen their reasoning skills against atheistic arguments.
            </p>
          </div>

          {/* Vision */}
          <div style={{
            background: '#0a0a0a',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #2a2a2a'
          }}>
            <h4 style={{ color: '#10a37f', fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span></span> Our Vision
            </h4>
            <p style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
              A world where every scholar and student of knowledge has access to advanced AI training tools, enabling them to confidently respond to atheistic objections and strengthen Islamic Dawah globally.
            </p>
          </div>
        </div>

        {/* ===== WHY WE BUILT THIS ===== */}
        <div style={{ 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #0a1a2a, #0a0a0a)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #1a3a4a'
        }}>
          <h4 style={{ color: '#10a37f', fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span></span> Why We Built This
          </h4>
          <p style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.6, marginBottom: '12px' }}>
            In today's digital age, atheistic arguments are spreading rapidly through social media, YouTube, and online forums. Ulama e Ikram need:
          </p>
          <ul style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.8, margin: 0, paddingLeft: '20px' }}>
            <li>A safe space to practice without judgment</li>
            <li>Diverse atheist personas to prepare for real debates</li>
            <li>Instant feedback to identify weaknesses</li>
            <li>24/7 availability for consistent practice</li>
            <li>Progress tracking to measure improvement</li>
          </ul>
          <p style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.6, marginTop: '12px' }}>
            This AI-powered platform solves all these needs — making debate training accessible, effective, and scalable.
          </p>
        </div>

        {/* ===== BENEFITS / WHO WILL BENEFIT ===== */}
        <div style={{ 
          marginBottom: '24px',
          background: '#0a0a0a',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #2a2a2a'
        }}>
          <h4 style={{ color: '#10a37f', fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span></span> Who Will Benefit & How
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#10a37f', fontSize: '18px' }}>🎓</span>
              <div>
                <strong style={{ color: '#fff', fontSize: '13px' }}>Ulama e Ikram</strong>
                <p style={{ color: '#aaa', fontSize: '11px', margin: '2px 0 0' }}>Practice real debates, refine arguments, gain confidence</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#10a37f', fontSize: '18px' }}>👨‍🏫</span>
              <div>
                <strong style={{ color: '#fff', fontSize: '13px' }}>Teachers & Madrasas</strong>
                <p style={{ color: '#aaa', fontSize: '11px', margin: '2px 0 0' }}>Create classrooms, track student progress, assign practice</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#10a37f', fontSize: '18px' }}>📚</span>
              <div>
                <strong style={{ color: '#fff', fontSize: '13px' }}>Students of Knowledge</strong>
                <p style={{ color: '#aaa', fontSize: '11px', margin: '2px 0 0' }}>Build foundational skills before real-world Dawah</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#10a37f', fontSize: '18px' }}>🌍</span>
              <div>
                <strong style={{ color: '#fff', fontSize: '13px' }}>Dawah Organizations</strong>
                <p style={{ color: '#aaa', fontSize: '11px', margin: '2px 0 0' }}>Train volunteers and speakers systematically</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== HOW TO BECOME AN EXPERT ===== */}
        <div style={{ 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #0a2a1a, #0a0a0a)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #1a3a2a'
        }}>
          <h4 style={{ color: '#10a37f', fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span></span> How to Become an Expert Using This Platform
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#10a37f', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>1</span>
              <span style={{ color: '#ddd', fontSize: '12px' }}><strong>Practice Daily:</strong> 15-20 minutes of consistent practice</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#10a37f', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>2</span>
              <span style={{ color: '#ddd', fontSize: '12px' }}><strong>Try All Personas:</strong> Each persona has unique arguments — master them all</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#10a37f', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>3</span>
              <span style={{ color: '#ddd', fontSize: '12px' }}><strong>Review AI Coach Analysis:</strong> Learn from your mistakes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#10a37f', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>4</span>
              <span style={{ color: '#ddd', fontSize: '12px' }}><strong>Increase Difficulty:</strong> Start Beginner → Progress to Expert</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#10a37f', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>5</span>
              <span style={{ color: '#ddd', fontSize: '12px' }}><strong>Use Voice Mode:</strong> Simulate real debates by speaking naturally</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#10a37f', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>6</span>
              <span style={{ color: '#ddd', fontSize: '12px' }}><strong>Study Suggested Resources:</strong> Follow AI recommendations for deeper learning</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#10a37f', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>7</span>
              <span style={{ color: '#ddd', fontSize: '12px' }}><strong>Track Progress:</strong> Watch your scores improve over time</span>
            </div>
          </div>
          <div style={{
            marginTop: '14px',
            padding: '10px',
            background: '#0a0a0a',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#10a37f', fontSize: '11px', margin: 0 }}>
               Consistent practice on this platform will transform you into a confident debater!
            </p>
          </div>
        </div>

        {/* Features Grid - Compact */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ color: '#10a37f', fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span></span> Key Features
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '8px'
          }}>
            {[
              '10+ Atheist Personas',
              '12 Debate Topics',
              '4 Debate Modes',
              '3 Languages (English, Urdu, Arabic)',
              'Voice Mode (Continuous Listening)',
              'AI Coach Analysis',
              'Classroom Mode',
              'Auto-save & Share'
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#aaa', background: '#0a0a0a', padding: '6px 10px', borderRadius: '8px' }}>
                <span style={{ color: '#10a37f' }}>✅</span> {feature}
              </div>
            ))}
          </div>
        </div>

        {/* How It Works - Simple Steps */}
        <div style={{ 
          marginBottom: '24px',
          background: '#0a0a0a',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #2a2a2a'
        }}>
          <h4 style={{ color: '#10a37f', fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span></span> Quick Start Guide
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              '1. Create Account',
              '2. Choose Individual or Classroom Mode',
              '3. Select Persona, Topic & Difficulty',
              '4. Choose Language & Input Method',
              '5. Start Debate → Respond → Get Feedback',
              '6. End Session → View AI Analysis'
            ].map((step, i) => (
              <div key={i} style={{ fontSize: '11px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10a37f' }}>▸</span> {step}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: '#1a0000',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '20px',
          border: '1px solid #330000'
        }}>
          <h4 style={{ color: '#ff6666', fontSize: '13px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚠️</span> AI Disclaimer
          </h4>
          <p style={{ color: '#ffaaaa', fontSize: '11px', lineHeight: 1.5, margin: 0 }}>
            AI can make mistakes. Always verify critical information from authentic Islamic sources. Use as a training aid, not for fatwa.
          </p>
        </div>

        {/* Contact & Credits - Updated with Contact Message */}
        <div style={{
          background: 'linear-gradient(135deg, #0a1a1a, #0a0a0a)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #10a37f40',
          textAlign: 'center'
        }}>
          {/* Contact Message */}
          <div style={{ marginBottom: '12px' }}>
            <p style={{
              color: '#888',
              fontSize: '12px',
              margin: '0 0 8px 0',
              letterSpacing: '0.3px'
            }}>
              📩 For any queries, doubts, or issues — feel free to reach out
            </p>
            <h4 style={{ color: '#10a37f', fontSize: '13px', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span></span> Contact
            </h4>
            <a 
              href="mailto:azaanmansuri900@gmail.com"
              style={{
                color: '#10a37f',
                fontSize: '12px',
                textDecoration: 'none',
                background: '#1a1a1a',
                padding: '4px 14px',
                borderRadius: '20px',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#10a37f20'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
            >
              azaanmansuri900@gmail.com
            </a>
          </div>

          <div style={{ height: '1px', background: '#333', margin: '12px 0' }} />

          {/* Credits */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ color: '#888', fontSize: '11px' }}>Developed by</span>
              <span style={{ color: '#10a37f', fontSize: '12px', fontWeight: '600' }}>Azaan Mansuri</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{ color: '#888', fontSize: '11px' }}>Supervised by</span>
              <span style={{ color: '#10a37f', fontSize: '12px', fontWeight: '600' }}>Dr. Mufti Yasir Nadeem Al Wajidi</span>
            </div>
            <div style={{
              display: 'inline-block',
              background: '#10a37f10',
              padding: '3px 10px',
              borderRadius: '16px'
            }}>
              <p style={{ color: '#10a37f', fontSize: '10px', margin: 0 }}>
                © 2026 — For Dawah training of Ulama e Ikram
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
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
