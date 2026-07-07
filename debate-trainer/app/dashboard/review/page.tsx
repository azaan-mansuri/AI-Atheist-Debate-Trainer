'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

// Main component that uses useSearchParams
function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');
  
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessionConfig, setSessionConfig] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState('en');
  const shareMenuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFeedbackMenu, setShowFeedbackMenu] = useState(false);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
const [feedbackRating, setFeedbackRating] = useState(0);
const [isAdmin, setIsAdmin] = useState(false);
const [savedUserFeedback, setSavedUserFeedback] = useState('');
const feedbackTextareaRef = useRef<HTMLTextAreaElement>(null);
const [sessionDuration, setSessionDuration] = useState(0); 
const [points, setPoints] = useState(0); 
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://debate-backend-78i0.onrender.com';

  // Translations
  const t = {
    en: {
      sessionReview: 'Session Review',
      subTitle: 'Review your debate performance and scores.',
      mode: 'Mode:',
      persona: 'Persona:',
      topic: 'Topic:',
      difficulty: 'Difficulty:',
      language: 'Language:',
      finalScore: 'Final Score',
      outOf100: 'out of 100',
      aiCoachAnalysis: '🤖 AI Coach Analysis',
      bestMoments: '✓ Best Moments',
      areasToImprove: '⚠ Areas to Improve',
      whatToStudy: '📚 What to Study Next',
      fullTranscript: 'Full Transcript',
      newSession: 'New Session',
      backToSetup: 'Back to Setup',
      analyzing: 'Analyzing your debate...',
      noAnalysis: 'Complete a debate session to get AI-powered analysis of your performance.',
      you: 'You',
      ai: 'AI',
      score: 'Score',
      share: 'Share',
      whatsapp: 'WhatsApp',
      copyReview: 'Copy Review',
      downloadReview: 'Download Review'
    },
    ur: {
      sessionReview: 'سیشن کا جائزہ',
      subTitle: 'اپنی بحث کی کارکردگی اور اسکور کا جائزہ لیں۔',
      mode: 'موڈ:',
      persona: 'شخصیت:',
      topic: 'موضوع:',
      difficulty: 'مشکل:',
      language: 'زبان:',
      finalScore: 'آخری اسکور',
      outOf100: '100 میں سے',
      aiCoachAnalysis: '🤖 اے آئی کوچ تجزیہ',
      bestMoments: '✓ بہترین لمحات',
      areasToImprove: '⚠ بہتری کے شعبے',
      whatToStudy: '📚 آگے کیا پڑھیں',
      fullTranscript: 'مکمل گفتگو',
      newSession: 'نیا سیشن',
      backToSetup: 'سیٹ اپ پر واپس',
      analyzing: 'آپ کی بحث کا تجزیہ ہو رہا ہے...',
      noAnalysis: 'اے آئی سے چلنے والا تجزیہ حاصل کرنے کے لیے ایک مباحثہ سیشن مکمل کریں۔',
      you: 'آپ',
      ai: 'اے آئی',
      score: 'اسکور',
      share: 'شیئر کریں',
      whatsapp: 'واٹس ایپ',
      copyReview: 'کاپی کریں',
      downloadReview: 'ڈاؤن لوڈ کریں'
    },
    ar: {
      sessionReview: 'مراجعة الجلسة',
      subTitle: 'راجع أدائك في المناظرة والنتائج.',
      mode: 'الوضع:',
      persona: 'الشخصية:',
      topic: 'الموضوع:',
      difficulty: 'الصعوبة:',
      language: 'اللغة:',
      finalScore: 'النتيجة النهائية',
      outOf100: 'من 100',
      aiCoachAnalysis: '🤖 تحليل المدرب الذكي',
      bestMoments: '✓ أفضل اللحظات',
      areasToImprove: '⚠ مجالات التحسين',
      whatToStudy: '📚 ما يجب دراسته بعد ذلك',
      fullTranscript: 'النص الكامل',
      newSession: 'جلسة جديدة',
      backToSetup: 'العودة للإعدادات',
      analyzing: 'جاري تحليل مناظرتك...',
      noAnalysis: 'أكمل جلسة مناظرة للحصول على تحليل مدعوم بالذكاء الاصطناعي لأدائك.',
      you: 'أنت',
      ai: 'الذكاء الاصطناعي',
      score: 'النتيجة',
      share: 'مشاركة',
      whatsapp: 'واتساب',
      copyReview: 'نسخ المراجعة',
      downloadReview: 'تحميل المراجعة'
    }
  };

  const currentText = t[displayLanguage as keyof typeof t];

  const cleanMessage = (content: string) => {
    if (!content) return '';
    return content.replace(/^\[(ur-PK|en-US|ar-SA)\]\s*/, '');
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate share text for review
  const generateReviewShareText = () => {
    const title = sessionConfig?.title || 'Debate Session';
    const date = new Date().toLocaleString();
    const messagesList = messages || [];
    
    let text = `🎙️ AI Atheism Debate Simulator - Session Review\n\n`;
    text += `📝 ${title}\n`;
    text += `📅 ${date}\n`;
    text += `⭐ Final Score: ${finalScore}/100\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    messagesList.forEach((msg: any, idx: number) => {
      const speaker = msg.role === 'user' ? '👤 User' : '🤖 AI';
      let scoreText = '';
      if (msg.score) {
        scoreText = ` [Score: ${msg.score}/10]`;
      }
      text += `${speaker}${scoreText}:\n${cleanMessage(msg.content)}\n\n`;
      if (idx < messagesList.length - 1) text += `───────────────\n\n`;
    });
    
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✨ Session: ${sessionConfig?.mode} · ${sessionConfig?.persona} · ${sessionConfig?.topic}\n`;
    
    if (analysis && !analyzing) {
      text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `🤖 AI COACH ANALYSIS\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      
      if (analysis.best_moments && analysis.best_moments.length > 0) {
        text += `✓ BEST MOMENTS:\n`;
        analysis.best_moments.forEach((item: any, idx: number) => {
          text += `  ${idx + 1}. "${item.quote}"\n`;
          text += `     → ${item.reason}\n\n`;
        });
      }
      
      if (analysis.areas_to_improve && analysis.areas_to_improve.length > 0) {
        text += `⚠ AREAS TO IMPROVE:\n`;
        analysis.areas_to_improve.forEach((item: any, idx: number) => {
          text += `  ${idx + 1}. ${item.issue}\n`;
          text += `     Example: "${item.example}"\n`;
          text += `     Fix: ${item.suggestion}\n\n`;
        });
      }
      
      if (analysis.suggestions && analysis.suggestions.length > 0) {
        text += `📚 WHAT TO STUDY NEXT:\n`;
        analysis.suggestions.forEach((suggestion: string, idx: number) => {
          text += `  ${idx + 1}. ${suggestion}\n`;
        });
        text += `\n`;
      }
    }
    
    text += `🔗 ${window.location.origin}/dashboard`;
    
    return text;
  };

  const shareViaWhatsApp = () => {
    const text = generateReviewShareText();
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    setShowShareMenu(false);
  };

  const copyReviewToClipboard = () => {
    const text = generateReviewShareText();
    navigator.clipboard.writeText(text);
    alert(currentText.copyReview);
    setShowShareMenu(false);
  };

  const downloadReview = () => {
    const text = generateReviewShareText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate_review_${new Date().toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowShareMenu(false);
  };


  // ========== SAVE REVIEW TO DATABASE ==========
const saveReviewToDatabase = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ No token found');
      return;
    }

    const reviewData = {
      session_id: sessionId || 'unknown',
      persona: sessionConfig?.persona || 'Unknown',
      topic: sessionConfig?.topic || 'Unknown',
      mode: sessionConfig?.mode || 'Unknown',
      messages: messages || [],
      score: finalScore || 0,
      points: points || 0,
      duration: sessionDuration || 0,
      feedback: savedUserFeedback || '',
      bestMoments: analysis?.best_moments || [],
      areasToImprove: analysis?.areas_to_improve || [],
      breakdown: analysis?.breakdown || {}
    };

    console.log('📤 Saving review:', reviewData);

    const res = await fetch(`${API_URL}/api/review/save`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });

    const data = await res.json();
    console.log('📥 Review save response:', data);

    if (data.success) {
      console.log('✅ Review saved successfully! ID:', data.id);
    } else {
      console.log('❌ Failed to save review:', data);
    }
  } catch (err) {
    console.error('❌ Error saving review:', err);
  }
};

  // Submit feedback
const submitFeedback = () => {
  const feedback = feedbackTextareaRef.current?.value || '';
  if (feedback.trim()) {
    localStorage.setItem(`review_${sessionId}_feedback_user`, feedback);
    setSavedUserFeedback(feedback);
    setShowFeedbackMenu(false);
    alert('✅ Feedback saved!');
  } else {
    alert('Please write some feedback first.');
  }
};

// Clear feedback
const clearFeedback = () => {
  localStorage.removeItem(`review_${sessionId}_feedback_user`);
  setSavedUserFeedback('');
};

// Fetch all public feedback
const fetchAllFeedbacks = async () => {
  try {
    const res = await fetch(`${API_URL}/api/feedback/all`);
    const data = await res.json();
    if (data.success) {
      setAllFeedbacks(data.feedback || []);
    }
  } catch (err) {
    console.error('Error fetching feedback:', err);
  }
};

// Submit public feedback
const submitPublicFeedback = async () => {
  const feedback = feedbackTextareaRef.current?.value || '';
  if (!feedback.trim()) {
    alert('Please write some feedback first.');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/feedback/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        session_id: sessionId,
        feedback: feedback,
        rating: feedbackRating || 0,
        persona: sessionConfig?.persona || '',
        topic: sessionConfig?.topic || ''
      })
    });

    const data = await res.json();
    if (data.success) {
      alert('✅ Feedback submitted! Thank you!');
      setShowFeedbackMenu(false);
      if (feedbackTextareaRef.current) {
        feedbackTextareaRef.current.value = '';
      }
      setFeedbackRating(0);
      fetchAllFeedbacks();
    } else {
      alert('❌ Failed to submit feedback. Please try again.');
    }
  } catch (err) {
    console.error('Error submitting feedback:', err);
    alert('❌ Error submitting feedback');
  }
};

// Delete feedback (Admin only)
const deleteFeedback = async (feedbackId: string) => {
  if (!confirm('Are you sure you want to delete this feedback?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/feedback/delete/${feedbackId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      alert('✅ Feedback deleted!');
      fetchAllFeedbacks();
    } else {
      alert('❌ Failed to delete feedback');
    }
  } catch (err) {
    console.error('Error deleting feedback:', err);
    alert('❌ Error deleting feedback');
  }
};

// Pin/Unpin feedback (Admin only)
const togglePinFeedback = async (feedbackId: string, currentPinned: boolean) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/feedback/pin/${feedbackId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pinned: !currentPinned })
    });
    const data = await res.json();
    if (data.success) {
      alert(`✅ Feedback ${!currentPinned ? 'pinned' : 'unpinned'}!`);
      fetchAllFeedbacks();
    } else {
      alert('❌ Failed to pin feedback');
    }
  } catch (err) {
    console.error('Error pinning feedback:', err);
    alert('❌ Error pinning feedback');
  }
};

  // Analyze chat function with language support
  const analyzeChat = async (msgs: any[], config: any, lang: string) => {
  if (!msgs || msgs.length === 0) return;
  setAnalyzing(true);
  try {
    const res = await fetch(`${API_URL}/api/chat/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: msgs,
        persona: config.persona,
        topic: config.topic,
        mode: config.mode,
        language: lang
      })
    });
    const data = await res.json();
    if (data.success) {
      setAnalysis(data.analysis);
    }
  } catch (err) {
    console.error('Analysis error:', err);
  } finally {

    
    setAnalyzing(false);
  }
};



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
    
    const config = localStorage.getItem(`session_${sessionId}_config`);
    let sessionConfigData = null;
    if (config) {
      sessionConfigData = JSON.parse(config);
      setSessionConfig(sessionConfigData);
    }
    
    const savedMessages = localStorage.getItem(`review_${sessionId}_messages`);
if (savedMessages) {
  const msgs = JSON.parse(savedMessages);
  setMessages(msgs);
  
  // ✅ Pehle check karo saved score hai?
  const savedPoints = localStorage.getItem(`review_${sessionId}_points`);
  if (savedPoints) {
    setFinalScore(parseInt(savedPoints));
  } else {
    // ✅ Score API call - ALAG SE
    fetch(`${API_URL}/api/chat/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: msgs,
        persona: sessionConfigData?.persona || 'New Atheist',
        topic: sessionConfigData?.topic || 'Problem of Evil',
        mode: sessionConfigData?.mode || 'Debate',
        language: displayLanguage
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log('📊 Score API Response:', data);
      if (data.success) {
        const score = data.score || 0;
        setFinalScore(score);
        localStorage.setItem(`review_${sessionId}_points`, String(score));
        if (data.breakdown) {
          localStorage.setItem(`review_${sessionId}_breakdown`, JSON.stringify(data.breakdown));
        }
        if (data.feedback) {
          localStorage.setItem(`review_${sessionId}_feedback`, data.feedback);
        }
      } else {
        console.error('❌ Score API failed:', data.error);
        // Fallback: extract from messages
        let total = 0;
        let count = 0;
        msgs.forEach((msg: any) => {
          if (msg.role === 'assistant') {
            const match = msg.content.match(/(\d+)\/10/);
            if (match) {
              total += parseInt(match[1]);
              count++;
            }
          }
        });
        const fallbackScore = count > 0 ? Math.round((total / count) * 10) : 0;
        setFinalScore(fallbackScore);
        localStorage.setItem(`review_${sessionId}_points`, String(fallbackScore));
      }
    })
    .catch(err => {
      console.error('❌ Score API Error:', err);
      // Fallback: extract from messages
      let total = 0;
      let count = 0;
      msgs.forEach((msg: any) => {
        if (msg.role === 'assistant') {
          const match = msg.content.match(/(\d+)\/10/);
          if (match) {
            total += parseInt(match[1]);
            count++;
          }
        }
      });
      const fallbackScore = count > 0 ? Math.round((total / count) * 10) : 0;
      setFinalScore(fallbackScore);
      localStorage.setItem(`review_${sessionId}_points`, String(fallbackScore));
    });
  }
  
  // ✅ Analysis API - ALAG SE (score ke baad)
  if (sessionConfigData) {
    // Thoda delay karo taake score API pehle complete ho
    setTimeout(() => {
      analyzeChat(msgs, sessionConfigData, displayLanguage);
    }, 500);
  }
  // ✅ Calculate session duration
const startTime = localStorage.getItem(`session_${sessionId}_start_time`);
if (startTime) {
  const duration = Math.floor((Date.now() - parseInt(startTime)) / 1000);
  setSessionDuration(duration);
}

// ✅ Calculate points from messages
let totalPoints = 0;
msgs.forEach((msg: any) => {
  if (msg.role === 'assistant') {
    const match = msg.content.match(/(\d+)\/10/);
    if (match) {
      totalPoints += parseInt(match[1]);
    }
  }
});
setPoints(totalPoints);
}


  }, [sessionId]);

  // Load saved feedback
useEffect(() => {
  const saved = localStorage.getItem(`review_${sessionId}_feedback_user`);
  if (saved) {
    setSavedUserFeedback(saved);
  }
}, [sessionId]);

// Load public feedback
useEffect(() => {
  fetchAllFeedbacks();
}, []);

  // Re-analyze when language changes
  useEffect(() => {
    if (messages.length > 0 && sessionConfig) {
      analyzeChat(messages, sessionConfig, displayLanguage);
    }
  }, [displayLanguage]);

  useEffect(() => {
  if (analysis && !analyzing && messages.length > 0 && sessionId) {
    console.log('📤 Analysis complete, auto-saving review...');
    saveReviewToDatabase();
  }
}, [analysis, analyzing, messages, sessionId]);

  const startNewSession = () => {
    router.push('/dashboard');
  };

  // Check if user is admin
useEffect(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      setIsAdmin(user?.role === 'admin');
    } catch(e) {}
  }
}, []);

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid #2d2d3a',
        padding: '12px 24px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>{currentText.sessionReview}</h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
              {currentText.subTitle}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>

              {/* ✅ MY PROGRESS BUTTON - YAHAN ADD KARO */}
  <button 
    onClick={() => router.push('/individual-progress')} 
    style={{
      padding: '8px 16px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #10a37f',
      borderRadius: '20px',
      color: '#10a37f',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#10a37f20'; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
  >
    📊 My Progress
  </button>

  
            {/* Language Switcher */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#1a1a1a', borderRadius: '24px', padding: '4px', border: '1px solid #333' }}>
              <button
                onClick={() => setDisplayLanguage('en')}
                style={{
                  padding: '6px 14px',
                  backgroundColor: displayLanguage === 'en' ? '#10a37f' : 'transparent',
                  border: 'none',
                  borderRadius: '20px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: displayLanguage === 'en' ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                English
              </button>
              <button
                onClick={() => setDisplayLanguage('ur')}
                style={{
                  padding: '6px 14px',
                  backgroundColor: displayLanguage === 'ur' ? '#10a37f' : 'transparent',
                  border: 'none',
                  borderRadius: '20px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: displayLanguage === 'ur' ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                اردو
              </button>
              <button
                onClick={() => setDisplayLanguage('ar')}
                style={{
                  padding: '6px 14px',
                  backgroundColor: displayLanguage === 'ar' ? '#10a37f' : 'transparent',
                  border: 'none',
                  borderRadius: '20px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: displayLanguage === 'ar' ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                العربية
              </button>
            </div>

            {/* GIVE FEEDBACK BUTTON */}
<div style={{ 
  position: 'relative',
  display: 'inline-block'
}}>
  <button
    className="feedback-button"
    onClick={() => setShowFeedbackMenu(!showFeedbackMenu)}
    style={{
      padding: '8px 16px',
      backgroundColor: '#f59e0b20',
      border: '1px solid #f59e0b',
      borderRadius: '20px',
      color: '#f59e0b',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f59e0b30'; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f59e0b20'; }}
  >
    ✍️ Give Feedback
    <span style={{ fontSize: '10px' }}>{showFeedbackMenu ? '▲' : '▼'}</span>
  </button>

  {showFeedbackMenu && (
   <div 
  className="feedback-dropdown"
  style={{
    position: isMobile ? 'fixed' : 'absolute',
    top: isMobile ? '50%' : 'calc(100% + 12px)',
    left: isMobile ? '50%' : '50%',
    transform: isMobile ? 'translate(-50%, -50%)' : 'translateX(-50%)',
    width: isMobile ? '92%' : '520px',
    maxWidth: isMobile ? '500px' : '600px',
    maxHeight: isMobile ? '85vh' : '70vh',
    overflowY: 'auto',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    zIndex: 999,
    padding: '24px',
    minWidth: isMobile ? 'auto' : '400px'
  }}
>
      {/* ===== HEADER ===== */}
     <div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: '1px solid #2d2d3a'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span style={{ color: '#fff', fontSize: isMobile ? '15px' : '18px', fontWeight: '600' }}>💬 Reviews</span>
    <span style={{ 
      color: '#888', 
      fontSize: isMobile ? '11px' : '13px',
      backgroundColor: '#2d2d3a',
      padding: '2px 10px',
      borderRadius: '12px'
    }}>
      {allFeedbacks.length}
    </span>
  </div>
  <button
    onClick={() => setShowFeedbackMenu(false)}
    style={{
      background: 'none',
      border: 'none',
      color: '#888',
      fontSize: '22px',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '8px',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => { 
      e.currentTarget.style.color = '#fff';
      e.currentTarget.style.backgroundColor = '#2d2d3a';
    }}
    onMouseLeave={(e) => { 
      e.currentTarget.style.color = '#888';
      e.currentTarget.style.backgroundColor = 'transparent';
    }}
  >
    ✕
  </button>
</div>

      {/* ===== REVIEWS SECTION (PEHLE) ===== */}
      <div style={{ marginBottom: '16px' }}>
        {allFeedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#666' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
            <p style={{ fontSize: '13px', margin: 0 }}>No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div style={{ 
  maxHeight: isMobile ? '200px' : '300px', 
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingRight: '4px'
}}>
            {allFeedbacks.map((fb: any, idx: number) => (
             <div key={idx} style={{
  backgroundColor: fb.pinned ? '#0a2a1a' : '#0a0a0a',
  borderRadius: '10px',
  padding: '14px 16px',
  border: fb.pinned ? '1px solid #10a37f' : '1px solid #2d2d3a',
  position: 'relative',
  transition: 'all 0.2s ease'
}}
onMouseEnter={(e) => { 
  if (!fb.pinned) e.currentTarget.style.borderColor = '#10a37f40'; 
}}
onMouseLeave={(e) => { 
  if (!fb.pinned) e.currentTarget.style.borderColor = '#2d2d3a'; 
}}
>
                {/* Pinned Badge */}
                {fb.pinned && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: '#10a37f',
                    color: '#fff',
                    fontSize: '8px',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    📌 Pinned
                  </div>
                )}
                
                {/* User Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>👤</span>
                    <span style={{ color: '#10a37f', fontSize: '12px', fontWeight: '500' }}>
                      {fb.user_name || 'Anonymous'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#666', fontSize: '9px' }}>{fb.date || 'Just now'}</span>
                    
                    {/* Admin Actions */}
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <button
                          onClick={() => togglePinFeedback(fb._id, fb.pinned || false)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: fb.pinned ? '#f59e0b' : '#555',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px 4px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#f59e0b'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = fb.pinned ? '#f59e0b' : '#555'; }}
                          title={fb.pinned ? 'Unpin' : 'Pin'}
                        >
                          📌
                        </button>
                        <button
                          onClick={() => deleteFeedback(fb._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#555',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px 4px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Rating Stars */}
                {fb.rating > 0 && (
                  <div style={{ marginBottom: '4px' }}>
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} style={{ 
                        color: star <= fb.rating ? '#f59e0b' : '#333', 
                        fontSize: '11px' 
                      }}>★</span>
                    ))}
                  </div>
                )}
                
                {/* Feedback Content */}
                <p style={{ color: '#ddd', fontSize: '12px', margin: '4px 0', lineHeight: '1.5' }}>
                  {fb.feedback}
                </p>
                
                {/* Tags */}
                {fb.persona && (
                  <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      backgroundColor: '#10a37f20', 
                      color: '#10a37f', 
                      fontSize: '8px', 
                      padding: '2px 10px', 
                      borderRadius: '12px'
                    }}>
                      🎭 {fb.persona}
                    </span>
                    {fb.topic && (
                      <span style={{ 
                        backgroundColor: '#3b82f620', 
                        color: '#3b82f6', 
                        fontSize: '8px', 
                        padding: '2px 10px', 
                        borderRadius: '12px'
                      }}>
                        📚 {fb.topic}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== VIEW ALL LINK ===== */}
      {allFeedbacks.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <button
            onClick={() => {
              setShowFeedbackMenu(false);
              document.getElementById('community-feedback-section')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#10a37f',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '4px 12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#1a7f64'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#10a37f'; }}
          >
            View all {allFeedbacks.length} reviews →
          </button>
        </div>
      )}

      {/* ===== DIVIDER ===== */}
      <div style={{ 
        borderTop: '1px solid #2d2d3a', 
        margin: '12px 0 16px 0' 
      }} />

      {/* ===== WRITE A REVIEW (NEECHE) ===== */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>✍️ Write a Review</span>
          <span style={{ color: '#666', fontSize: '11px' }}>Share your experience</span>
        </div>
        
        {/* Textarea */}
       <textarea
  ref={feedbackTextareaRef}
  style={{
    width: '100%',
    minHeight: isMobile ? '60px' : '80px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #2d2d3a',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#fff',
    fontSize: isMobile ? '13px' : '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    marginBottom: '12px',
    transition: 'border 0.2s ease'
  }}
  onFocus={(e) => { e.currentTarget.style.borderColor = '#10a37f'; }}
  onBlur={(e) => { e.currentTarget.style.borderColor = '#2d2d3a'; }}
  placeholder="What did you learn? What could be improved?"
  defaultValue={savedUserFeedback}
/>

        {/* Rating Stars */}
        <div style={{ marginBottom: '10px' }}>
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>⭐ Rate your experience:</p>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                onClick={() => setFeedbackRating(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: star <= feedbackRating ? '#f59e0b' : '#333',
                  transition: 'all 0.2s ease',
                  padding: '0 2px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        {/* Submit & Cancel Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
         <button
  onClick={submitPublicFeedback}
  style={{
    flex: 1,
    padding: isMobile ? '8px 16px' : '10px 24px',
    backgroundColor: '#10a37f',
    border: 'none',
    borderRadius: '24px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 12px rgba(16,163,127,0.3)'
  }}
  onMouseEnter={(e) => { 
    e.currentTarget.style.backgroundColor = '#1a7f64';
    e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,163,127,0.4)';
  }}
  onMouseLeave={(e) => { 
    e.currentTarget.style.backgroundColor = '#10a37f';
    e.currentTarget.style.boxShadow = '0 2px 12px rgba(16,163,127,0.3)';
  }}
>
  ⭐ Submit Review
</button>
         <button
  onClick={() => setShowFeedbackMenu(false)}
  style={{
    padding: isMobile ? '8px 16px' : '10px 24px',
    backgroundColor: 'transparent',
    border: '1px solid #2d2d3a',
    borderRadius: '24px',
    color: '#888',
    cursor: 'pointer',
    fontSize: isMobile ? '13px' : '14px',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => { 
    e.currentTarget.style.color = '#fff';
    e.currentTarget.style.borderColor = '#10a37f';
  }}
  onMouseLeave={(e) => { 
    e.currentTarget.style.color = '#888';
    e.currentTarget.style.borderColor = '#2d2d3a';
  }}
>
  Cancel
</button>
        </div>
        
        {/* Show saved feedback */}
        {savedUserFeedback && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2d2d3a' }}>
            <p style={{ color: '#888', fontSize: '11px', marginBottom: '4px' }}>📝 Previously saved:</p>
            <div style={{ 
              backgroundColor: '#0a0a0a', 
              padding: '10px', 
              borderRadius: '8px',
              color: '#aaa',
              fontSize: '12px',
              border: '1px solid #10a37f40'
            }}>
              {savedUserFeedback}
            </div>
            <button
              onClick={clearFeedback}
              style={{
                marginTop: '6px',
                padding: '4px 12px',
                backgroundColor: 'transparent',
                border: '1px solid #ef4444',
                borderRadius: '16px',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '11px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ff6666'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#ef4444'; }}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  )}
</div>  
         {/* Share Dropdown */}
            <div style={{ position: 'relative' }} ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '20px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>🔗</span>
                {currentText.share}
                <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
              </button>

              {showShareMenu && (
  <div style={{
    position: isMobile ? 'fixed' : 'absolute',
    top: isMobile ? '50%' : '45px',
    left: isMobile ? '50%' : 'auto',
    right: isMobile ? 'auto' : '0',
    transform: isMobile ? 'translate(-50%, -50%)' : 'none',
    width: isMobile ? '90%' : '180px',
    maxWidth: '300px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    zIndex: 999,
    overflow: 'hidden'
  }}>
                  <button
                    onClick={shareViaWhatsApp}
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
                    <span></span> {currentText.whatsapp}
                  </button>
                  
                  <button
                    onClick={copyReviewToClipboard}
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
                    <span></span> {currentText.copyReview}
                  </button>
                  
                  <button
                    onClick={downloadReview}
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
                    <span></span> {currentText.downloadReview}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Session Info */}
        {sessionConfig && (
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid #2d2d3a' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div><span style={{ color: '#888' }}>{currentText.mode}</span> <span style={{ color: '#10a37f' }}>{sessionConfig.mode}</span></div>
              <div><span style={{ color: '#888' }}>{currentText.persona}</span> <span style={{ color: '#10a37f' }}>{sessionConfig.persona}</span></div>
              <div><span style={{ color: '#888' }}>{currentText.topic}</span> <span style={{ color: '#10a37f' }}>{sessionConfig.topic}</span></div>
              <div><span style={{ color: '#888' }}>{currentText.difficulty}</span> <span style={{ color: '#10a37f' }}>{sessionConfig.difficulty}</span></div>
              <div><span style={{ color: '#888' }}>{currentText.language}</span> <span style={{ color: '#10a37f' }}>{sessionConfig.language}</span></div>
            </div>
          </div>
        )}

        {/* Final Score Card */}
        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '32px',
          border: '1px solid #2d2d3a'
        }}>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>{currentText.finalScore}</div>
<div style={{ 
  fontSize: isMobile ? '48px' : '64px', 
  fontWeight: '700', 
  color: '#10a37f' 
}}>{finalScore}</div>          <div style={{ fontSize: '14px', color: '#666' }}>{currentText.outOf100}</div>
        </div>

        {/* AI Analysis Section */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '32px', border: '1px solid #2d2d3a' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
            {currentText.aiCoachAnalysis}
          </h3>
          
          {analyzing ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ width: 30, height: 30, border: '2px solid #10a37f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p style={{ color: '#888' }}>{currentText.analyzing}</p>
            </div>
          ) : analysis ? (
            <>
              {/* Best Moments */}
              {analysis.best_moments && analysis.best_moments.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#10a37f', marginBottom: '12px' }}>{currentText.bestMoments}</h4>
                  {analysis.best_moments.map((item: any, idx: number) => (
                    <div key={idx} style={{ backgroundColor: '#0a0a0a', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                      <div style={{ color: '#fff', fontSize: '13px', marginBottom: '4px' }}>"{item.quote}"</div>
                      <div style={{ color: '#10a37f', fontSize: '11px' }}>{item.reason}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Areas to Improve */}
              {analysis.areas_to_improve && analysis.areas_to_improve.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b', marginBottom: '12px' }}>{currentText.areasToImprove}</h4>
                  {analysis.areas_to_improve.map((item: any, idx: number) => (
                    <div key={idx} style={{ backgroundColor: '#0a0a0a', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                      <div style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>{item.issue}</div>
                      <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Example: "{item.example}"</div>
                      <div style={{ color: '#10a37f', fontSize: '11px' }}>💡 {item.suggestion}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Actionable Suggestions */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#a855f7', marginBottom: '12px' }}>{currentText.whatToStudy}</h4>
                  {analysis.suggestions.map((suggestion: string, idx: number) => (
                    <div key={idx} style={{ backgroundColor: '#0a0a0a', padding: '10px 12px', borderRadius: '8px', marginBottom: '8px' }}>
                      <span style={{ color: '#a855f7', marginRight: '8px' }}>•</span>
                      <span style={{ color: '#ddd', fontSize: '12px' }}>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p style={{ color: '#666', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              {currentText.noAnalysis}
            </p>
          )}
        </div>

                

        {/* Full Transcript */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '20px', border: '1px solid #2d2d3a', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>{currentText.fullTranscript}</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {messages.map((msg: any, idx: number) => (
              <div key={idx} style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#0a0a0a',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '12px', color: '#10a37f', marginBottom: '4px' }}>
                  {msg.role === 'user' ? currentText.you : currentText.ai} 
                  {msg.score && ` · ${currentText.score}: ${msg.score}/10`}
                </div>
                <div style={{ color: '#fff', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {cleanMessage(msg.content)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
  display: 'flex', 
  flexDirection: isMobile ? 'column' : 'row',
  gap: '12px'
}}>

          {/* ✅ MY PROGRESS BUTTON - YAHAN ADD KARO */}
 <button
  onClick={() => router.push('/individual-progress')}
  style={{
    flex: 1,
    width: isMobile ? '100%' : 'auto',
    minWidth: isMobile ? 'auto' : '120px',
    padding: '14px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #10a37f',
    borderRadius: '40px',
    color: '#10a37f',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  }}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#10a37f20'; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
  >
    📊 My Progress
  </button>
  
          <button
            onClick={startNewSession}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#10a37f',
              border: 'none',
              borderRadius: '40px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {currentText.newSession}
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2d2d3a',
              borderRadius: '40px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {currentText.backToSetup}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Wrap with Suspense boundary
export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
        <div>Loading review...</div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}