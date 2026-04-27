'use client';

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  const features = [
    {
      icon: '🎯',
      title: 'Purpose of This Tool',
      description: 'To help Ulama e Ikram and serious students strengthen their reasoning skills against atheistic arguments through structured debate practice.'
    },
    {
      icon: '⚙️',
      title: 'How It Works',
      description: 'AI acts as an Atheist Simulator and Debate Coach. You respond, AI evaluates your answer, gives feedback, and asks the next question.'
    },
    {
      icon: '📖',
      title: 'How to Use',
      description: '1️⃣ Select your level (Beginner/Intermediate/Advanced)\n2️⃣ Choose Mode (Type or Voice)\n3️⃣ Click Start Debate\n4️⃣ Answer the objection\n5️⃣ Get feedback & improve'
    },
    {
      icon: '🤖',
      title: 'AI Limitations',
      description: 'This is an AI system. It may make mistakes, give incomplete answers, or sometimes misunderstand context. Always verify critical information.'
    }
  ];

  const steps = [
    { num: '01', title: 'Sign Up / Login', desc: 'Create your free account to save your progress' },
    { num: '02', title: 'Choose Your Level', desc: 'Beginner, Intermediate, or Advanced difficulty' },
    { num: '03', title: 'Pick Mode', desc: 'Type mode (silent) or Voice mode (speak)' },
    { num: '04', title: 'Start Debate', desc: 'AI gives an objection, you respond' },
    { num: '05', title: 'Get Feedback', desc: 'AI evaluates and gives the next objection' },
    { num: '06', title: 'Track Progress', desc: 'Points, history, and saved conversations' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode 
        ? 'radial-gradient(circle at 0% 0%, #0f0c29, #1a1a3e, #0a0a1a)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: darkMode ? 'rgba(15,25,45,0.8)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>🎙️</div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: '600', color: darkMode ? '#fff' : '#1a1a2e' }}>AI Debate Simulator</span>
              <div style={{ fontSize: '10px', color: '#667eea', fontWeight: '500' }}>For Ulama e Ikram</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{
              background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: darkMode ? '#fff' : '#333'
            }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => router.push('/login')} style={{
              background: 'none', border: `1px solid ${darkMode ? '#667eea' : '#667eea'}`,
              color: '#667eea', padding: '8px 20px', borderRadius: '40px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
            }}>
              Sign In
            </button>
            <button onClick={() => router.push('/signup')} style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white', padding: '8px 20px', borderRadius: '40px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
            }}>
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Ulama e Ikram Badge - Hero Section */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #667eea20, #764ba220)',
          border: `1px solid ${darkMode ? 'rgba(102,126,234,0.3)' : 'rgba(102,126,234,0.5)'}`,
          borderRadius: '60px',
          padding: '8px 20px',
          backdropFilter: 'blur(10px)'
        }}>
          <span style={{ fontSize: '20px' }}>🎙️</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#667eea' }}>مختص بعلمائے کرام</span>
<span style={{ fontSize: '12px', color: darkMode ? '#a0a0b0' : '#666' }}>|</span>
          <span style={{ fontSize: '13px', fontWeight: '500', color: darkMode ? '#fff' : '#333' }}>Exclusively for Honorable Scholars</span>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            width: '100px', height: '100px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '48px', margin: '0 auto 20px',
            boxShadow: '0 20px 35px -10px rgba(102,126,234,0.4)'
          }}>🎙️</div>
          <h1 style={{
            fontSize: '48px', fontWeight: '800', margin: '0 0 16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent'
          }}>
            AI Atheism Debate Simulator
          </h1>
          <p style={{ fontSize: '18px', color: darkMode ? '#a0a0b0' : '#555', maxWidth: '600px', margin: '0 auto 16px' }}>
            Train your reasoning, practice responses to atheistic objections, and improve your debate skills — with AI-powered feedback.
          </p>
          <div style={{
            display: 'inline-block',
            background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: '40px',
            padding: '6px 16px',
            marginBottom: '32px'
          }}>
            <span style={{ fontSize: '13px', color: '#667eea' }}>✨ Specially designed for Ulama e Ikram</span>
          </div>
          <div>
            <button onClick={() => router.push('/signup')} style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white', padding: '14px 32px', borderRadius: '40px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '600',
              boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
            }}>
              🚀 Start Free — For Scholars
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '48px', color: darkMode ? '#fff' : '#1a1a2e' }}>
          Why This Tool for Ulama e Ikram?
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '28px',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: darkMode ? '#fff' : '#1a1a2e' }}>
                {feature.title}
              </h3>
              <p style={{ color: darkMode ? '#a0a0b0' : '#666', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works - Step by Step */}
      <section style={{ padding: '60px 24px', backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '16px', color: darkMode ? '#fff' : '#1a1a2e' }}>
            How to Use
          </h2>
          <p style={{ textAlign: 'center', color: darkMode ? '#a0a0b0' : '#666', marginBottom: '48px' }}>
            Simple steps to start your debate journey
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '24px',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                  borderRadius: '20px', padding: '20px 24px',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                }}
              >
                <div style={{
                  width: '60px', height: '60px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', fontWeight: '700', color: 'white'
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: darkMode ? '#fff' : '#1a1a2e' }}>
                    {step.title}
                  </h4>
                  <p style={{ color: darkMode ? '#a0a0b0' : '#666', margin: 0 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '48px', color: darkMode ? '#fff' : '#1a1a2e' }}>
          Key Features
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px', textAlign: 'center'
        }}>
          {[
            { icon: '🎤', title: 'Voice Mode', desc: 'Speak your answers naturally' },
            { icon: '⌨️', title: 'Type Mode', desc: 'Silent typing practice' },
            { icon: '🌍', title: 'Auto Language', desc: 'Urdu, Hindi, English, Arabic' },
            { icon: '📜', title: 'Debate History', desc: 'Save all conversations' },
            { icon: '🌙', title: 'Dark/Light Mode', desc: 'Easy on eyes' },
            { icon: '🎚️', title: 'Voice Control', desc: 'Speed, pitch, volume' },
            { icon: '💾', title: 'Auto-Save', desc: 'Chat stays after page refresh' },
            { icon: '⌨️', title: 'Ctrl+K', desc: 'Quick commands' }
          ].map((feat, idx) => (
            <div key={idx} style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
              borderRadius: '16px', padding: '20px',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{feat.icon}</div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: darkMode ? '#fff' : '#1a1a2e' }}>{feat.title}</h4>
              <p style={{ fontSize: '13px', color: darkMode ? '#a0a0b0' : '#666' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Disclaimer */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          backgroundColor: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '20px', padding: '24px 32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤖</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#ef4444' }}>
            ⚠️ AI Disclaimer
          </h3>
          <p style={{ color: darkMode ? '#fca5a5' : '#991b1b', fontSize: '14px', lineHeight: 1.6 }}>
            This tool uses Artificial Intelligence. AI can make mistakes, provide incomplete answers, or misinterpret your responses.<br />
            <strong>Always verify critical information from authentic sources.</strong><br />
            Use this tool as a training aid, not as a fatwa or religious ruling source.
          </p>
        </div>
      </section>

      {/* For Ulama e Ikram - Exclusive Note */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          background: 'linear-gradient(135deg, #667eea10, #764ba210)',
          border: `1px solid ${darkMode ? 'rgba(102,126,234,0.3)' : 'rgba(102,126,234,0.5)'}`,
          borderRadius: '20px', padding: '32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎙️</div>
          <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: darkMode ? '#fff' : '#1a1a2e' }}>
            مختص بعلمائے کرام
          </h3>
          <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#667eea' }}>
            Exclusively for Honorable Scholars
          </p>
          <p style={{ color: darkMode ? '#a0a0b0' : '#666', fontSize: '14px', maxWidth: '500px', margin: '12px auto 0' }}>
            This platform is specifically designed for Ulama e Ikram to train against atheistic arguments.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea20, #764ba220)',
          borderRadius: '32px', padding: '48px 24px', maxWidth: '800px', margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px', color: darkMode ? '#fff' : '#1a1a2e' }}>
            Ready to Strengthen Your Reasoning?
          </h2>
          <p style={{ color: darkMode ? '#a0a0b0' : '#666', marginBottom: '32px' }}>
            Join as a scholar and start practicing debates with AI feedback
          </p>
          <button onClick={() => router.push('/signup')} style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', padding: '14px 32px', borderRadius: '40px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '600'
          }}>
            🚀 Get Started — For Ulama e Ikram
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px', textAlign: 'center', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        color: darkMode ? '#666' : '#999', fontSize: '12px'
      }}>
        <p>🎙️ AI Atheism Debate Simulator — Specially designed for Ulama e Ikram</p>
        <p style={{ marginTop: '8px' }}>A tool for training, not a substitute for authentic Islamic knowledge</p>
        <p style={{ marginTop: '8px' }}>© 2026 — Developed for Dawah training of Honorable Scholars</p>
      </footer>
    </div>
  )
}