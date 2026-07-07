'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndividualProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debateHistory, setDebateHistory] = useState([]);
  const [topicStats, setTopicStats] = useState({});

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
        setUser(JSON.parse(userData));
      } catch (e) {}
    }

    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (data.success && data.progress && data.progress.debates > 0) {
        setProgress(data.progress);
      } else {
        console.log('⚠️ API returned 0 debates, using localStorage fallback');
        calculateLocalProgress();
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
      calculateLocalProgress();
    } finally {
      setLoading(false);
    }
  };

 const calculateLocalProgress = () => {
  let debates = 0;
  let totalScore = 0;
  let highestScore = 0;
  const history: any[] = [];
  const topics: any = {};
  
  console.log('🔍 Starting localStorage scan...');
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('arena_messages_') || key.startsWith('review_'))) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data)) {
          let debateScore = 0;
          let debateTopic = 'General';
          
          data.forEach((msg: any) => {
            // Extract topic from messages
            if (msg.role === 'user' && msg.content) {
              const topicMatch = msg.content.match(/Topic:\s*(.+?)(?:\n|$)/i);
              if (topicMatch) {
                debateTopic = topicMatch[1].trim().substring(0, 30);
              }
            }
            
            // ✅ IMPROVED SCORE EXTRACTION - Multiple patterns
            if (msg.role === 'assistant' && msg.content) {
              let score = 0;
              const content = msg.content;
              
              // Pattern 1: "Score: X/10" (Standard)
              let match = content.match(/Score:\s*(\d+)\s*\/\s*10/i);
              if (match) {
                score = parseInt(match[1]);
                console.log(`✅ Pattern 1 matched: ${score}/10`);
              }
              
              // Pattern 2: "X/10" at the end of string
              if (!score) {
                match = content.match(/(\d+)\s*\/\s*10\s*$/);
                if (match) {
                  score = parseInt(match[1]);
                  console.log(`✅ Pattern 2 matched: ${score}/10`);
                }
              }
              
              // Pattern 3: "نمبر: X/10" (Urdu)
              if (!score) {
                match = content.match(/نمبر:\s*(\d+)\s*\/\s*10/i);
                if (match) {
                  score = parseInt(match[1]);
                  console.log(`✅ Pattern 3 matched: ${score}/10`);
                }
              }
              
              // Pattern 4: "score: X/10" (lowercase)
              if (!score) {
                match = content.match(/score[:\s]*(\d+)\s*\/\s*10/i);
                if (match) {
                  score = parseInt(match[1]);
                  console.log(`✅ Pattern 4 matched: ${score}/10`);
                }
              }
              
              // Pattern 5: Any "X/10" anywhere
              if (!score) {
                match = content.match(/(\d+)\s*\/\s*10/);
                if (match) {
                  score = parseInt(match[1]);
                  console.log(`✅ Pattern 5 matched: ${score}/10`);
                }
              }
              
              if (score > 0 && score <= 10) {
                debateScore = score;
                totalScore += score;
                debates++;
                if (score > highestScore) highestScore = score;
              }
            }
          });
          
          // Store in history if score found
          if (debateScore > 0) {
            history.push({
              score: debateScore,
              topic: debateTopic,
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString(),
              key: key
            });
            
            // Topic stats
            if (!topics[debateTopic]) {
              topics[debateTopic] = { total: 0, count: 0, scores: [] };
            }
            topics[debateTopic].total += debateScore;
            topics[debateTopic].count += 1;
            topics[debateTopic].scores.push(debateScore);
          }
        }
      } catch(e) {
        console.log('Error parsing:', key, e);
      }
    }
  }
  
  console.log(`📊 Found ${debates} debates with scores`);
  
  // Calculate topic averages
  const topicAverages: any = {};
  Object.keys(topics).forEach(topic => {
    topicAverages[topic] = {
      avg: Math.round((topics[topic].total / topics[topic].count) * 10) / 10,
      count: topics[topic].count,
      best: Math.max(...topics[topic].scores),
      worst: Math.min(...topics[topic].scores)
    };
  });
  
  const avgScore = debates > 0 ? Math.round((totalScore / debates) * 10) / 10 : 0;
  const level = Math.max(1, Math.floor(debates / 5) + 1);
  
  console.log(`📊 Final: debates=${debates}, avg=${avgScore}, highest=${highestScore}`);
  
  setProgress({
    level: level,
    debates: debates,
    avgScore: avgScore,
    highestScore: highestScore
  });
  
  setDebateHistory(history.reverse().slice(0, 20));
  setTopicStats(topicAverages);
};

  // Export/Share function
  const exportStats = () => {
    const data = {
      user: user,
      progress: progress,
      history: debateHistory,
      topics: topicStats,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate_stats_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareStats = () => {
    const text = `🧠 My Debate Stats:\n📊 Debates: ${progress?.debates || 0}\n⭐ Avg Score: ${progress?.avgScore || 0}/10\n🏆 Highest: ${progress?.highestScore || 0}/10\n📈 Level: ${progress?.level || 1}\n\nCheck out my progress!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Debate Progress',
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('📋 Stats copied to clipboard!');
      }).catch(() => {
        alert('Share feature not available');
      });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at center, #0a0a0a, #000000)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: '#10a37f',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '2px solid #10a37f',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          ></span>
          Loading...
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

  const generateGraphData = () => {
  const count = progress?.debates || 0;
  
  const fallbackData = [6.6, 7.6, 6.8, 6.6, 8.0, 9.5, 6.4, 7.3, 6.3, 6.6];
  
  if (count === 0) {
    return fallbackData;
  }
  
  const realData: number[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('arena_messages_') || key.startsWith('review_'))) {
      try {
        const messages = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(messages)) {
          messages.forEach((msg: any) => {
            if (msg.role === 'assistant' && msg.content) {
              // ✅ IMPROVED SCORE EXTRACTION - Multiple patterns
              let score = 0;
              const content = msg.content;
              
              // Pattern 1: "Score: X/10"
              let match = content.match(/Score:\s*(\d+)\s*\/\s*10/i);
              if (match) score = parseInt(match[1]);
              
              // Pattern 2: "X/10" at the end
              if (!score) {
                match = content.match(/(\d+)\s*\/\s*10\s*$/);
                if (match) score = parseInt(match[1]);
              }
              
              // Pattern 3: "نمبر: X/10" (Urdu)
              if (!score) {
                match = content.match(/نمبر:\s*(\d+)\s*\/\s*10/i);
                if (match) score = parseInt(match[1]);
              }
              
              // Pattern 4: "score: X/10" (lowercase)
              if (!score) {
                match = content.match(/score[:\s]*(\d+)\s*\/\s*10/i);
                if (match) score = parseInt(match[1]);
              }
              
              // Pattern 5: Any "X/10"
              if (!score) {
                match = content.match(/(\d+)\s*\/\s*10/);
                if (match) score = parseInt(match[1]);
              }
              
              if (score > 0 && score <= 10) {
                realData.push(score);
              }
            }
          });
        }
      } catch(e) {}
    }
  }
  
  if (realData.length > 0) {
    return realData.slice(-20);
  }
  
  if (progress?.avgScore && progress.avgScore > 0) {
    const avg = progress.avgScore;
    const data = [];
    for (let i = 0; i < Math.min(count, 20); i++) {
      const variation = (i % 5) * 0.3 - 0.6;
      data.push(Math.min(Math.max(avg + variation, 1), 10));
    }
    return data;
  }
  
  return fallbackData;
};

  const graphData = generateGraphData();
  const maxScore = 10;
  const graphHeight = 120;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #0a1a1a, #000000)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#10a37f',
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            marginBottom: '32px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(16,163,127,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #10a37f, #0d7a5f)',
              padding: '4px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '12px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Personal Dashboard
          </div>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#fff',
              margin: '0 0 8px 0',
              background: 'linear-gradient(135deg, #ffffff, #10a37f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            My Progress
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', margin: 0 }}>
            Track your debate journey and growth
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            { label: 'Level', value: progress?.level || 1, color: '#10a37f' },
            { label: 'Debates', value: progress?.debates || 0, color: '#06b6d4' },
            { label: 'Avg Score', value: `${progress?.avgScore || 0}/10`, color: '#10a37f' },
            { label: 'Highest Score', value: `${progress?.highestScore || 0}/10`, color: '#f59e0b' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = stat.color + '40';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${stat.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: stat.color,
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Graph Section */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: 0 }}>
              Performance Trend
            </h3>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
              Score per debate
            </span>
          </div>

          {/* Graph Container */}
          <div
            style={{
              position: 'relative',
              height: graphHeight + 40 + 'px',
              width: '100%',
            }}
          >
            {/* Y-Axis Labels */}
            <div
              style={{
                position: 'absolute',
                left: '-30px',
                top: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.2)',
                width: '24px',
              }}
            >
              <span>10</span>
              <span>8</span>
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>

            {/* Grid Lines */}
            <div
              style={{
                position: 'absolute',
                left: '0',
                right: '0',
                top: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none',
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    height: '0',
                    width: '100%',
                  }}
                />
              ))}
            </div>

            {/* Bars */}
            <div
              style={{
                position: 'absolute',
                left: '0',
                right: '0',
                bottom: '0',
                height: graphHeight + 'px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-around',
                padding: '0 4px',
              }}
            >
              {graphData.map((score, index) => {
                const heightPercent = (score / maxScore) * 100;
                const isLast = index === graphData.length - 1;

                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      flex: 1,
                      height: '100%',
                      justifyContent: 'flex-end',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '60%',
                        maxWidth: '24px',
                        minWidth: '12px',
                        height: Math.max(heightPercent, 4) + '%',
                        background: isLast
                          ? 'linear-gradient(180deg, #10a37f, #0d7a5f)'
                          : 'linear-gradient(180deg, rgba(16,163,127,0.6), rgba(16,163,127,0.15))',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        const bar = e.currentTarget;
                        bar.style.background = 'linear-gradient(180deg, #10a37f, #0d7a5f)';
                        bar.style.transform = 'scaleY(1.05)';
                        bar.style.transformOrigin = 'bottom';
                      }}
                      onMouseLeave={(e) => {
                        const bar = e.currentTarget;
                        bar.style.background = isLast
                          ? 'linear-gradient(180deg, #10a37f, #0d7a5f)'
                          : 'linear-gradient(180deg, rgba(16,163,127,0.6), rgba(16,163,127,0.15))';
                        bar.style.transform = 'scaleY(1)';
                      }}
                    />
                    <div
                      style={{
                        fontSize: '8px',
                        color: 'rgba(255,255,255,0.2)',
                        textAlign: 'center',
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {score.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-Axis Label */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '12px',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.2)',
            }}
          >
            Debate Number →
          </div>

          {/* Summary Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#10a37f' }}>
                {graphData.length > 0
                  ? (graphData.reduce((a, b) => a + b, 0) / graphData.length).toFixed(1)
                  : 0}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Average</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>
                {graphData.length > 0 ? Math.max(...graphData).toFixed(1) : 0}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Best Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#06b6d4' }}>
                {graphData.length}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Total Debates</div>
            </div>
            <div style={{ textAlign: 'center' }}>
  <div style={{ fontSize: '14px', fontWeight: '600', color: '#8b5cf6' }}>
    {graphData.length > 1
      ? (graphData[graphData.length - 1] - graphData[0]).toFixed(1)
      : 0}
  </div>
  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Improvement</div>
</div>
          </div>
        </div>

        {/* Option E: Topic-wise Stats */}
        {Object.keys(topicStats).length > 0 && (
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: 0 }}>
                🏷️ Topic Performance
              </h3>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                {Object.keys(topicStats).length} topics
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.keys(topicStats).sort((a, b) => topicStats[b].avg - topicStats[a].avg).map((topic) => {
                const stat = topicStats[topic];
                const color = stat.avg >= 8 ? '#10a37f' : stat.avg >= 6 ? '#f59e0b' : '#ef4444';
                
                return (
                  <div
                    key={topic}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                        {topic}
                      </span>
                      <span style={{ color: color, fontSize: '14px', fontWeight: '600' }}>
                        {stat.avg}/10
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      <span>{stat.count} debate{stat.count > 1 ? 's' : ''}</span>
                      <span>Best: {stat.best}/10 | Worst: {stat.worst}/10</span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '3px',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '2px',
                        marginTop: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${(stat.avg / 10) * 100}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${color}, ${color}88)`,
                          borderRadius: '2px',
                          transition: 'width 0.8s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Option A: Debate History */}
        {debateHistory.length > 0 && (
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: 0 }}>
                📜 Recent Debates
              </h3>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                {debateHistory.length} debates
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {debateHistory.slice(0, 10).map((debate: any, index) => {
                const color = debate.score >= 8 ? '#10a37f' : debate.score >= 6 ? '#f59e0b' : '#ef4444';
                
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.04)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>
                        {debate.topic || 'General Debate'}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
                        {debate.date} at {debate.time}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: color, fontSize: '18px', fontWeight: '700' }}>
                        {debate.score}/10
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Option F: Export/Share Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '32px',
          }}
        >
          <button
            onClick={exportStats}
            style={{
              padding: '12px 32px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '40px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📥 Download Report
          </button>

          <button
            onClick={shareStats}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #10a37f, #0d7a5f)',
              border: 'none',
              borderRadius: '40px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(16,163,127,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(16,163,127,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,163,127,0.3)';
            }}
          >
            📤 Share Stats
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '12px 32px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '40px',
              color: '#10a37f',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(16,163,127,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🎯 Start New Debate
          </button>
        </div>
      </div>
    </div>
  );
}