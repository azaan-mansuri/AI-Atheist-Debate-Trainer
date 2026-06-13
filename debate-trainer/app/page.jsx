'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  const t = {
    en: {
      title: 'AI Atheism Debate Simulator',
      subtitle: 'Train your reasoning, practice responses to atheistic objections, and improve your debate skills — with AI-powered feedback.',
      forUlama: 'Specially designed for Ulama e Ikram',
      cta: 'Start Free — For Scholars',
      whyTitle: 'Why This Tool for Ulama e Ikram?',
      howToUseTitle: 'How to Use',
      howToUseSub: 'Simple steps to start your debate journey',
      keyFeatures: 'Key Features',
      disclaimerTitle: 'AI Disclaimer',
      disclaimerText: 'This tool uses Artificial Intelligence. AI can make mistakes, provide incomplete answers, or misinterpret your responses.',
      disclaimerWarning: 'Always verify critical information from authentic sources.',
      disclaimerNote: 'Use this tool as a training aid, not as a fatwa or religious ruling source.',
      exclusiveTitle: 'Exclusively for Honorable Scholars',
      exclusiveDesc: 'This platform is specifically designed for Ulama e Ikram to train against atheistic arguments.',
      readyTitle: 'Ready to Strengthen Your Reasoning?',
      readyDesc: 'Join as a scholar and start practicing debates with AI feedback',
      readyCta: 'Get Started — For Ulama e Ikram',
      footer: 'A tool for training, not a substitute for authentic Islamic knowledge',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      supervisedBy: 'Supervised by',
      muftiName: 'Dr. Mufti Yasir Nadeem Al Wajdi',
      purposeTitle: 'Purpose of This Tool',
      purposeDesc: 'To help Ulama e Ikram and serious students strengthen their reasoning skills against atheistic arguments through structured debate practice.',
      howWorksTitle: 'How It Works',
      howWorksDesc: 'AI acts as an Atheist Simulator and Debate Coach. You respond, AI evaluates your answer, gives feedback, and asks the next question.',
      howUseTitle: 'How to Use',
      howUseDesc: '1️⃣ Select your level (Beginner/Intermediate/Advanced)\n2️⃣ Choose Mode (Type or Voice)\n3️⃣ Click Start Debate\n4️⃣ Answer the objection\n5️⃣ Get feedback & improve',
      limitationsTitle: 'AI Limitations',
      limitationsDesc: 'This is an AI system. It may make mistakes, give incomplete answers, or sometimes misunderstand context. Always verify critical information.',
      step1: 'Sign Up / Login',
      step1Desc: 'Create your free account to save your progress',
      step2: 'Choose Your Level',
      step2Desc: 'Beginner, Intermediate, or Advanced difficulty',
      step3: 'Pick Mode',
      step3Desc: 'Type mode (silent) or Voice mode (speak)',
      step4: 'Start Debate',
      step4Desc: 'AI gives an objection, you respond',
      step5: 'Get Feedback',
      step5Desc: 'AI evaluates and gives the next objection',
      step6: 'Track Progress',
      step6Desc: 'Points, history, and saved conversations',
      copyrightText: 'For Dawah training of Ulama e Ikram'
    },
    ur: {
      title: 'AI الحاد مباحثہ سمیولیٹر',
      subtitle: 'اپنی استدلال کو مضبوط کریں، الحادی اعتراضات کے جوابات کی مشق کریں، اور AI فیڈبیک کے ساتھ اپنی مباحثہ کی مہارتیں بہتر بنائیں۔',
      forUlama: 'مخصوص طور پر علمائے کرام کے لیے ڈیزائن کیا گیا',
      cta: 'مفت شروع کریں — علمائے کرام کے لیے',
      whyTitle: 'یہ ٹول علمائے کرام کے لیے کیوں؟',
      howToUseTitle: 'استعمال کرنے کا طریقہ',
      howToUseSub: 'اپنے مباحثے کے سفر کو شروع کرنے کے لیے آسان اقدامات',
      keyFeatures: 'اہم خصوصیات',
      disclaimerTitle: 'AI انتباہ',
      disclaimerText: 'یہ ٹول مصنوعی ذہانت استعمال کرتا ہے۔ AI غلطیاں کر سکتا ہے، نامکمل جوابات دے سکتا ہے، یا آپ کے جوابات کو غلط سمجھ سکتا ہے۔',
      disclaimerWarning: 'ہمیشہ اہم معلومات کی تصدیق مستند ذرائع سے کریں۔',
      disclaimerNote: 'اس ٹول کو تربیتی معاون کے طور پر استعمال کریں، فتویٰ یا شرعی فیصلے کے ذریعہ کے طور پر نہیں۔',
      exclusiveTitle: 'مخصوص طور پر علمائے کرام کے لیے',
      exclusiveDesc: 'یہ پلیٹ فارم خاص طور پر علمائے کرام کو الحادی دلائل کے خلاف تربیت دینے کے لیے ڈیزائن کیا گیا ہے۔',
      readyTitle: 'اپنی استدلال کو مضبوط کرنے کے لیے تیار ہیں؟',
      readyDesc: 'بطور عالم شامل ہوں اور AI فیڈبیک کے ساتھ مباحثوں کی مشق شروع کریں',
      readyCta: 'شروع کریں — علمائے کرام کے لیے',
      footer: 'تربیت کے لیے ایک ٹول، مستند اسلامی علم کا متبادل نہیں',
      signIn: 'سائن ان',
      getStarted: 'شروع کریں',
      supervisedBy: 'نگرانی',
      muftiName: 'ڈاکٹر مفتی یاسر ندیم الواجدی',
      purposeTitle: 'اس ٹول کا مقصد',
      purposeDesc: 'علمائے کرام اور طلبہ کو الحادی دلائل کے خلاف ان کی استدلال کی صلاحیتوں کو مضبوط کرنے میں مدد فراہم کرنا۔',
      howWorksTitle: 'یہ کیسے کام کرتا ہے',
      howWorksDesc: 'AI ملحد سمیولیٹر اور ڈیبیٹ کوچ کا کردار ادا کرتا ہے۔ آپ جواب دیتے ہیں، AI آپ کے جواب کا جائزہ لیتا ہے، فیڈبیک دیتا ہے، اور اگلا سوال پوچھتا ہے۔',
      howUseTitle: 'استعمال کرنے کا طریقہ',
      howUseDesc: '1️⃣ اپنی سطح منتخب کریں (شروع/انٹرمیڈیٹ/ایڈوانسڈ)\n2️⃣ موڈ منتخب کریں (ٹائپ یا وائس)\n3️⃣ مباحثہ شروع کریں پر کلک کریں\n4️⃣ اعتراض کا جواب دیں\n5️⃣ فیڈبیک حاصل کریں اور بہتر بنائیں',
      limitationsTitle: 'AI کی حدود',
      limitationsDesc: 'یہ ایک مصنوعی ذہانت کا نظام ہے۔ یہ غلطیاں کر سکتا ہے، نامکمل جوابات دے سکتا ہے، یا سیاق و سباق کو غلط سمجھ سکتا ہے۔',
      step1: 'سائن اپ / لاگ ان',
      step1Desc: 'اپنی پیشرفت کو محفوظ کرنے کے لیے مفت اکاؤنٹ بنائیں',
      step2: 'اپنی سطح منتخب کریں',
      step2Desc: 'شروع، انٹرمیڈیٹ، یا ایڈوانسڈ مشکل',
      step3: 'موڈ منتخب کریں',
      step3Desc: 'ٹائپ موڈ یا وائس موڈ',
      step4: 'مباحثہ شروع کریں',
      step4Desc: 'AI ایک اعتراض پیش کرتا ہے، آپ جواب دیتے ہیں',
      step5: 'فیڈبیک حاصل کریں',
      step5Desc: 'AI تشخیص کرتا ہے اور اگلا اعتراض پیش کرتا ہے',
      step6: 'پیشرفت پر نظر رکھیں',
      step6Desc: 'پوائنٹس، تاریخ، اور محفوظ گفتگو',
      copyrightText: 'علمائے کرام کی دعوتی تربیت کے لیے'
    },
    ar: {
      title: 'محاكي مناظرة الإلحاد بالذكاء الاصطناعي',
      subtitle: 'عزز تفكيرك، تدرب على الرد على الاعتراضات الإلحادية، وحسن مهاراتك في المناظرة مع ردود فعل مدعومة بالذكاء الاصطناعي.',
      forUlama: 'صمم خصيصًا لعلماء الأمة',
      cta: 'ابدأ مجانًا — للعلماء',
      whyTitle: 'لماذا هذه الأداة لعلماء الأمة؟',
      howToUseTitle: 'كيفية الاستخدام',
      howToUseSub: 'خطوات بسيطة لبدء رحلتك في المناظرة',
      keyFeatures: 'الميزات الرئيسية',
      disclaimerTitle: 'تنبيه الذكاء الاصطناعي',
      disclaimerText: 'هذه الأداة تستخدم الذكاء الاصطناعي. قد يخطئ الذكاء الاصطناعي، أو يقدم إجابات غير كاملة، أو يسيء فهم ردودك.',
      disclaimerWarning: 'تحقق دائمًا من المعلومات الهامة من مصادر موثوقة.',
      disclaimerNote: 'استخدم هذه الأداة كمساعدة تدريبية، وليس كمصدر للفتوى أو الأحكام الشرعية.',
      exclusiveTitle: 'حصريًا للعلماء',
      exclusiveDesc: 'هذه المنصة صممت خصيصًا لعلماء الأمة للتدرب على الرد على الشبهات الإلحادية.',
      readyTitle: 'هل أنت مستعد لتقوية تفكيرك؟',
      readyDesc: 'انضم كعالم وابدأ ممارسة المناظرات مع ردود فعل الذكاء الاصطناعي',
      readyCta: 'ابدأ الآن — للعلماء',
      footer: 'أداة للتدريب، وليست بديلاً عن المعرفة الإسلامية الأصيلة',
      signIn: 'تسجيل الدخول',
      getStarted: 'ابدأ الآن',
      supervisedBy: 'بإشراف',
      muftiName: 'الدكتور المفتي ياسر نديم الوجدي',
      purposeTitle: 'الغرض من هذه الأداة',
      purposeDesc: 'لمساعدة علماء الأمة والطلاب الجادين على تعزيز مهاراتهم في الرد على الشبهات الإلحادية من خلال ممارسة المناظرة المنظمة.',
      howWorksTitle: 'كيف تعمل',
      howWorksDesc: 'يعمل الذكاء الاصطناعي كمحاكي إلحادي ومدرب مناظرة. ترد عليه، ويقيم الذكاء الاصطناعي إجابتك، ويقدم ملاحظات، ويطرح السؤال التالي.',
      howUseTitle: 'طريقة الاستخدام',
      howUseDesc: '١ اختر مستواك (مبتدئ/متوسط/متقدم)\n٢ اختر الوضع (كتابة أو صوت)\n٣ انقر ابدأ المناظرة\n٤ أجب على الاعتراض\n٥ احصل على ملاحظات وتحسن',
      limitationsTitle: 'حدود الذكاء الاصطناعي',
      limitationsDesc: 'هذا نظام ذكاء اصطناعي. قد يرتكب أخطاء، أو يقدم إجابات غير كاملة، أو يسيء فهم السياق. تحقق دائمًا من المعلومات الهامة.',
      step1: 'اشتراك / تسجيل دخول',
      step1Desc: 'أنشئ حسابك المجاني لحفظ تقدمك',
      step2: 'اختر مستواك',
      step2Desc: 'صعوبة مبتدئ، متوسط، أو متقدم',
      step3: 'اختر الوضع',
      step3Desc: 'وضع الكتابة أو وضع الصوت',
      step4: 'ابدأ المناظرة',
      step4Desc: 'يقدم الذكاء الاصطناعي اعتراضًا، وتقوم بالرد',
      step5: 'احصل على ملاحظات',
      step5Desc: 'يقيم الذكاء الاصطناعي ويطرح الاعتراض التالي',
      step6: 'تتبع التقدم',
      step6Desc: 'النقاط، التاريخ، والمحادثات المحفوظة',
      copyrightText: 'لتدريب الدعوة لعلماء الأمة'
    }
  };
  const content = t[language];

  const features = [
    { icon: '🎯', title: content.purposeTitle, description: content.purposeDesc },
    { icon: '⚙️', title: content.howWorksTitle, description: content.howWorksDesc },
    { icon: '📖', title: content.howUseTitle, description: content.howUseDesc },
    { icon: '🤖', title: content.limitationsTitle, description: content.limitationsDesc }
  ];

  const steps = [
    { num: '01', title: content.step1, desc: content.step1Desc },
    { num: '02', title: content.step2, desc: content.step2Desc },
    { num: '03', title: content.step3, desc: content.step3Desc },
    { num: '04', title: content.step4, desc: content.step4Desc },
    { num: '05', title: content.step5, desc: content.step5Desc },
    { num: '06', title: content.step6, desc: content.step6Desc }
  ];

  const keyFeaturesList = [
    { icon: '🎤', title: 'Voice Mode', desc: 'Speak your answers naturally' },
    { icon: '⌨️', title: 'Type Mode', desc: 'Silent typing practice' },
    { icon: '🌍', title: 'Auto Language', desc: 'Urdu, Hindi, English, Arabic' },
    { icon: '📜', title: 'Debate History', desc: 'Save all conversations' },
    { icon: '🌙', title: 'Dark/Light Mode', desc: 'Easy on eyes' },
    { icon: '💾', title: 'Auto-Save', desc: 'Chat stays after page refresh' },
    { icon: '⌨️', title: 'Ctrl+K', desc: 'Quick commands' }
  ];

  // DARK BLACK BACKGROUND + WHITE TEXT
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',        // Pure dark black background
      fontFamily: language === 'ur' ? "'Noto Nastaliq Urdu', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" : (language === 'ar' ? "'Amiri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"),
      direction: language === 'ar' ? 'rtl' : 'ltr',
      color: '#ffffff'              // White text
    }}>
      
      {/* Header - Dark theme */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid #222222',
        padding: '12px 24px',
        direction: 'ltr'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px'
            }}>🎙️</div>
            <div>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>AI Debate Simulator</span>
              <div style={{ fontSize: '10px', color: '#10a37f', fontWeight: '500' }}>For Ulama e Ikram</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '4px', background: '#1a1a1a', borderRadius: '24px', padding: '4px' }}>
              <button onClick={() => setLanguage('en')} style={{
                background: language === 'en' ? '#333333' : 'transparent',
                color: language === 'en' ? '#ffffff' : '#aaaaaa',
                padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500'
              }}>English</button>
              <button onClick={() => setLanguage('ur')} style={{
                background: language === 'ur' ? '#333333' : 'transparent',
                color: language === 'ur' ? '#ffffff' : '#aaaaaa',
                padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500'
              }}>اردو</button>
              <button onClick={() => setLanguage('ar')} style={{
                background: language === 'ar' ? '#333333' : 'transparent',
                color: language === 'ar' ? '#ffffff' : '#aaaaaa',
                padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500'
              }}>العربية</button>
            </div>
            
            <button onClick={() => router.push('/login')} style={{
              background: 'transparent',
              border: '1px solid #444444',
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              {content.signIn}
            </button>
            
            <button onClick={() => router.push('/signup')} style={{
              background: '#10a37f',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '24px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1a7f64'; }}>
              {content.getStarted}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            width: '64px', height: '64px',
            background: '#1a1a1a',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', margin: '0 auto 24px'
          }}>🎙️</div>
          <h1 style={{
            fontSize: '44px', fontWeight: '700', margin: '0 0 16px',
            color: '#ffffff', letterSpacing: '-0.02em'
          }}>
            {content.title}
          </h1>
          <p style={{ fontSize: '18px', color: '#aaaaaa', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.5 }}>
            {content.subtitle}
          </p>
          <div style={{
            display: 'inline-block',
            background: '#1a1a1a',
            borderRadius: '20px',
            padding: '4px 16px',
            marginBottom: '32px'
          }}>
            <span style={{ fontSize: '13px', color: '#10a37f' }}>✨ {content.forUlama}</span>
          </div>
          <div>
            <button onClick={() => router.push('/signup')} style={{
              background: '#10a37f',
              color: 'white', padding: '12px 32px', borderRadius: '28px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1a7f64'; }}>
              🚀 {content.cta}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid - Dark cards */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600', textAlign: 'center', marginBottom: '48px', color: '#ffffff' }}>
          {content.whyTitle}
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              style={{
                backgroundColor: '#0a0a0a',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid #222222',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '44px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#ffffff' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#aaaaaa', lineHeight: 1.6, fontSize: '14px' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works - Steps */}
      <section style={{ padding: '60px 24px', backgroundColor: '#050505' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', textAlign: 'center', marginBottom: '16px', color: '#ffffff' }}>
            {content.howToUseTitle}
          </h2>
          <p style={{ textAlign: 'center', color: '#aaaaaa', marginBottom: '48px', fontSize: '15px' }}>
            {content.howToUseSub}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '20px',
                  backgroundColor: '#0a0a0a',
                  borderRadius: '16px', padding: '16px 24px',
                  border: '1px solid #222222'
                }}
              >
                <div style={{
                  width: '48px', height: '48px',
                  background: '#1a1a1a',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: '600', color: '#10a37f'
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px', color: '#ffffff' }}>
                    {step.title}
                  </h4>
                  <p style={{ color: '#aaaaaa', margin: 0, fontSize: '13px' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600', textAlign: 'center', marginBottom: '48px', color: '#ffffff' }}>
          {content.keyFeatures}
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px', textAlign: 'center'
        }}>
          {keyFeaturesList.map((feat, idx) => (
            <div key={idx} style={{
              backgroundColor: '#0a0a0a',
              borderRadius: '16px', padding: '20px 16px',
              border: '1px solid #222222',
              transition: 'all 0.2s'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{feat.icon}</div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#ffffff' }}>{feat.title}</h4>
              <p style={{ fontSize: '12px', color: '#aaaaaa' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Disclaimer - Dark theme */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          backgroundColor: '#1a0000',
          border: '1px solid #330000',
          borderRadius: '16px', padding: '20px 28px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>🤖</div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#ff6666' }}>
            ⚠️ {content.disclaimerTitle}
          </h3>
          <p style={{ color: '#ffaaaa', fontSize: '13px', lineHeight: 1.5 }}>
            {content.disclaimerText}<br />
            <strong>{content.disclaimerWarning}</strong><br />
            {content.disclaimerNote}
          </p>
        </div>
      </section>

      {/* Exclusive Note - Dark theme */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          background: '#0a1a0a',
          border: '1px solid #1a3a1a',
          borderRadius: '20px', padding: '32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎙️</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#4ade80' }}>
            مختص بعلمائے کرام
          </h3>
          <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '8px', color: '#10a37f' }}>
            {content.exclusiveTitle}
          </p>
          <p style={{ color: '#aaaaaa', fontSize: '14px', maxWidth: '500px', margin: '12px auto 0' }}>
            {content.exclusiveDesc}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{
          background: '#0a0a0a',
          borderRadius: '28px', padding: '48px 32px', maxWidth: '800px', margin: '0 auto',
          border: '1px solid #222222'
        }}>
          <h2 style={{ fontSize: '26px', fontWeight: '600', marginBottom: '12px', color: '#ffffff' }}>
            {content.readyTitle}
          </h2>
          <p style={{ color: '#aaaaaa', marginBottom: '32px', fontSize: '15px' }}>
            {content.readyDesc}
          </p>
          <button onClick={() => router.push('/signup')} style={{
            background: '#10a37f',
            color: 'white', padding: '12px 36px', borderRadius: '28px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '500'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1a7f64'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#10a37f'; }}>
            🚀 {content.readyCta}
          </button>
        </div>
      </section>

      {/* Footer - Dark */}
      <footer style={{
        padding: '24px 20px',
        textAlign: 'center',
        borderTop: '1px solid #222222',
        background: '#000000',
        marginTop: '40px',
        direction: 'ltr'
      }}>
        <p style={{ fontSize: '12px', color: '#888888', margin: '0 0 8px 0' }}>
          🎙️ AI Atheism Debate Simulator — {content.footer}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#888888' }}>Developed by</span>
          <span style={{ fontSize: '11px', fontWeight: '500', color: '#10a37f' }}>
           Azaan Mansuri
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#888888' }}>© 2026 — {content.copyrightText}</span>
        </div>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          background: '#0a0a0a',
          border: '1px solid #222222',
          borderRadius: '20px',
          padding: '4px 14px'
        }}>
          <span style={{ fontSize: '10px', color: '#888888' }}>Supervised by</span>
          <span style={{ fontSize: '10px', fontWeight: '600', color: '#10a37f' }}>
            Dr. Mufti Yasir Nadeem Al Wajidi
          </span>
        </div>
      </footer>
    </div>
  );
}