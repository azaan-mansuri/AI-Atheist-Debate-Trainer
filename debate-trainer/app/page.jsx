'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);

// ✅ Yeh bhi add karo
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);

  const t = {
    en: {
      // Header
      title: 'AI Atheism Debate Training Platform',
      subtitle: 'Train your reasoning, practice responses to atheistic objections, and improve your debate skills — with AI-powered feedback.',
      forUlama: 'Specially designed for Ulama e Ikram',
      cta: 'Start Free — For Scholars',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      aboutPlatform: 'About This Platform',
      
      // Why Section
      whyTitle: 'Why This Tool for Ulama e Ikram?',
      
      // Features
      features: [
        { icon: '🎯', title: 'Purpose', desc: 'To help Ulama e Ikram strengthen reasoning skills against atheistic arguments through structured debate practice.' },
        { icon: '⚙️', title: 'How It Works', desc: 'AI acts as an Atheist Simulator and Debate Coach. You respond, AI evaluates, gives feedback, and asks the next question.' },
        { icon: '📖', title: 'How to Use', desc: 'Select level → Choose mode → Start Debate → Answer → Get feedback → Improve' },
        { icon: '🤖', title: 'AI Limitations', desc: 'AI may make mistakes or give incomplete answers. Always verify critical information from authentic sources.' }
      ],
      
      // Detailed Steps
      detailedStepsTitle: 'Step-by-Step Guide',
      detailedSteps: [
        { step: '1', title: 'Create Account / Login', desc: 'Sign up for free using your email. All your debate history will be saved automatically.' },
        { step: '2', title: 'Choose Your Entry Mode', desc: 'Select "Individual Practice" for personal training or "Classroom Mode" to join a class with a code from your teacher.' },
        { step: '3', title: 'Select Debate Mode', desc: 'Choose from 4 modes: Debate (full two-way), Cross-Examination (AI asks questions), Learning (AI gives scores), or Mock Public (audience simulation).' },
        { step: '4', title: 'Pick an Atheist Persona', desc: 'Choose from 10+ atheist personas including New Atheist, Philosopher, Skeptic, Historian, Ex-Muslim Atheist, and more — each with unique debating style.' },
        { step: '5', title: 'Select Debate Topic', desc: '12 topics available: Problem of Evil, God\'s Existence, Prophethood, Quranic Preservation, Trinity vs Tawheed, Science & Religion, and more.' },
        { step: '6', title: 'Choose Difficulty Level', desc: 'Beginner, Intermediate, Advanced, or Expert — AI adjusts argument complexity accordingly.' },
        { step: '7', title: 'Select Language', desc: 'English, Urdu (اردو), or Arabic (العربية) — AI responds in your chosen language.' },
        { step: '8', title: 'Choose Input Method', desc: 'Type Mode (silent practice) or Voice Mode (continuous listening like Gemini — just speak naturally).' },
        { step: '9', title: 'Start Debating', desc: 'Click "Start Debate" → AI gives objection → You respond → AI provides feedback & score → Next question appears automatically.' },
        { step: '10', title: 'Review Your Performance', desc: 'After ending session, view AI Coach Analysis with best moments, areas to improve, and personalized study suggestions.' },
        { step: '11', title: 'Track Your Progress', desc: 'All debates saved in history. View past sessions, share via WhatsApp, download transcripts, or copy to clipboard.' },
        { step: '12', title: 'Classroom Features', desc: 'Teachers create classes with unique codes. Students join, practice debates, and teachers track progress with analytics.' }
      ],
      
      // Mode Details
      modesTitle: '4 Debate Modes Explained',
      modes: [
        { name: '🎯 Debate', desc: 'Full two-way debate. AI argues back at you with counter-arguments, challenges your points, and engages in deep philosophical discussion.' },
        { name: '❓ Cross-Examination', desc: 'AI only asks probing questions. You must defend your position thoroughly. Perfect for strengthening your argumentation skills.' },
        { name: '📚 Learning', desc: 'AI evaluates your answers and gives scores out of 10 with detailed feedback. Best for structured improvement.' },
        { name: '🎤 Mock Public', desc: 'AI acts as a live audience with tough questions, heckling, and real-world challenges. Simulates public debate pressure.' }
      ],
      
      // Persona Details
      personasTitle: 'Atheist Personas You Can Debate',
      personas: [
        { name: 'New Atheist', icon: '🤖', desc: 'Hitchens/Dawkins style — confrontational, soundbite-driven, treats religion as harmful.' },
        { name: 'Philosopher', icon: '🧠', desc: 'Analytic philosopher — logical arguments, syllogisms, metaphysical rigor.' },
        { name: 'Secular Feminist', icon: '⚡', desc: 'Focus on religious patriarchy, bodily autonomy, institutional critique.' },
        { name: 'Historian', icon: '📜', desc: 'Historical criticism, textual analysis, source criticism.' },
        { name: 'Scientific Materialist', icon: '🔬', desc: 'Empiricism, falsifiability, methodological naturalism.' },
        { name: 'Ex-Muslim Atheist', icon: '🕌', desc: 'Personal experience + theological critique. Insider perspective.' },
        { name: 'Rationalist', icon: '⚖️', desc: 'Reason, logic, argumentation. Focus on logical consistency.' },
        { name: 'Evolutionary Biologist', icon: '🧬', desc: 'Evolution, natural selection, intelligent design critique.' },
        { name: 'Secular Liberal', icon: '🗳️', desc: 'Political secularism, church-state separation, religious freedom.' },
        { name: 'Skeptic', icon: '🧪', desc: 'Agnostic-leaning, demands empirical evidence, focuses on burden of proof.' }
      ],
      
      // Topics Details
      topicsTitle: 'Debate Topics Available',
      topics: [
        { name: 'Problem of Evil', desc: 'Logical (Mackie), evidential (Rowe), soul-making (Hick), Islamic theodicy' },
        { name: 'God\'s Existence', desc: 'Cosmological, teleological, moral arguments. Contingency, design, morality.' },
        { name: 'Prophethood', desc: 'Prophethood, miracles, finality. Rationality of belief in prophets.' },
        { name: 'Quranic Preservation', desc: 'Textual criticism, oral tradition, manuscript evidence.' },
        { name: 'Trinity & Tawheed', desc: 'Monotheism vs. Trinity. Logical consistency, scriptural analysis.' },
        { name: 'Science & Religion', desc: 'Conflict thesis, compatibility, methodological naturalism.' }
      ],
      
      // Key Features
      keyFeatures: 'Key Features',
      keyFeaturesList: [
        { icon: '🎤', title: 'Voice Mode', desc: 'Continuous listening — speak naturally, no button pressing. Like talking to Gemini.' },
        { icon: '⌨️', title: 'Type Mode', desc: 'Silent typing practice with Enter key support.' },
        { icon: '🌍', title: '3 Languages', desc: 'English, Urdu, Arabic with auto-detection. AI responds in your language.' },
        { icon: '🎭', title: '10+ Personas', desc: 'Each persona has unique debating style, vocabulary, and arguments.' },
        { icon: '🏫', title: 'Classroom Mode', desc: 'Teachers create classes, students join with 8-character code. Track progress.' },
        { icon: '📊', title: 'AI Coach Analysis', desc: 'After each session, get personalized feedback: best moments, areas to improve, study suggestions.' },
        { icon: '💾', title: 'Auto-Save', desc: 'Chat history preserved after refresh. All debates saved to history.' },
        { icon: '🔗', title: 'Share & Export', desc: 'Share via WhatsApp, copy to clipboard, or download as text file.' },
        { icon: '📈', title: 'Progress Tracking', desc: 'Points system, debate history, and saved conversations for review.' },
        { icon: '🎙️', title: 'Continuous Voice', desc: 'One click to start, AI keeps listening. Send messages automatically when you pause.' }
      ],
      
      // Classroom Features
      classroomTitle: 'Classroom Mode for Teachers & Students',
      classroomFeatures: [
        { icon: '👨‍🏫', title: 'For Teachers', desc: 'Create unlimited classrooms, generate unique 8-character codes, view student progress, see average scores, track activity logs.' },
        { icon: '👩‍🎓', title: 'For Students', desc: 'Join with class code, practice debates independently, teacher sees your scores and progress. Two options: Classroom Debate (tracked) or Individual Practice (untracked).' },
        { icon: '📈', title: 'Analytics', desc: 'View student performance metrics, average scores per class, debate duration, most practiced topics, and individual student progress charts.' },
        { icon: '🔑', title: 'Class Code System', desc: 'Each classroom gets a unique 8-character code. Share with students — they join in one click. No complex setup required.' }
      ],
      
      // Disclaimers
      disclaimerTitle: 'AI Disclaimer',
      disclaimerText: 'This tool uses Artificial Intelligence. AI can make mistakes, provide incomplete answers, or misinterpret your responses.',
      disclaimerWarning: 'Always verify critical information from authentic Islamic sources and qualified scholars.',
      disclaimerNote: 'Use this tool as a training aid to practice debating skills, not as a source for fatwa or religious rulings.',
      
      // Exclusive Section
      exclusiveTitle: 'Exclusively for Honorable Scholars',
      exclusiveDesc: 'This platform is specifically designed for Ulama e Ikram to train against atheistic arguments in a structured, repeatable way.',
      
      // CTA
      readyTitle: 'Ready to Strengthen Your Reasoning?',
      readyDesc: 'Join as a scholar and start practicing debates with AI feedback. All features included — completely free.',
      readyCta: 'Get Started — For Ulama e Ikram',
      
      // Footer
      footer: 'A tool for training, not a substitute for authentic Islamic knowledge',
      supervisedBy: 'Supervised by',
      muftiName: 'Dr. Mufti Yasir Nadeem Al Wajdi',
      copyrightText: 'For Dawah training of Ulama e Ikram'
    },
    ur: {
      title: 'AI الحاد مباحثہ تربیتی پلیٹ فارم',
      subtitle: 'اپنی استدلال کو مضبوط کریں، الحادی اعتراضات کے جوابات کی مشق کریں، اور AI فیڈبیک کے ساتھ اپنی مباحثہ کی مہارتیں بہتر بنائیں۔',
      forUlama: 'مخصوص طور پر علمائے کرام کے لیے ڈیزائن کیا گیا',
      cta: 'مفت شروع کریں — علمائے کرام کے لیے',
      signIn: 'سائن ان',
      getStarted: 'شروع کریں',
      aboutPlatform: 'اس پلیٹ فارم کے بارے میں',
      
      // Why Section
      whyTitle: 'یہ ٹول علمائے کرام کے لیے کیوں؟',
      
      // Features
      features: [
        { icon: '🎯', title: 'مقصد', desc: 'علمائے کرام کو الحادی دلائل کے خلاف ان کی استدلال کی صلاحیتوں کو مضبوط کرنے میں مدد فراہم کرنا۔' },
        { icon: '⚙️', title: 'کیسے کام کرتا ہے', desc: 'AI ملحد سمیولیٹر اور ڈیبیٹ کوچ کا کردار ادا کرتا ہے۔' },
        { icon: '📖', title: 'استعمال کا طریقہ', desc: 'سطح منتخب کریں → موڈ منتخب کریں → مباحثہ شروع کریں → جواب دیں → فیڈبیک حاصل کریں' },
        { icon: '🤖', title: 'AI کی حدود', desc: 'AI غلطیاں کر سکتا ہے۔ ہمیشہ اہم معلومات کی تصدیق مستند ذرائع سے کریں۔' }
      ],
      
      // Detailed Steps
      detailedStepsTitle: 'مرحلہ وار رہنما',
      detailedSteps: [
        { step: '1', title: 'اکاؤنٹ بنائیں / لاگ ان کریں', desc: 'اپنے ای میل سے مفت سائن اپ کریں۔ آپ کی تمام مباحثہ ہسٹری خودکار طور پر محفوظ ہو جائے گی۔' },
        { step: '2', title: 'اپنا داخلہ موڈ منتخب کریں', desc: 'ذاتی تربیت کے لیے "انفرادی پریکٹس" یا استاد سے کوڈ لے کر کلاس روم میں شامل ہونے کے لیے "کلاس روم موڈ" منتخب کریں۔' },
        { step: '3', title: 'مباحثہ موڈ منتخب کریں', desc: '4 موڈز میں سے انتخاب کریں: ڈیبیٹ (دو طرفہ)، کراس ایگزامینیشن (AI سوالات پوچھتا ہے)، لرننگ (AI نمبر دیتا ہے)، یا ماک پبلک (سامعین کا کردار)' },
        { step: '4', title: 'الحادی شخصیت منتخب کریں', desc: '10+ الحادی شخصیات میں سے انتخاب کریں جیسے نیا ملحد، فلسفی، شکی، مورخ، سابق مسلمان ملحد — ہر ایک کا اپنا انداز ہے۔' },
        { step: '5', title: 'موضوع منتخب کریں', desc: '12 موضوعات دستیاب ہیں: شر کا مسئلہ، خدا کا وجود، نبوت، قرآنی تحفظ، تثلیث و توحید، سائنس و مذہب، وغیرہ' },
        { step: '6', title: 'مشکل کی سطح منتخب کریں', desc: 'شروع، انٹرمیڈیٹ، ایڈوانسڈ، یا ماہر — AI آپ کی سطح کے مطابق دلائل دیتا ہے۔' },
        { step: '7', title: 'زبان منتخب کریں', desc: 'انگریزی، اردو، یا عربی — AI آپ کی زبان میں جواب دیتا ہے۔' },
        { step: '8', title: 'ان پٹ طریقہ منتخب کریں', desc: 'ٹائپ موڈ (خاموش مشق) یا وائس موڈ (مسلسل سننا — قدرتی گفتگو)' },
        { step: '9', title: 'مباحثہ شروع کریں', desc: '"مباحثہ شروع کریں" پر کلک کریں → AI اعتراض پیش کرتا ہے → آپ جواب دیتے ہیں → AI فیڈبیک اور نمبر دیتا ہے → اگلا سوال خودکار' },
        { step: '10', title: 'اپنی کارکردگی کا جائزہ لیں', desc: 'سیشن ختم کرنے کے بعد، AI کوچ تجزیہ دیکھیں — بہترین لمحات، بہتری کے شعبے، اور ذاتی مطالعہ تجاویز' },
        { step: '11', title: 'اپنی پیشرفت ٹریک کریں', desc: 'تمام مباحثے ہسٹری میں محفوظ۔ پچھلے سیشن دیکھیں، واٹس ایپ پر شیئر کریں، نقل ڈاؤن لوڈ کریں' },
        { step: '12', title: 'کلاس روم فیچرز', desc: 'اساتذہ کلاسز بناتے ہیں، طلبہ کوڈ سے جوائن کرتے ہیں، اور اساتذہ پیشرفت ٹریک کرتے ہیں۔' }
      ],
      
      // Mode Details
      modesTitle: '4 مباحثہ موڈز کی تفصیل',
      modes: [
        { name: '🎯 مباحثہ', desc: 'مکمل دو طرفہ مباحثہ۔ AI آپ کے خلاف دلائل دیتا ہے، آپ کے نکات کو چیلنج کرتا ہے۔' },
        { name: '❓ جرح', desc: 'AI صرف سوالات پوچھتا ہے۔ آپ کو اپنی پوزیشن کا دفاع کرنا ہوتا ہے۔' },
        { name: '📚 سیکھنا', desc: 'AI آپ کے جوابات کا جائزہ لیتا ہے اور 10 میں سے نمبر دیتا ہے۔' },
        { name: '🎤 عوامی مباحثہ', desc: 'AI لائیو سامعین کا کردار ادا کرتا ہے — مشکل سوالات، اور حقیقی چیلنجز۔' }
      ],
      
      // Persona Details
      personasTitle: 'الحادی شخصیات',
      personas: [
        { name: 'نیا ملحد', icon: '🤖', desc: 'ہچنز/ڈاکنز طرز — جھڑپوں والا، شارٹ بائٹس' },
        { name: 'فلسفی', icon: '🧠', desc: 'تجزیاتی فلسفی — منطقی دلائل، سیلوجزم' },
        { name: 'سیکولر فیمنسٹ', icon: '⚡', desc: 'مذہبی پدرانہ نظام پر توجہ' },
        { name: 'مورخ', icon: '📜', desc: 'تاریخی تنقید، متنی تجزیہ' },
        { name: 'سائنسی مادیت پرست', icon: '🔬', desc: 'تجربیت، falsifiability' },
        { name: 'سابق مسلمان ملحد', icon: '🕌', desc: 'ذاتی تجربہ + علمی تنقید' }
      ],
      
      // Topics Details
      topicsTitle: 'مباحثہ کے موضوعات',
      topics: [
        { name: 'شر کا مسئلہ', desc: 'منطقی، evidential، soul-making، اسلامی تھیوڈیسی' },
        { name: 'خدا کا وجود', desc: 'کونیاتی، ٹیلیولوجیکل، اخلاقی دلائل' },
        { name: 'نبوت', desc: 'نبوت، معجزات، ختم نبوت' },
        { name: 'قرآنی تحفظ', desc: 'متنی تنقید، زبانی روایت، مخطوطات' },
        { name: 'تثلیث و توحید', desc: 'توحید بمقابلہ تثلیث۔ منطقی استواری' },
        { name: 'سائنس و مذہب', desc: 'تضاد کا نظریہ، مطابقت' }
      ],
      
      // Key Features
      keyFeatures: 'اہم خصوصیات',
      keyFeaturesList: [
        { icon: '🎤', title: 'وائس موڈ', desc: 'مسلسل سننا — قدرتی گفتگو' },
        { icon: '⌨️', title: 'ٹائپ موڈ', desc: 'خاموش ٹائپنگ مشق' },
        { icon: '🌍', title: '3 زبانیں', desc: 'انگریزی، اردو، عربی' },
        { icon: '🎭', title: '10+ شخصیات', desc: 'ہر شخصیت کا اپنا انداز' },
        { icon: '🏫', title: 'کلاس روم موڈ', desc: 'اساتذہ کلاسز، طلبہ کوڈ سے جوائن' },
        { icon: '📊', title: 'AI کوچ تجزیہ', desc: 'ذاتی نوعیت کی تجاویز' },
        { icon: '💾', title: 'آٹو سیو', desc: 'چیٹ ہسٹری محفوظ' },
        { icon: '🔗', title: 'شیئر کریں', desc: 'واٹس ایپ، کاپی، ڈاؤن لوڈ' }
      ],
      
      // Classroom Features
      classroomTitle: 'اساتذہ اور طلبہ کے لیے کلاس روم موڈ',
      classroomFeatures: [
        { icon: '👨‍🏫', title: 'اساتذہ کے لیے', desc: 'لامحدود کلاسز، منفرد 8 حرفی کوڈ، طلبہ کی پیشرفت دیکھیں' },
        { icon: '👩‍🎓', title: 'طلبہ کے لیے', desc: 'کلاس کوڈ سے جوائن کریں، اساتذہ آپ کی پیشرفت دیکھ سکتے ہیں' },
        { icon: '📈', title: 'تجزیہ', desc: 'طلبہ کی کارکردگی، اوسط اسکورز، سرگرمی لاگز' },
        { icon: '🔑', title: 'کلاس کوڈ سسٹم', desc: 'ہر کلاس کا منفرد 8 حرفی کوڈ — ایک کلک میں جوائن' }
      ],
      
      // Disclaimers
      disclaimerTitle: 'AI انتباہ',
      disclaimerText: 'یہ ٹول مصنوعی ذہانت استعمال کرتا ہے۔ AI غلطیاں کر سکتا ہے۔',
      disclaimerWarning: 'ہمیشہ اہم معلومات کی تصدیق مستند ذرائع سے کریں۔',
      disclaimerNote: 'اس ٹول کو تربیتی معاون کے طور پر استعمال کریں، فتویٰ کے ذریعہ کے طور پر نہیں۔',
      
      // Exclusive Section
      exclusiveTitle: 'مخصوص طور پر علمائے کرام کے لیے',
      exclusiveDesc: 'یہ پلیٹ فارم خاص طور پر علمائے کرام کو الحادی دلائل کے خلاف تربیت دینے کے لیے ڈیزائن کیا گیا ہے۔',
      
      // CTA
      readyTitle: 'اپنی استدلال کو مضبوط کرنے کے لیے تیار ہیں؟',
      readyDesc: 'بطور عالم شامل ہوں اور AI فیڈبیک کے ساتھ مباحثوں کی مشق شروع کریں',
      readyCta: 'شروع کریں — علمائے کرام کے لیے',
      
      // Footer
      footer: 'تربیت کے لیے ایک ٹول، مستند اسلامی علم کا متبادل نہیں',
      supervisedBy: 'نگرانی',
      muftiName: 'ڈاکٹر مفتی یاسر ندیم الواجدی',
      copyrightText: 'علمائے کرام کی دعوتی تربیت کے لیے'
    },
    ar: {
      title: 'منصة تدريب مناظرة الإلحاد بالذكاء الاصطناعي',
      subtitle: 'عزز تفكيرك، تدرب على الرد على الاعتراضات الإلحادية، وحسن مهاراتك في المناظرة مع ردود فعل مدعومة بالذكاء الاصطناعي.',
      forUlama: 'صمم خصيصًا لعلماء الأمة',
      cta: 'ابدأ مجانًا — للعلماء',
      signIn: 'تسجيل الدخول',
      getStarted: 'ابدأ الآن',
      aboutPlatform: 'حول هذه المنصة',
      
      // Why Section
      whyTitle: 'لماذا هذه الأداة لعلماء الأمة؟',
      
      // Features
      features: [
        { icon: '🎯', title: 'الغرض', desc: 'لمساعدة علماء الأمة على تعزيز مهاراتهم في الرد على الشبهات الإلحادية.' },
        { icon: '⚙️', title: 'كيف تعمل', desc: 'يعمل الذكاء الاصطناعي كمحاكي إلحادي ومدرب مناظرة.' },
        { icon: '📖', title: 'طريقة الاستخدام', desc: 'اختر مستواك → اختر الوضع → ابدأ المناظرة → أجب → احصل على ملاحظات' },
        { icon: '🤖', title: 'حدود الذكاء الاصطناعي', desc: 'قد يخطئ الذكاء الاصطناعي. تحقق دائمًا من المعلومات الهامة من مصادر موثوقة.' }
      ],
      
      // Detailed Steps
      detailedStepsTitle: 'دليل خطوة بخطوة',
      detailedSteps: [
        { step: '1', title: 'إنشاء حساب / تسجيل دخول', desc: 'سجل مجانًا باستخدام بريدك الإلكتروني. سيتم حفظ تاريخ مناظراتك تلقائيًا.' },
        { step: '2', title: 'اختر وضع الدخول الخاص بك', desc: 'اختر "ممارسة فردية" للتدريب الشخصي أو "وضع الفصل الدراسي" للانضمام إلى فصل برمز من معلمك.' },
        { step: '3', title: 'اختر وضع المناظرة', desc: 'اختر من 4 أوضاع: مناظرة (ثنائية الاتجاه)، استجواب (AI يطرح أسئلة)، تعلم (AI يعطي درجات)، أو جمهور وهمي (محاكاة الجمهور).' },
        { step: '4', title: 'اختر شخصية إلحادية', desc: 'اختر من 10+ شخصيات إلحادية بما في ذلك ملحد جديد، فيلسوف، مشكك، مؤرخ، ملحد سابق مسلم — كل بأسلوبه الخاص.' },
        { step: '5', title: 'اختر موضوع المناظرة', desc: '12 موضوعًا متاحًا: مشكلة الشر، وجود الله، النبوة، حفظ القرآن، الثالوث والتوحيد، العلم والدين، والمزيد.' },
        { step: '6', title: 'اختر مستوى الصعوبة', desc: 'مبتدئ، متوسط، متقدم، أو خبير — يضبط AI تعقيد الحجج وفقًا لذلك.' },
        { step: '7', title: 'اختر اللغة', desc: 'الإنجليزية، الأردية، أو العربية — يجيب AI بلغتك المختارة.' },
        { step: '8', title: 'اختر طريقة الإدخال', desc: 'وضع الكتابة (ممارسة صامتة) أو وضع الصوت (استماع مستمر — تحدث بشكل طبيعي).' },
        { step: '9', title: 'ابدأ المناظرة', desc: 'انقر "ابدأ المناظرة" → يقدم AI اعتراضًا → ترد → يقدم AI ملاحظات ودرجة → يظهر السؤال التالي تلقائيًا.' },
        { step: '10', title: 'راجع أدائك', desc: 'بعد إنهاء الجلسة، شاهد تحليل المدرب الذكي مع أفضل اللحظات، مجالات التحسين، واقتراحات الدراسة الشخصية.' },
        { step: '11', title: 'تتبع تقدمك', desc: 'جميع المناظرات محفوظة في السجل. شاهد الجلسات السابقة، شارك عبر واتساب، حمل النصوص، أو انسخ إلى الحافظة.' },
        { step: '12', title: 'ميزات الفصل الدراسي', desc: 'ينشئ المعلمون فصولاً برموز فريدة. ينضم الطلاب، ويتدربون على المناظرات، ويتتبع المعلمون التقدم بالتحليلات.' }
      ],
      
      // Mode Details
      modesTitle: 'شرح أوضاع المناظرة الأربعة',
      modes: [
        { name: '🎯 مناظرة', desc: 'مناظرة كاملة ثنائية الاتجاه. يجادلك AI بالحجج المضادة ويتحدى نقاطك.' },
        { name: '❓ استجواب', desc: 'يطرح AI أسئلة استقصائية فقط. يجب أن تدافع عن موقفك بدقة.' },
        { name: '📚 تعلم', desc: 'يقيم AI إجاباتك ويعطي درجات من 10 مع ملاحظات مفصلة.' },
        { name: '🎤 جمهور وهمي', desc: 'يعمل AI كجمهور مباشر بأسئلة صعبة وتحديات واقعية.' }
      ],
      
      // Persona Details
      personasTitle: 'الشخصيات الإلحادية',
      personas: [
        { name: 'ملحد جديد', icon: '🤖', desc: 'أسلوب هيتشنز/دوكينز — مواجه، يركز على الضرر الاجتماعي' },
        { name: 'فيلسوف', icon: '🧠', desc: 'فيلسوف تحليلي — حجج منطقية، قياسات منطقية' },
        { name: 'نسوية علمانية', icon: '⚡', desc: 'تركز على الأبوية الدينية، الاستقلال الجسدي' },
        { name: 'مؤرخ', icon: '📜', desc: 'نقد تاريخي، تحليل نصي' },
        { name: 'مادي علمي', icon: '🔬', desc: 'تجريبية، قابلية الدحض' },
        { name: 'ملحد مسلم سابق', icon: '🕌', desc: 'تجربة شخصية + نقد لاهوتي' }
      ],
      
      // Topics Details
      topicsTitle: 'موضوعات المناظرة',
      topics: [
        { name: 'مشكلة الشر', desc: 'منطقي (ماكي)، استدلالي (رو)، صنع النفس (هيك)' },
        { name: 'وجود الله', desc: 'الحجج الكونية، الغائية، الأخلاقية' },
        { name: 'النبوة', desc: 'النبوة، المعجزات، الخاتمية' },
        { name: 'حفظ القرآن', desc: 'النقد النصي، التقليد الشفهي، أدلة المخطوطات' },
        { name: 'الثالوث والتوحيد', desc: 'التوحيد مقابل الثالوث. الاتساق المنطقي' },
        { name: 'العلم والدين', desc: 'نظرية الصراع، التوافق، الطبيعية المنهجية' }
      ],
      
      // Key Features
      keyFeatures: 'الميزات الرئيسية',
      keyFeaturesList: [
        { icon: '🎤', title: 'وضع الصوت', desc: 'استماع مستمر — تحدث بشكل طبيعي' },
        { icon: '⌨️', title: 'وضع الكتابة', desc: 'ممارسة الكتابة الصامتة' },
        { icon: '🌍', title: '3 لغات', desc: 'الإنجليزية، الأردية، العربية' },
        { icon: '🎭', title: '10+ شخصيات', desc: 'لكل شخصية أسلوبها الخاص' },
        { icon: '🏫', title: 'وضع الفصل الدراسي', desc: 'المعلمون ينشئون الفصول، الطلاب ينضمون برمز' },
        { icon: '📊', title: 'تحليل المدرب الذكي', desc: 'ملاحظات شخصية' },
        { icon: '💾', title: 'حفظ تلقائي', desc: 'المحادثات محفوظة' },
        { icon: '🔗', title: 'مشاركة', desc: 'واتساب، نسخ، تحميل' }
      ],
      
      // Classroom Features
      classroomTitle: 'وضع الفصل الدراسي للمعلمين والطلاب',
      classroomFeatures: [
        { icon: '👨‍🏫', title: 'للمعلمين', desc: 'فصول غير محدودة، رمز فريد مكون من 8 أحرف، تتبع تقدم الطلاب' },
        { icon: '👩‍🎓', title: 'للطلاب', desc: 'انضم برمز الفصل، يمكن للمعلمين رؤية تقدمك' },
        { icon: '📈', title: 'تحليلات', desc: 'أداء الطلاب، متوسط الدرجات، سجلات النشاط' },
        { icon: '🔑', title: 'نظام رمز الفصل', desc: 'رمز فريد مكون من 8 أحرف لكل فصل — انضم بنقرة واحدة' }
      ],
      
      // Disclaimers
      disclaimerTitle: 'تنبيه الذكاء الاصطناعي',
      disclaimerText: 'هذه الأداة تستخدم الذكاء الاصطناعي. قد يخطئ الذكاء الاصطناعي.',
      disclaimerWarning: 'تحقق دائمًا من المعلومات الهامة من مصادر موثوقة.',
      disclaimerNote: 'استخدم هذه الأداة كمساعدة تدريبية، وليس كمصدر للفتوى.',
      
      // Exclusive Section
      exclusiveTitle: 'حصريًا للعلماء',
      exclusiveDesc: 'هذه المنصة صممت خصيصًا لعلماء الأمة للتدرب على الرد على الشبهات الإلحادية.',
      
      // CTA
      readyTitle: 'هل أنت مستعد لتقوية تفكيرك؟',
      readyDesc: 'انضم كعالم وابدأ ممارسة المناظرات مع ردود فعل الذكاء الاصطناعي',
      readyCta: 'ابدأ الآن — للعلماء',
      
      // Footer
      footer: 'أداة للتدريب، وليست بديلاً عن المعرفة الإسلامية الأصيلة',
      supervisedBy: 'بإشراف',
      muftiName: 'الدكتور المفتي ياسر نديم الوجدي',
      copyrightText: 'لتدريب الدعوة لعلماء الأمة'
    }
  };

  const content = t[language];

  return (
    <div style={{
      minHeight: '100vh',
       background: theme === 'dark' ? '#000000' : '#f5f5f5',
      fontFamily: language === 'ur' ? "'Noto Nastaliq Urdu', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" : (language === 'ar' ? "'Amiri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"),
      direction: language === 'ar' ? 'rtl' : 'ltr',
      color: theme === 'dark' ? '#ffffff' : '#111111'
    }}>
      
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
       backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
borderBottom: `1px solid ${theme === 'dark' ? '#222222' : '#dddddd'}`,
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
              <span style={{ fontSize: '16px', fontWeight: '600', color: theme === 'dark' ? '#ffffff' : '#111111' }}>AI Atheism Debate Training Platform</span>
              <div style={{ fontSize: '10px', color: '#10a37f', fontWeight: '500' }}>For Ulama e Ikram</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
           <div style={{ display: 'flex', gap: '4px', background: theme === 'dark' ? '#1a1a1a' : '#e5e5e5', borderRadius: '24px', padding: '4px' }}>
              <button onClick={() => setLanguage('en')} style={{
               background: language === 'en' ? (theme === 'dark' ? '#333333' : '#cccccc') : 'transparent',
color: language === 'en' ? (theme === 'dark' ? '#ffffff' : '#111111') : (theme === 'dark' ? '#aaaaaa' : '#666666'),
                padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500'
              }}>English</button>
              <button onClick={() => setLanguage('ur')} style={{
               background: language === 'ur' ? (theme === 'dark' ? '#333333' : '#cccccc') : 'transparent',
color: language === 'ur' ? (theme === 'dark' ? '#ffffff' : '#111111') : (theme === 'dark' ? '#aaaaaa' : '#666666'),
                padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500'
              }}>اردو</button>
              <button onClick={() => setLanguage('ar')} style={{
               background: language === 'ar' ? (theme === 'dark' ? '#333333' : '#cccccc') : 'transparent',
color: language === 'ar' ? (theme === 'dark' ? '#ffffff' : '#111111') : (theme === 'dark' ? '#aaaaaa' : '#666666'),
                padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500'
              }}>العربية</button>
            </div>

            {/* Theme Toggle Button */}
<button 
  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
  style={{
    background: 'transparent',
    border: '1px solid #444444',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
>
  {theme === 'dark' ? '☀️' : '🌙'}
</button>
            
            <button onClick={() => router.push('/login')} style={{
              background: 'transparent',
             border: `1px solid ${theme === 'dark' ? '#444444' : '#cccccc'}`,
color: theme === 'dark' ? '#ffffff' : '#111111',
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
            
            <button 
              onClick={() => router.push('/signup')} 
              style={{
                background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '24px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
              {content.getStarted}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
<section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.6 }}
  >
    <div style={{
      width: '80px', height: '80px',
      background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
      borderRadius: '20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '40px', margin: '0 auto 24px',
      boxShadow: '0 8px 32px rgba(16,163,127,0.3)'
    }}>🎙️</div>
    
    <h1 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 16px',color: theme === 'dark' ? '#ffffff' : '#111111', letterSpacing: '-0.02em' }}>
      {content.title}
    </h1>
    
    <p style={{ fontSize: '18px',color: theme === 'dark' ? '#aaaaaa' : '#555555', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.6 }}>
      {content.subtitle}
    </p>
    
    <div style={{ display: 'inline-block', background: '#10a37f20', borderRadius: '20px', padding: '4px 16px', marginBottom: '32px', border: '1px solid #10a37f40' }}>
      <span style={{ fontSize: '13px', color: '#10a37f' }}>✨ {content.forUlama}</span>
    </div>
    
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {/* CTA Button */}
      <motion.button 
        whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(16,163,127,0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/signup')} 
        style={{
          background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
          color: 'white',
          padding: '16px 44px',
          borderRadius: '32px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: '0 8px 30px rgba(16,163,127,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        🚀 {content.cta}
      </motion.button>
      
      {/* 🔥 About Button - Premium Version */}
      <motion.button 
        whileHover={{ 
          scale: 1.05, 
          boxShadow: '0 0 50px rgba(16,163,127,0.3), inset 0 0 50px rgba(16,163,127,0.03)',
          borderColor: '#10a37f'
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/about')}
        style={{
          background: 'linear-gradient(135deg, rgba(16,163,127,0.1), rgba(16,163,127,0.02))',
          border: '2px solid rgba(16,163,127,0.25)',
          color: '#ffffff',
          padding: '16px 44px',
          borderRadius: '32px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          letterSpacing: '0.3px',
          boxShadow: '0 0 30px rgba(16,163,127,0.03)'
        }}
      >
        {/* Animated Border Glow */}
        <div style={{
          position: 'absolute',
          inset: '-2px',
          background: 'linear-gradient(135deg, #10a37f, transparent, #10a37f)',
          borderRadius: '32px',
          opacity: 0.3,
          zIndex: 0,
          animation: 'borderGlow 3s ease-in-out infinite'
        }} />
        
        {/* Shimmer Effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          transform: 'translateX(-100%)',
          animation: 'shimmer 4s ease-in-out infinite',
          zIndex: 1
        }} />
        
        <span style={{ position: 'relative', zIndex: 2, fontSize: '20px' }}>📖</span>
        
        <span style={{ position: 'relative', zIndex: 2 }}>
          {content.aboutPlatform}
        </span>
        
        <motion.span 
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative', zIndex: 2, fontSize: '18px' }}
        >
          →
        </motion.span>
        
        {/* Pulse Dot */}
        <span style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',
          background: '#10a37f',
          borderRadius: '50%',
          animation: 'pulse 2s ease-in-out infinite',
          zIndex: 2
        }} />
      </motion.button>
    </div>
  </motion.div>
</section>

      {/* Detailed Step-by-Step Guide - Most Important Section */}
      <section style={{ padding: '60px 24px', backgroundColor: theme === 'dark' ? '#050505' : '#f0f0f0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
         <h2 style={{ fontSize: '28px', fontWeight: '600', textAlign: 'center', marginBottom: '16px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>
            📖 {content.detailedStepsTitle}
          </h2>
          <p style={{ textAlign: 'center', color: '#10a37f', marginBottom: '48px', fontSize: '14px' }}>
            Follow these steps to get started
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {content.detailedSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                viewport={{ once: true }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                 backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
border: `1px solid ${theme === 'dark' ? '#222222' : '#dddddd'}`,
                  padding: '20px 24px',
                  border: '1px solid #222222',
                  transition: 'all 0.2s ease'
                }}
                whileHover={{ borderColor: '#10a37f40', x: 4 }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#10a37f20',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#10a37f',
                  flexShrink: 0
                }}>
                  {step.step}
                </div>
                <div style={{ flex: 1 }}>
                 <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>{step.title}</h4>
<p style={{ color: theme === 'dark' ? '#aaaaaa' : '#555555', margin: 0, fontSize: '13px', lineHeight: 1.5 }}>{step.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Debate Modes Section */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
       <h2 style={{ fontSize: '28px', fontWeight: '600', textAlign: 'center', marginBottom: '48px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>
  {content.modesTitle}
</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {content.modes.map((mode, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
             style={{ backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff', borderRadius: '20px', padding: '28px', border: `1px solid ${theme === 'dark' ? '#222222' : '#dddddd'}` }}
            >
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{mode.name.split(' ')[0]}</div>
             <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>{mode.name}</h3>
<p style={{ color: theme === 'dark' ? '#aaaaaa' : '#555555', lineHeight: 1.6, fontSize: '14px' }}>{mode.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Personas Grid */}
     <section style={{ padding: '60px 24px', backgroundColor: theme === 'dark' ? '#050505' : '#f0f0f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
         <h2 style={{ fontSize: '28px', fontWeight: '600', textAlign: 'center', marginBottom: '16px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>
            🎭 {content.personasTitle}
          </h2>
         <p style={{ textAlign: 'center', color: theme === 'dark' ? '#aaaaaa' : '#555555', marginBottom: '48px', fontSize: '14px' }}>
            Each persona has a unique debating style
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {content.personas.map((persona, idx) => (
              <div key={idx} 
             style={{ backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff', borderRadius: '16px', padding: '16px', border: `1px solid ${theme === 'dark' ? '#222222' : '#dddddd'}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '28px' }}>{persona.icon}</div>
                <div>
                 <div style={{ fontSize: '14px', fontWeight: '600', color: theme === 'dark' ? '#ffffff' : '#111111' }}>{persona.name}</div>
<div style={{ fontSize: '11px', color: theme === 'dark' ? '#888888' : '#555555' }}>{persona.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
       <h2 style={{ fontSize: '28px', fontWeight: '600', textAlign: 'center', marginBottom: '48px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>
          📚 {content.topicsTitle}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {content.topics.map((topic, idx) => (
            <div key={idx} style={{ backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff', borderRadius: '16px', padding: '20px', border: `1px solid ${theme === 'dark' ? '#222222' : '#dddddd'}` }}>
              <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#10a37f' }}>{topic.name}</h4>
             <p style={{ fontSize: '12px', color: theme === 'dark' ? '#888888' : '#555555', margin: 0, lineHeight: 1.5 }}>{topic.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section style={{ padding: '60px 24px', backgroundColor: theme === 'dark' ? '#050505' : '#f0f0f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', textAlign: 'center', marginBottom: '48px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>
            ⚡ {content.keyFeatures}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
            {content.keyFeaturesList.map((feat, idx) => (
              <div key={idx}style={{ backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff', borderRadius: '16px', padding: '20px 16px', border: `1px solid ${theme === 'dark' ? '#222222' : '#dddddd'}`, transition: 'all 0.2s' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{feat.icon}</div>
               <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>{feat.title}</h4>
<p style={{ fontSize: '12px', color: theme === 'dark' ? '#aaaaaa' : '#555555' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classroom Mode Section */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
         <h2 style={{ fontSize: '28px', fontWeight: '600', textAlign: 'center', marginBottom: '16px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>
            🏫 {content.classroomTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
            {content.classroomFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              style={{ backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff', borderRadius: '20px', padding: '28px', border: `1px solid ${theme === 'dark' ? '#222222' : '#dddddd'}`, textAlign: 'center' }}
              >
                <div style={{ fontSize: '44px', marginBottom: '16px' }}>{feature.icon}</div>
               <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>{feature.title}</h3>
<p style={{ color: theme === 'dark' ? '#aaaaaa' : '#555555', lineHeight: 1.6, fontSize: '13px' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Disclaimer */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#1a0000', border: '1px solid #330000', borderRadius: '16px', padding: '20px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>🤖</div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#ff6666' }}>⚠️ {content.disclaimerTitle}</h3>
          <p style={{ color: '#ffaaaa', fontSize: '13px', lineHeight: 1.5 }}>
            {content.disclaimerText}<br />
            <strong>{content.disclaimerWarning}</strong><br />
            {content.disclaimerNote}
          </p>
        </div>
      </section>

      {/* Exclusive Note */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto',background: theme === 'dark' ? '#0a1a0a' : '#e8f5e8',
border: `1px solid ${theme === 'dark' ? '#1a3a1a' : '#b8d8b8'}`, borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎙️</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#4ade80' }}>{content.exclusiveTitle}</h3>
          <p style={{ color: theme === 'dark' ? '#aaaaaa' : '#555555', fontSize: '14px', maxWidth: '500px', margin: '12px auto 0' }}>{content.exclusiveDesc}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
       <div style={{ background: theme === 'dark' ? '#0a0a0a' : '#ffffff', borderRadius: '28px', padding: '48px 32px', maxWidth: '800px', margin: '0 auto', border: `1px solid ${theme === 'dark' ? '#222222' : '#dddddd'}` }}>
  <h2 style={{ fontSize: '26px', fontWeight: '600', marginBottom: '12px', color: theme === 'dark' ? '#ffffff' : '#111111' }}>{content.readyTitle}</h2>
  <p style={{ color: theme === 'dark' ? '#aaaaaa' : '#555555', marginBottom: '32px', fontSize: '15px' }}>{content.readyDesc}</p> <button onClick={() => router.push('/signup')} style={{
            background: 'linear-gradient(135deg, #10a37f, #1a7f64)', 
            color: 'white', 
            padding: '12px 36px', 
            borderRadius: '28px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '15px', 
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
            🚀 {content.readyCta}
          </button>
        </div>
      </section>

     <style>{`
        @keyframes borderGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: translateY(-50%) scale(1);
          }
          50% { 
            opacity: 1;
            transform: translateY(-50%) scale(1.3);
            box-shadow: 0 0 20px rgba(16,163,127,0.5);
          }
        }
      `}</style>

    </div>  //
  );
}