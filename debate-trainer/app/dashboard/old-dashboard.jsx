'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '../hooks/useLocalStorage';


export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('Debate');
  const [difficulty, setDifficulty] = useState('Advanced');
  const [messages, setMessages] = useLocalStorage('dashboard_messages', []);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US'); 
  const [manualInput, setManualInput] = useState('');
  const [useVoice, setUseVoice] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [points, setPoints] = useLocalStorage('dashboard_points', 0);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debateHistory, setDebateHistory] = useLocalStorage('dashboard_history', []);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [debateStarted, setDebateStarted] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [pinnedChats, setPinnedChats] = useLocalStorage('pinned_chats', []);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Group Chat states
  const [showGroupChatModal, setShowGroupChatModal] = useState(false);
  const [groupLink, setGroupLink] = useState('');
  const [groupChatId, setGroupChatId] = useState(null);
  const [groupMembers, setGroupMembers] = useLocalStorage('group_members', {});
  const [groupMessages, setGroupMessages] = useLocalStorage('group_messages', {});

  // Profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  
  // Share modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSession, setShareSession] = useState(null);
  
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const broadcastChannelRef = useRef(null);
  const syncIntervalRef = useRef(null);

  // TTS Hook

  // BACKEND API URL
  const API_URL = '';

  // AUTO-SCROLL FUNCTION
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    let scrollableParent = messagesEndRef.current;
    while (scrollableParent && scrollableParent !== document.body) {
      const style = window.getComputedStyle(scrollableParent);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        scrollableParent.scrollTop = scrollableParent.scrollHeight;
        break;
      }
      scrollableParent = scrollableParent.parentElement;
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };
  
  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Check if mobile and setup resize listener
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setShowMobileSidebar(false);
      } else {
        setSidebarCollapsed(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Broadcast Channel for cross-tab/device sync
  useEffect(() => {
    if (typeof window !== 'undefined' && !broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current = new BroadcastChannel('group_chat_sync');
        broadcastChannelRef.current.onmessage = (event) => {
          const { type, groupId, message, messages: allMessages, sender, timestamp } = event.data;
          
          if (type === 'NEW_MESSAGE' && groupId === groupChatId) {
            const messageExists = messages.some(m => 
              m.content === message.content && 
              m.timestamp === message.timestamp &&
              m.sender === message.sender
            );
            if (!messageExists) {
              setMessages(prev => [...prev, message]);
              scrollToBottom();
              showNotification(`📨 New message from ${message.sender || 'someone'}`);
            }
          } else if (type === 'SYNC_GROUP' && groupId === groupChatId && allMessages) {
            if (allMessages.length > messages.length) {
              setMessages(allMessages);
              scrollToBottom();
            }
          } else if (type === 'CHAT_CREATED' && groupId === groupChatId) {
            const storedMessages = groupMessages[groupId] || [];
            if (storedMessages.length > messages.length) {
              setMessages(storedMessages);
              scrollToBottom();
            }
          }
        };
      } catch(e) {
        console.log('BroadcastChannel not supported');
      }
    }
    
    const handleStorageChange = (e) => {
      if (e.key === `group_messages_${groupChatId}` && e.newValue) {
        try {
          const newMessages = JSON.parse(e.newValue);
          if (newMessages.length > messages.length) {
            setMessages(newMessages);
            scrollToBottom();
          }
        } catch(err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    if (groupChatId) {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = setInterval(() => {
        const storedMessages = groupMessages[groupChatId] || [];
        if (storedMessages.length > messages.length) {
          setMessages(storedMessages);
          scrollToBottom();
        }
      }, 3000);
    }
    
    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      window.removeEventListener('storage', handleStorageChange);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [groupChatId, messages.length, groupMessages]);

  // Check for group invite in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('group');
    if (inviteCode && !groupChatId) {
      joinGroupChat(inviteCode);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const showNotification = (msg, isError = false) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const extractScoreFromResponse = (responseText) => {
    if (!responseText || typeof responseText !== 'string') {
      return null;
    }
    const patterns = [
      /Score:\s*(\d+)\/10/i,
      /स्कोर:\s*(\d+)\/10/i,
      /नम्बर:\s*(\d+)\/10/i,
      /نمبر:\s*(\d+)\/10/i,
      /النتيجة:\s*(\d+)\/10/i,
      /(\d+)\/10/
    ];
    for (const pattern of patterns) {
      const match = responseText.match(pattern);
      if (match && match[1]) {
        const score = parseInt(match[1], 10);
        if (!isNaN(score) && score >= 0 && score <= 10) {
          return score;
        }
      }
    }
    return null;
  };

  const detectLanguageFromText = (text) => {
    const urduPattern = /[اآبپتٹثجچحخدڈذرزژسشصضطظعغفقکگلمنںوہھیئ]/;
    const arabicPattern = /[ء-ي]/;
    if (urduPattern.test(text)) return 'ur-PK';
    if (arabicPattern.test(text) && !urduPattern.test(text)) return 'ar-SA';
    return 'en-US';
  };

  const uiText = {
    'en-US': { 
      title: 'AI Atheism Debate Simulator', 
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
      learning: 'Learning', 
      debate: 'Debate', 
      chooseLevel: 'Choose Your Level',
      beginner: 'Beginner', 
      intermediate: 'Intermediate', 
      advanced: 'Advanced',
      chooseMode: 'Choose Your Mode',
      user: 'User',
      newChat: 'New chat',
      today: 'Today',
      yesterday: 'Yesterday',
      older: 'Older',
      shareChat: 'Share Chat',
      copyChat: 'Copy Chat',
      downloadChat: 'Download Chat',
      settings: 'Settings',
      startGroupChat: 'Start a group chat',
      viewFiles: 'View files in chat',
      pinChat: 'Pin chat',
      unpinChat: 'Unpin chat',
      deleteChat: 'Delete'
    }
  };

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUserHistory = async (userId) => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      
      if (data.success && data.history && data.history.length > 0) {
        let history = data.history;
        setDebateHistory(history);
        const localMessages = localStorage.getItem('dashboard_messages');
        if (!localMessages || JSON.parse(localMessages).length === 0) {
          const lastSession = history[0];
          if (lastSession && lastSession.messages && lastSession.messages.length > 0) {
            setMessages(lastSession.messages);
            setCurrentSessionId(lastSession.id);
            setDebateStarted(true);
            setMode(lastSession.mode || 'Debate');
            setDifficulty(lastSession.difficulty || 'Advanced');
            setPoints(lastSession.points || 0);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      showNotification('Failed to load history from server');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveCurrentSession = async () => {
    if (!user) return;
    if (messages.length === 0) return;
    if (!currentSessionId) return;
    
    const sessionTitle = messages[0]?.content?.substring(0, 40) || 'New debate';
    const session = {
      id: currentSessionId,
      title: sessionTitle,
      messages: messages,
      timestamp: new Date().toISOString(),
      mode: mode,
      difficulty: difficulty,
      points: points,
      isGroupChat: !!groupChatId,
      groupId: groupChatId
    };
    
    const existingIndex = debateHistory.findIndex(s => s.id === session.id);
    let updatedHistory;
    if (existingIndex !== -1) {
      updatedHistory = [...debateHistory];
      updatedHistory[existingIndex] = session;
    } else {
      updatedHistory = [session, ...debateHistory];
    }
    updatedHistory = updatedHistory.slice(0, 50);
    setDebateHistory(updatedHistory);
    
    try {
      await fetch(`${API_URL}/api/chat/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, messages: updatedHistory })
      });
    } catch (error) {
      console.error('Failed to save to backend:', error);
    }
  };

  const clearHistory = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to clear ALL your chat history? This cannot be undone!')) return;
    
    try {
      await fetch(`${API_URL}/api/chat/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      setDebateHistory([]);
      setPinnedChats([]);
      setMessages([]);
      setCurrentSessionId(null);
      setDebateStarted(false);
      setPoints(0);
      setGroupChatId(null);
      localStorage.removeItem('dashboard_messages');
      localStorage.removeItem('dashboard_points');
      localStorage.removeItem('dashboard_history');
      localStorage.removeItem('pinned_chats');
      showNotification('History cleared successfully!');
    } catch (error) {
      console.error('Failed to clear history:', error);
      showNotification('Failed to clear history');
    }
  };

  const loadChatFromHistory = (session) => {
    setMessages(session.messages || []);
    setCurrentSessionId(session.id);
    setMode(session.mode || 'Debate');
    setDifficulty(session.difficulty || 'Advanced');
    setDebateStarted(true);
    setPoints(session.points || 0);
    setGroupChatId(session.groupId || null);
    scrollToBottom();
    if (isMobile) setShowMobileSidebar(false);
  };

  const clearCurrentChat = () => {
    if (messages.length > 0 && confirm('Clear current chat? It will be removed from history.')) {
      deleteCurrentChat();
    }
    setShowMenuDropdown(false);
  };

  // ========== GROUP CHAT FUNCTIONS WITH REAL-TIME SYNC ==========
  const generateGroupLink = () => {
    const groupId = Date.now().toString();
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/dashboard?group=${groupId}`;
    return { link, groupId };
  };

  const createGroupChat = () => {
    const { link, groupId } = generateGroupLink();
    setGroupLink(link);
    setGroupChatId(groupId);
    
    const newSessionId = Date.now();
    setCurrentSessionId(newSessionId);
    
    const systemMessage = {
      role: 'assistant',
      content: `🎉 Group chat created! Share this link to invite others:\n${link}\n\nAnyone with this link can join and see all messages.`,
      sender: 'System',
      timestamp: new Date().toISOString()
    };
    setMessages([systemMessage]);
    scrollToBottom();
    
    const updatedGroupMessages = { ...groupMessages, [groupId]: [systemMessage] };
    setGroupMessages(updatedGroupMessages);
    
    const groupInfo = {
      id: groupId,
      creator: user?.email?.split('@')[0],
      createdAt: new Date().toISOString(),
      members: [user?.email?.split('@')[0]]
    };
    const updatedMembers = { ...groupMembers, [groupId]: groupInfo };
    setGroupMembers(updatedMembers);
    
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'CHAT_CREATED', groupId: groupId });
    }
    
    setShowGroupChatModal(false);
    showNotification('✨ Group chat created! Share the link to invite others.');
  };

  const joinGroupChat = (groupId) => {
    setGroupChatId(groupId);
    const newSessionId = Date.now();
    setCurrentSessionId(newSessionId);
    
    const existingMessages = groupMessages[groupId] || [];
    if (existingMessages.length > 0) {
      setMessages(existingMessages);
      scrollToBottom();
    } else {
      const joinMessage = {
        role: 'assistant',
        content: `👋 ${user?.email?.split('@')[0]} joined the group chat!`,
        sender: 'System',
        timestamp: new Date().toISOString()
      };
      setMessages([joinMessage]);
      scrollToBottom();
      
      const updatedGroupMessages = { ...groupMessages, [groupId]: [joinMessage] };
      setGroupMessages(updatedGroupMessages);
    }
    
    const groupInfo = groupMembers[groupId];
    if (groupInfo) {
      const updatedMembers = { ...groupMembers };
      if (!updatedMembers[groupId].members.includes(user?.email?.split('@')[0])) {
        updatedMembers[groupId].members.push(user?.email?.split('@')[0]);
        setGroupMembers(updatedMembers);
      }
    } else {
      const newGroupInfo = {
        id: groupId,
        creator: 'Unknown',
        createdAt: new Date().toISOString(),
        members: [user?.email?.split('@')[0]]
      };
      setGroupMembers({ ...groupMembers, [groupId]: newGroupInfo });
    }
    
    setDebateStarted(true);
    showNotification('🎉 You joined the group chat!');
  };

  const copyGroupLink = () => {
    navigator.clipboard.writeText(groupLink);
    showNotification('Group link copied to clipboard! 📋');
  };

  // Send group message with real-time sync and auto-scroll
  const sendGroupMessage = async (text, isVoiceMode = false) => {
    if (!text.trim()) return;
    
    const newMessage = {
      role: 'user',
      content: text,
      sender: user?.email?.split('@')[0],
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    scrollToBottom();
    
    if (groupChatId) {
      const updatedGroupMessages = { ...groupMessages, [groupChatId]: updatedMessages };
      setGroupMessages(updatedGroupMessages);
      
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ 
          type: 'NEW_MESSAGE', 
          groupId: groupChatId, 
          message: newMessage,
          messages: updatedMessages,
          sender: user?.email?.split('@')[0],
          timestamp: newMessage.timestamp
        });
      }
      
      localStorage.setItem(`group_messages_${groupChatId}`, JSON.stringify(updatedMessages));
    }
    
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/debate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      const aiMessage = { 
        role: 'assistant', 
        content: data.reply,
        sender: 'AI',
        timestamp: new Date().toISOString()
      };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      scrollToBottom();
      
      if (groupChatId) {
        const finalGroupMessages = { ...groupMessages, [groupChatId]: finalMessages };
        setGroupMessages(finalGroupMessages);
        
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({ 
            type: 'NEW_MESSAGE', 
            groupId: groupChatId, 
            message: aiMessage,
            messages: finalMessages
          });
        }
        
        localStorage.setItem(`group_messages_${groupChatId}`, JSON.stringify(finalMessages));
      }
      
      const earnedScore = extractScoreFromResponse(data.reply);
      if (earnedScore !== null) {
        setPoints(prev => prev + earnedScore);
      }
      
      if (isVoiceMode) {
        speak(data.reply, 'en-US');
      }
      
      setTimeout(() => {
        saveCurrentSession();
      }, 1000);
      
    } catch(e) { 
      console.error(e);
      showNotification('Failed to send message');
    }
    setLoading(false);
    setManualInput('');
  };

  // ========== SPEAK FUNCTION - UPDATED TO USE BACKEND TTS ==========
 const speak = (text, lang) => {
  if (!voiceEnabled) return;
  // Use browser's speech synthesis (free, works everywhere)
  if (!window.speechSynthesis) return;
  
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    if (lang === 'ur-PK') utterance.lang = 'ur-PK';
    else if (lang === 'ar-SA') utterance.lang = 'ar-SA';
    else utterance.lang = 'en-US';
    
    // Get male voice if available
    const voices = window.speechSynthesis.getVoices();
    let maleVoice = null;
    
    if (lang === 'ur-PK') {
      maleVoice = voices.find(v => v.lang === 'ur-PK' && v.name.includes('Male'));
      if (!maleVoice) maleVoice = voices.find(v => v.lang === 'hi-IN');
    } else if (lang === 'ar-SA') {
      maleVoice = voices.find(v => v.lang === 'ar-SA' && v.name.includes('Male'));
    } else {
      maleVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'));
      if (!maleVoice) maleVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Male'));
    }
    
    if (maleVoice) utterance.voice = maleVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  } catch(e) {
    console.error('Speech error:', e);
    setSpeaking(false);
  }
};

  const stopSpeaking = () => {
    stopAudio();
  };

  // ========== PIN/UNPIN FUNCTION ==========
  const togglePinChat = () => {
    if (!currentSessionId) {
      showNotification('No active chat to pin');
      setShowMenuDropdown(false);
      return;
    }
    
    if (pinnedChats.includes(currentSessionId)) {
      setPinnedChats(pinnedChats.filter(id => id !== currentSessionId));
      showNotification('📌 Chat unpinned');
    } else {
      setPinnedChats([...pinnedChats, currentSessionId]);
      showNotification('📌 Chat pinned');
    }
    setShowMenuDropdown(false);
  };

  // ========== DELETE CHAT ==========
  const deleteCurrentChat = () => {
    if (!currentSessionId && messages.length === 0) {
      showNotification('No chat to delete');
      setShowMenuDropdown(false);
      return;
    }
    
    if (confirm('Delete this chat permanently? This cannot be undone.')) {
      const updatedHistory = debateHistory.filter(item => item.id !== currentSessionId);
      setDebateHistory(updatedHistory);
      if (pinnedChats.includes(currentSessionId)) {
        setPinnedChats(pinnedChats.filter(id => id !== currentSessionId));
      }
      if (groupChatId) {
        const updatedGroupMessages = { ...groupMessages };
        delete updatedGroupMessages[groupChatId];
        setGroupMessages(updatedGroupMessages);
      }
      setMessages([]);
      setCurrentSessionId(null);
      setDebateStarted(false);
      setPoints(0);
      setGroupChatId(null);
      showNotification('🗑️ Chat deleted');
    }
    setShowMenuDropdown(false);
  };

  // ========== VIEW FILES ==========
  const viewFilesInChat = () => {
    if (messages.length === 0) {
      showNotification('No messages to extract files from');
      setShowMenuDropdown(false);
      return;
    }
    
    const extracted = [];
    messages.forEach((msg, idx) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = msg.content.match(urlRegex);
      if (urls) {
        urls.forEach(url => {
          extracted.push({ type: '🔗 Link', content: url, messageIndex: idx, role: msg.role });
        });
      }
      
      const codeRegex = /```([\s\S]*?)```/g;
      let codeMatch;
      while ((codeMatch = codeRegex.exec(msg.content)) !== null) {
        extracted.push({ type: '💻 Code', content: codeMatch[1].substring(0, 200), messageIndex: idx, role: msg.role });
      }
      
      if (msg.content.length > 500) {
        extracted.push({ type: '📄 Long message', content: msg.content.substring(0, 300) + '...', messageIndex: idx, role: msg.role });
      }
    });
    
    if (extracted.length === 0) {
      showNotification('No files, links, or code blocks found in this chat');
    } else {
      setFilesData(extracted);
      setShowFilesModal(true);
    }
    setShowMenuDropdown(false);
  };

  const shareCurrentChat = () => {
    if (messages.length === 0) {
      showNotification('No chat to share');
      return;
    }
    const currentSession = {
      id: currentSessionId || Date.now(),
      title: messages[0]?.content?.substring(0, 40) || 'Current debate',
      messages: messages,
      timestamp: new Date().toISOString(),
      points: points
    };
    setShareSession(currentSession);
    setShowShareModal(true);
    setShowMenuDropdown(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Chat history copied to clipboard! 📋');
    } catch (err) {
      showNotification('Failed to copy');
    }
  };

  const copyCurrentChat = async () => {
    if (messages.length === 0) {
      showNotification('No chat to copy');
      return;
    }
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? '👤 User' : '🤖 AI'}:\n${msg.content}`
    ).join('\n\n---\n\n');
    await copyToClipboard(chatText);
    setShowMenuDropdown(false);
  };

  const downloadCurrentChat = () => {
    if (messages.length === 0) {
      showNotification('No chat to download');
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
    showNotification('Chat downloaded! 📥');
    setShowMenuDropdown(false);
  };

  const generateShareText = (session) => {
    if (!session) return '';
    
    const title = session.title || 'Debate Session';
    const date = new Date(session.timestamp).toLocaleString();
    const messagesList = session.messages || [];
    const pointsEarned = session.points || 0;
    
    let text = `🎙️ AI Atheism Debate Simulator - Shared Chat\n\n`;
    text += `📝 ${title}\n`;
    text += `📅 ${date}\n`;
    text += `⭐ Points: ${pointsEarned}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    messagesList.forEach((msg, idx) => {
      const speaker = msg.role === 'user' ? '👤 User' : '🤖 AI';
      text += `${speaker}:\n${msg.content}\n\n`;
      if (idx < messagesList.length - 1) text += `───────────────\n\n`;
    });
    
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✨ Practice debates with AI feedback!\n`;
    text += `🔗 ${window.location.origin}/dashboard`;
    
    return text;
  };

  const shareViaWhatsApp = (session) => {
    const text = generateShareText(session);
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const shareViaTelegram = (session) => {
    const text = generateShareText(session);
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(window.location.origin);
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
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

    if (selectedLanguage === 'ur-PK') {
      recognition.lang = 'hi-IN';
    } else if (selectedLanguage === 'ar-SA') {
      recognition.lang = 'ar-SA';
    } else {
      recognition.lang = 'en-US';
    }  
    
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
            if (groupChatId) {
              sendGroupMessage(finalTranscript, true);
            } else {
              sendMessageWithText(finalTranscript, detectedLang, true);
            }
            setLiveTranscript('');
          }
        }, 800);
      }
    };
    recognition.onerror = () => setLiveTranscript('❌ Try again');
    
    recognition.onend = () => {
      setIsListening(false);
      if (useVoice && debateStarted && !loading) {
        setTimeout(() => {
          startListening();
        }, 500);
      }
    };
    
    return recognition;
  };

  const startListening = () => {
    if (!useVoice) return;
    if (isListening) return;
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch(e) {}
        }
        recognitionRef.current = initSpeechRecognition();
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
        }
      })
      .catch(() => showNotification('🎤 Microphone access denied'));
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
    setPoints(0);
    setGroupChatId(null);
    
    try {
      const res = await fetch(`${API_URL}/api/debate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: `Mode: ${mode}, Difficulty: ${difficulty}` }] 
        }),
      });
      const data = await res.json();
      const newMessages = [{ role: 'assistant', content: data.reply }];
      setMessages(newMessages);
      scrollToBottom();
      speak(data.reply, detectLanguageFromText(data.reply));
      
      const earnedScore = extractScoreFromResponse(data.reply);
      if (earnedScore !== null) {
        setPoints(earnedScore);
      }
      
      setTimeout(() => {
        saveCurrentSession();
      }, 1000);
      
      if (useVoice) {
        setTimeout(() => startListening(), 500);
      }
      
    } catch(e) { 
      console.error(e);
      showNotification('Failed to start debate.');
    }
    setLoading(false);
  };

  const sendMessageWithText = async (text, detectedLang, isVoiceMode = false) => {
    if (!text.trim()) return;
    
    if (groupChatId) {
      await sendGroupMessage(text, isVoiceMode);
      return;
    }
    
    const language = detectedLang || detectLanguageFromText(text);
    
    const userMessage = { 
      role: 'user', 
      content: `[${language}] ${text}`
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    scrollToBottom();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/debate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const aiMessage = { role: 'assistant', content: data.reply };
      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      scrollToBottom();
      
      const earnedScore = extractScoreFromResponse(data.reply);
      if (earnedScore !== null) {
        setPoints(prev => prev + earnedScore);
      }
      
      if (isVoiceMode) {
        speak(data.reply, language);
      }
      
      setTimeout(() => {
        saveCurrentSession();
      }, 1000);
      
    } catch(e) { 
      console.error(e);
      showNotification('Failed to send message');
    }
    setLoading(false);
    setManualInput('');
  };

  const handleManualSend = () => {
    if (manualInput.trim()) {
      const detectedLang = detectLanguageFromText(manualInput);
      sendMessageWithText(manualInput, detectedLang, false);
    }
  };

  const handleLogout = async () => {
    if (debateStarted && messages.length > 0 && currentSessionId) {
      await saveCurrentSession();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const enableVoiceMode = () => {
    setUseVoice(true);
    if (debateStarted && !isListening) {
      setTimeout(() => startListening(), 500);
    }
  };

  const enableTypeMode = () => {
    setUseVoice(false);
    if (isListening) {
      stopListening();
    }
  };

  const startNewChat = () => {
    if (messages.length > 0 && currentSessionId) {
      saveCurrentSession();
    }
    setMessages([]);
    setCurrentSessionId(null);
    setDebateStarted(false);
    setPoints(0);
    setManualInput('');
    setSearchQuery('');
    setGroupChatId(null);
    if (isMobile) setShowMobileSidebar(false);
  };

  useEffect(() => {
    if (debateStarted && messages.length > 0 && currentSessionId && user && !groupChatId) {
      const timeout = setTimeout(() => {
        saveCurrentSession();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

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
        if (parsedUser.id) {
          setUser(parsedUser);
          loadUserHistory(parsedUser.id);
          return;
        }
      } catch(e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then(data => {
      if (data.user && data.user.id) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        loadUserHistory(data.user.id);
      }
    })
    .catch(err => {
      console.error('Failed to fetch from /me:', err);
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.id) {
            setUser(parsedUser);
            loadUserHistory(parsedUser.id);
            return;
          }
        } catch(e) {}
      }
      router.push('/login');
    });
  }, []);

  const t = uiText['en-US'];
  
  const getFilteredHistory = () => {
    let history = debateHistory.filter(item => {
      const matchesSearch = item?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    
    const pinned = history.filter(item => pinnedChats.includes(item.id));
    const unpinned = history.filter(item => !pinnedChats.includes(item.id));
    return [...pinned, ...unpinned];
  };

  const filteredHistory = getFilteredHistory();

  const groupHistoryByDate = () => {
    const groups = { pinned: [], today: [], yesterday: [], older: [] };
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    filteredHistory.forEach(item => {
      if (pinnedChats.includes(item.id)) {
        groups.pinned.push(item);
        return;
      }
      
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

  const historyGroups = groupHistoryByDate();

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      fontFamily: "'Inter', system-ui, sans-serif",
      display: 'flex',
      overflow: 'hidden'
    }}>
      
      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: '#22c55e',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          zIndex: 3000
        }}>
          {notification}
        </div>
      )}

      {/* Group Chat Modal */}
      {showGroupChatModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowGroupChatModal(false)}>
          <div style={{
            maxWidth: '450px', width: '90%',
            backgroundColor: '#0a0a0a',
            borderRadius: '24px', padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid #222222'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>
              👥 Start a Group Chat
            </h3>
            <p style={{ fontSize: '13px', color: '#888888', marginBottom: '20px' }}>
              Create a group chat and share the link to invite others. Anyone with the link can join and see all messages in real-time.
            </p>
            
            {groupLink ? (
              <>
                <div style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '12px',
                  padding: '12px',
                  marginBottom: '20px',
                  border: '1px solid #333333'
                }}>
                  <p style={{ fontSize: '12px', color: '#aaaaaa', marginBottom: '8px', wordBreak: 'break-all' }}>
                    {groupLink}
                  </p>
                  <button
                    onClick={copyGroupLink}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#10a37f',
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Copy Link
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowGroupChatModal(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333333',
                      borderRadius: '40px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowGroupChatModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333333',
                    borderRadius: '40px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={createGroupChat}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#10a37f',
                    border: 'none',
                    borderRadius: '40px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Create Group
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Files Modal */}
      {showFilesModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowFilesModal(false)}>
          <div style={{
            maxWidth: '500px', width: '90%',
            backgroundColor: '#0a0a0a',
            borderRadius: '24px', padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid #222222',
            maxHeight: '80vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>
              📁 Files & Links in Chat
            </h3>
            <p style={{ fontSize: '13px', color: '#888888', marginBottom: '20px' }}>
              Found {filesData.length} items
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filesData.map((file, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '12px',
                  border: '1px solid #333333'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span>{file.type}</span>
                    <span style={{ fontSize: '11px', color: '#10a37f' }}>
                      {file.role === 'user' ? 'User' : 'AI'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#aaaaaa', wordBreak: 'break-all' }}>
                    {file.content}
                  </p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowFilesModal(false)} style={{
              width: '100%', padding: '10px', marginTop: '20px',
              borderRadius: '40px', border: '1px solid #333333',
              backgroundColor: 'transparent', color: '#ffffff',
              cursor: 'pointer', fontSize: '14px'
            }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Toggle Button */}
     
      {/* ========== PERMANENT SIDEBAR ========== */}
      <div style={{
        width: sidebarCollapsed ? (isMobile ? (showMobileSidebar ? 280 : 0) : 72) : 280,
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid #222222',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s ease, transform 0.2s ease',
        transform: isMobile && !showMobileSidebar && sidebarCollapsed ? 'translateX(-100%)' : 'translateX(0)'
      }}>
        {/* Collapse Button - Only show on desktop */}
        {!isMobile && (
          <div style={{ 
            padding: sidebarCollapsed ? '12px 8px' : '16px 16px 8px 16px',
            display: 'flex',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-end'
          }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '8px',
                color: '#888888',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; e.currentTarget.style.color = '#888888'; }}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        )}

        {/* New Chat Button */}
        <div style={{ padding: sidebarCollapsed ? '0 8px 16px 8px' : '8px 16px 16px 16px', borderBottom: '1px solid #222222' }}>
          <button
            onClick={startNewChat}
            style={{
              width: '100%',
              padding: sidebarCollapsed ? '10px 0' : '10px 16px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333333',
              borderRadius: '12px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
          >
            <span style={{ fontSize: '16px' }}>+</span>
            {!sidebarCollapsed && <span>{t.newChat}</span>}
          </button>
        </div>

        {/* Search Bar */}
       {/* Sidebar Title - Logo + Text */}
{!sidebarCollapsed && (
  <div style={{
    padding: '16px 16px 8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid #222222',
    marginBottom: '8px'
  }}>
    <div style={{
      width: '28px',
      height: '28px',
      background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px'
    }}>🎙️</div>
    <span style={{
      fontSize: '14px',
      fontWeight: '600',
      color: '#ffffff'
    }}>AI Debate Simulator</span>
  </div>
)}

        {/* History List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: sidebarCollapsed ? '8px' : '16px' }}>
          {!sidebarCollapsed && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '11px', color: '#888888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t.history}
              </h4>
            </div>
          )}
          
          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: sidebarCollapsed ? '20px 4px' : '40px 20px', color: '#888888' }}>
              <div style={{ fontSize: sidebarCollapsed ? '20px' : '32px', marginBottom: '10px' }}>💬</div>
              {!sidebarCollapsed && <p style={{ fontSize: '12px' }}>{t.noHistory}</p>}
            </div>
          ) : (
            <>
              {historyGroups.pinned.length > 0 && !sidebarCollapsed && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', color: '#f59e0b', marginBottom: '8px', paddingLeft: '8px' }}>📌 Pinned</div>
                  {historyGroups.pinned.map((item) => (
                    <div key={item.id} style={{
                      padding: '8px 12px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'rgba(245,158,11,0.1)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.1)'; }}>
                      <div onClick={() => loadChatFromHistory(item)} style={{ cursor: 'pointer' }}>
                        <div style={{ fontSize: '13px', color: '#ffffff' }}>
                          📌 {item?.title?.substring(0, 28) || 'New debate'}{item?.title?.length > 28 ? '...' : ''}
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#888888' }}>
                          {item?.points || 0} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {historyGroups.today.length > 0 && !sidebarCollapsed && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', color: '#666666', marginBottom: '8px', paddingLeft: '8px' }}>{t.today}</div>
                  {historyGroups.today.map((item) => (
                    <div key={item.id} style={{
                      padding: '8px 12px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                      <div onClick={() => loadChatFromHistory(item)} style={{ cursor: 'pointer' }}>
                        <div style={{ fontSize: '13px', color: '#ffffff' }}>
                          {item?.title?.substring(0, 30) || 'New debate'}{item?.title?.length > 30 ? '...' : ''}
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#888888' }}>
                          {item?.points || 0} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {sidebarCollapsed && historyGroups.today.slice(0, 5).map((item) => (
                <div key={item.id} style={{
                  padding: '8px',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <div onClick={() => loadChatFromHistory(item)} style={{ cursor: 'pointer', fontSize: '20px' }} title={item?.title}>
                    💬
                  </div>
                </div>
              ))}
              
              {historyGroups.yesterday.length > 0 && !sidebarCollapsed && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', color: '#666666', marginBottom: '8px', paddingLeft: '8px' }}>{t.yesterday}</div>
                  {historyGroups.yesterday.map((item) => (
                    <div key={item.id} style={{
                      padding: '8px 12px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                      <div onClick={() => loadChatFromHistory(item)} style={{ cursor: 'pointer' }}>
                        <div style={{ fontSize: '13px', color: '#ffffff' }}>
                          {item?.title?.substring(0, 30) || 'New debate'}{item?.title?.length > 30 ? '...' : ''}
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#888888' }}>
                          {item?.points || 0} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {historyGroups.older.length > 0 && !sidebarCollapsed && (
                <div>
                  <div style={{ fontSize: '10px', color: '#666666', marginBottom: '8px', paddingLeft: '8px' }}>{t.older}</div>
                  {historyGroups.older.map((item) => (
                    <div key={item.id} style={{
                      padding: '8px 12px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                      <div onClick={() => loadChatFromHistory(item)} style={{ cursor: 'pointer' }}>
                        <div style={{ fontSize: '13px', color: '#ffffff' }}>
                          {item?.title?.substring(0, 30) || 'New debate'}{item?.title?.length > 30 ? '...' : ''}
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#888888' }}>
                          {item?.points || 0} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div ref={profileMenuRef} style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: sidebarCollapsed ? '8px 0' : '8px',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px'
            }}>👤</div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '500', color: '#ffffff' }}>
                  {user?.email?.split('@')[0]}
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#888888' }}>
                  {points} {t.points}
                </p>
              </div>
            )}
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && !sidebarCollapsed && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '0',
              width: '200px',
              backgroundColor: '#0a0a0a',
              border: '1px solid #333333',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              marginBottom: '8px',
              overflow: 'hidden',
              zIndex: 100
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #222222'
              }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '500', color: '#ffffff' }}>
                  {user?.email?.split('@')[0]}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#888888', wordBreak: 'break-all' }}>
                  {user?.email}
                </p>
              </div>
              
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  showNotification('Profile page coming soon!');
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span>👤</span> Profile
              </button>
              
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  showNotification('Settings page coming soon!');
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span>⚙️</span> Settings
              </button>
              
              <div style={{ height: '1px', backgroundColor: '#333333' }} />
              
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogout();
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span>🚪</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========== MAIN CHAT AREA ========== */}
      <div style={{
  flex: 1,
  marginLeft: isMobile ? 0 : (sidebarCollapsed ? 72 : 280),
  transition: 'margin-left 0.2s ease',
  height: '100vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: isMobile ? '0px' : '0px'  // Already set, no change needed
}}>


  <div style={{
  position: 'sticky',
  top: '0px',
  zIndex: 50,
  backgroundColor: '#0a0a0a',
  padding: '8px 0px',
  marginBottom: '16px',
  borderBottom: '1px solid #2d2d3a'
}}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px',
    width: '100%'
  }}>
    {/* LEFT - Sidebar Toggle + Title */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: '#e5e5e5',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        ☰
      </button>

      {/* Title - No logo, just text */}
      <span style={{
        fontSize: '14px',
        fontWeight: '500',
        color: '#f5f5f5'
      }}>
        AI Atheism Debate Trainer
      </span>
    </div>

    {/* RIGHT - Share + 3 Dots */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: '20px',
        padding: '2px',
        gap: '2px',
        border: '1px solid #333333'
      }}>
        <button
          onClick={enableTypeMode}
          style={{
            padding: '4px 12px',
            backgroundColor: !useVoice ? '#10a37f' : 'transparent',
            color: !useVoice ? 'white' : '#e5e5e5',
            border: 'none',
            borderRadius: '18px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          ⌨️ Type
        </button>
        <button
          onClick={enableVoiceMode}
          style={{
            padding: '4px 12px',
            backgroundColor: useVoice ? '#10a37f' : 'transparent',
            color: useVoice ? 'white' : '#e5e5e5',
            border: 'none',
            borderRadius: '18px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          🎤 Voice
        </button>
      </div>
  
      {/* Share Button */}
      <button
        onClick={shareCurrentChat}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 10px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '16px',
          color: '#e5e5e5',
          cursor: 'pointer',
          fontSize: '12px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <span style={{ fontSize: '13px' }}>🔗</span>
        <span>Share</span>
      </button>

      {/* 3 Dots Menu */}
      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          onClick={() => setShowMenuDropdown(!showMenuDropdown)}
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: '#e5e5e5',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          ⋯
        </button>

        {/* Dropdown Menu */}
        {showMenuDropdown && (
          <div style={{
            position: 'absolute',
            top: '35px',
            right: '0',
            width: '220px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #2d2d3a',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            zIndex: 200,
            overflow: 'hidden'
          }}>
            <button
              onClick={() => { setShowGroupChatModal(true); setShowMenuDropdown(false); }}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#f5f5f5',
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
              <span>👥</span> Start a group chat
            </button>
            
            <button
              onClick={viewFilesInChat}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#f5f5f5',
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
              <span>📁</span> View files in chat
            </button>
            
            <button
              onClick={togglePinChat}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#f5f5f5',
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
              <span>📌</span> {currentSessionId && pinnedChats.includes(currentSessionId) ? 'Unpin chat' : 'Pin chat'}
            </button>
            
            <div style={{ height: '1px', backgroundColor: '#2d2d3a' }} />
            
            <button
              onClick={copyCurrentChat}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#f5f5f5',
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
              <span>📋</span> Copy Chat
            </button>
            
            <button
              onClick={downloadCurrentChat}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#f5f5f5',
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
              <span>📥</span> Download Chat
            </button>
            
            <button
              onClick={deleteCurrentChat}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#dc2626',
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
              <span>🗑️</span> Delete Chat
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

        
        {/* Main Chat Content */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', width: '100%', flex: 1 }}>
          
          {/* Group Chat Indicator */}
          {groupChatId && (
            <div style={{
              backgroundColor: 'rgba(16,163,127,0.15)',
              border: '1px solid rgba(16,163,127,0.3)',
              borderRadius: '12px',
              padding: '8px 16px',
              marginBottom: '16px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#10a37f'
            }}>
              👥 Group Chat Active — Messages sync across all devices
            </div>
          )}



          
          {/* Header Bar */}
         



          {/* Messages Container */}
          <div className="chat-messages-container" style={{ 
            flex: 1,
            marginBottom: '20px',
            minHeight: 'calc(100vh - 280px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', margin: 'auto' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                <h3 style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: '#ffffff' }}>Strengthen your reasoning</h3>
                <p style={{ color: '#888888', fontSize: '13px', marginTop: '8px', marginBottom: 0 }}>Choose your level and mode, then click Start Debate</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px',
                  width: '100%'
                }}>
                  <div style={{
                    maxWidth: '75%',
                    minWidth: '60px',
                    backgroundColor: msg.role === 'user' ? '#10a37f' : '#1a1a1a',
                    color: msg.role === 'user' ? 'white' : '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    width: 'fit-content'
                  }}>
                    {msg.sender && msg.sender !== 'System' && msg.sender !== 'AI' && msg.role === 'user' && (
                      <div style={{ fontSize: '10px', color: '#aaaaaa', marginBottom: '4px' }}>
                        {msg.sender}
                      </div>
                    )}
                    {msg.content.replace(/^\[(ur-PK|en-US|ar-SA)\]\s*/, '')}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#1a1a1a', padding: '10px 14px', borderRadius: '18px', border: '1px solid #333333' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#10a37f', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></span>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#10a37f', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }}></span>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#10a37f', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }}></span>
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
              zIndex: 40,
              display: 'flex', gap: '8px', alignItems: 'center',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333333',
              borderRadius: '24px', padding: '8px 16px',
              marginTop: '16px'
            }}>
              <textarea
                ref={inputRef}
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleManualSend();
                  }
                }}
                placeholder={groupChatId ? "Send a message to group..." : t.typePlaceholder}
                rows={1}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  overflowY: 'auto',
                  minHeight: '40px',
                  maxHeight: '120px',
                  lineHeight: '1.4'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
              <button onClick={handleManualSend} style={{
                background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
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
              zIndex: 40,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333333',
              borderRadius: '40px', padding: '12px',
              marginTop: '16px'
            }}>
              <button onClick={isListening ? stopListening : startListening} style={{
                backgroundColor: isListening ? '#dc2626' : '#22c55e',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '40px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {isListening ? (
                  <>
                    <span style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'pulse 1.5s infinite'
                    }}></span>
                    🔴 Stop Recording
                  </>
                ) : (
                  '🎤 Start Speaking'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && shareSession && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowShareModal(false)}>
          <div style={{
            maxWidth: '500px', width: '90%',
            backgroundColor: '#0a0a0a',
            borderRadius: '24px', padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid #222222'
          }} onClick={(e) => e.stopPropagation()}>
            
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>
              Share Chat History
            </h3>
            <p style={{ fontSize: '13px', color: '#888888', marginBottom: '20px' }}>
              {shareSession?.title || 'Debate Session'} • {shareSession?.points || 0} points
            </p>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button onClick={() => copyToClipboard(generateShareText(shareSession))} style={{
                flex: 1, padding: '10px', borderRadius: '40px', border: 'none',
                backgroundColor: '#10a37f', color: 'white', cursor: 'pointer',
                fontWeight: '500', fontSize: '14px'
              }}>
                📋 Copy Text
              </button>
              <button onClick={() => shareViaWhatsApp(shareSession)} style={{
                flex: 1, padding: '10px', borderRadius: '40px', border: 'none',
                backgroundColor: '#25D366', color: 'white', cursor: 'pointer',
                fontWeight: '500', fontSize: '14px'
              }}>
                📱 WhatsApp
              </button>
              <button onClick={() => shareViaTelegram(shareSession)} style={{
                flex: 1, padding: '10px', borderRadius: '40px', border: 'none',
                backgroundColor: '#0088cc', color: 'white', cursor: 'pointer',
                fontWeight: '500', fontSize: '14px'
              }}>
                ✈️ Telegram
              </button>
            </div>
            
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '12px', padding: '16px',
              maxHeight: '300px', overflowY: 'auto',
              border: '1px solid #333333'
            }}>
              <pre style={{
                fontSize: '11px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                margin: 0, color: '#aaaaaa', fontFamily: 'monospace'
              }}>
                {generateShareText(shareSession).substring(0, 500)}
                {generateShareText(shareSession).length > 500 && '...'}
              </pre>
            </div>
            
            <button onClick={() => setShowShareModal(false)} style={{
              width: '100%', padding: '10px', marginTop: '16px',
              borderRadius: '40px', border: '1px solid #333333',
              backgroundColor: 'transparent', color: '#ffffff',
              cursor: 'pointer', fontSize: '14px'
            }}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333333; borderRadius: 4px; }
      `}</style>
    </div>
  );
}