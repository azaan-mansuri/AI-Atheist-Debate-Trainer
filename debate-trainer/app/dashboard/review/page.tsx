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
      
      // ✅ Use saved points from localStorage
      const savedPoints = localStorage.getItem(`review_${sessionId}_points`);
      if (savedPoints) {
        setFinalScore(parseInt(savedPoints));
      } else {
        // Fallback: calculate from message scores
        let total = 0;
        msgs.forEach((msg: any) => {
          if (msg.role === 'assistant' && msg.score) {
            total += msg.score;
          }
        });
        setFinalScore(total);
      }
      
      if (sessionConfigData) {
        analyzeChat(msgs, sessionConfigData, displayLanguage);
      }
    }
  }, [sessionId]);

  // Re-analyze when language changes
  useEffect(() => {
    if (messages.length > 0 && sessionConfig) {
      analyzeChat(messages, sessionConfig, displayLanguage);
    }
  }, [displayLanguage]);

  const startNewSession = () => {
    router.push('/dashboard');
  };

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
          <div style={{ fontSize: '64px', fontWeight: '700', color: '#10a37f' }}>{finalScore}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>{currentText.outOf100}</div>
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
        <div style={{ display: 'flex', gap: '16px' }}>
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