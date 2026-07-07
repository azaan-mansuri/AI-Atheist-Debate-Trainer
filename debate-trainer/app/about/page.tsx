'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [openFaq, setOpenFaq] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const t = {
    en: {
      pageTitle: 'About This Platform',
      back: '← Back',
      
      missionTitle: 'Our Mission',
      missionDesc: 'To provide scholars and students of knowledge with a structured, repeatable, and effective training platform to strengthen their reasoning skills against atheistic objections. Through consistent practice with diverse atheist personas and challenging topics, scholars can refine their arguments and respond with confidence in Dawah settings.',
      
      visionTitle: 'Our Vision',
      visionDesc: 'A world where every scholar and student of knowledge has access to advanced AI training tools, enabling them to confidently respond to atheistic objections and strengthen Islamic Dawah globally. We envision a future where Islamic scholarship is empowered by technology, not threatened by it.',
      
      whyTitle: 'Why We Built This',
      whyDesc: 'In today\'s digital age, atheistic arguments are spreading rapidly through social media, YouTube, and online forums. Ulama e Ikram need a safe, accessible, and effective way to practice and refine their responses. This platform was built to address the growing need for structured debate training that is available 24/7, judgment-free, and powered by cutting-edge AI technology.',
      
      expertTitle: 'How to Become an Expert',
      expertSteps: [
        'Practice Daily — 15-20 minutes of consistent practice',
        'Try All Personas — Each persona has unique arguments; master them all',
        'Review AI Coach Analysis — Learn from your mistakes',
        'Increase Difficulty — Start Beginner → Progress to Expert',
        'Use Voice Mode — Simulate real debates by speaking naturally',
        'Study Suggested Resources — Follow AI recommendations for deeper learning',
        'Track Your Progress — Watch your scores improve over time'
      ],
      
      whoTitle: 'Who Is This For?',
      whoItems: [
        { icon: '🎓', title: 'Ulama e Ikram', desc: 'Practice responding to atheistic objections in a safe, structured environment' },
        { icon: '👨‍🏫', title: 'Teachers & Madrasas', desc: 'Create classrooms, assign debates, and track student progress' },
        { icon: '📚', title: 'Students of Knowledge', desc: 'Build confidence in Dawah through structured AI-powered practice' },
        { icon: '🌍', title: 'Dawah Organizations', desc: 'Train volunteers and speakers systematically at scale' }
      ],
      
      statsTitle: 'Platform Stats',
      stats: [
        { number: '10+', label: 'Atheist Personas' },
        { number: '12', label: 'Debate Topics' },
        { number: '4', label: 'Debate Modes' },
        { number: '3', label: 'Languages Supported' },
        { number: '∞', label: 'Unlimited Practice' },
        { number: '📈', label: 'Growing Community' }
      ],
      
      worksTitle: 'How It Works',
      worksSteps: [
        'Create Account / Login',
        'Choose Individual Practice or Classroom Mode',
        'Select Mode, Persona, Topic & Difficulty',
        'Choose Language & Input Method (Type / Voice)',
        'Click "Start Debate" → AI gives objection',
        'You respond → AI gives feedback & score',
        'End session → View AI Coach Analysis'
      ],
      
      disclaimerTitle: 'AI Disclaimer',
      disclaimerText: 'This platform uses Artificial Intelligence. AI can make mistakes, provide incomplete answers, or misinterpret your responses.',
      disclaimerWarning: 'Always verify critical information from authentic Islamic sources and qualified scholars.',
      disclaimerNote: 'Use this tool as a training aid to practice debating skills, not as a source for fatwa or religious rulings.',
      
      benefitsTitle: 'Benefits of Using This Platform',
      benefits: [
        { icon: '🕌', title: 'For Ulama e Ikram', desc: 'Practice anytime, anywhere. Safe environment to make mistakes and learn. Build confidence before real debates. No judgment — AI is a patient coach.' },
        { icon: '👨‍🏫', title: 'For Teachers', desc: 'Monitor student progress easily. Assign specific topics and personas. Save time on individual training. Get analytics on class performance.' },
        { icon: '📚', title: 'For Students', desc: 'Self-paced learning. Immediate feedback on answers. Build foundational knowledge. Prepare for Dawah with confidence.' },
        { icon: '🌍', title: 'For Dawah Organizations', desc: 'Train volunteers systematically. Standardize debate training. Scale training across regions. Measure effectiveness.' }
      ],
      
      improveTitle: 'How This Platform Improves You',
      improveItems: [
        { icon: '', title: 'Critical Thinking', desc: 'Learn to analyze arguments logically, identify fallacies in real-time, and build structured responses.' },
        { icon: '', title: 'Communication Skills', desc: 'Articulate thoughts clearly, respond under pressure, and use persuasive language effectively.' },
        { icon: '', title: 'Knowledge Base', desc: 'Deepen understanding of key topics, learn from AI\'s counter-arguments, and discover new perspectives.' },
        { icon: '', title: 'Confidence Building', desc: 'Practice without fear of judgment, learn from mistakes safely, and build public speaking confidence.' },
        { icon: '', title: 'Strategic Thinking', desc: 'Plan debate strategies, anticipate objections, and respond with precision.' }
      ],
      
      maximizeTitle: 'How to Get the Most Out of This Platform',
      maximizeRoutine: 'Daily Practice Routine',
      maximizeRoutineItems: [
        '15-20 minutes daily',
        'Start with Beginner difficulty',
        'Try all personas gradually',
        'Review AI Coach Analysis after each session',
        'Track your scores weekly'
      ],
      maximizeProTips: 'Pro Tips',
      maximizeProItems: [
        'Use Voice Mode for realistic practice',
        'Challenge yourself with Expert difficulty',
        'Practice in Classroom Mode with peers',
        'Share sessions with teachers for feedback',
        'Revisit past debates to see improvement'
      ],
      
      faqTitle: 'Frequently Asked Questions',
      faqItems: [
        { q: 'Is this platform free?', a: 'Yes! Completely free for scholars and students of knowledge.' },
        { q: 'Do I need a teacher to use this?', a: 'No! Self-paced learning is fully supported. But teachers can track progress in Classroom Mode.' },
        { q: 'Can I use it on mobile?', a: 'Yes! Fully responsive for mobile, tablet, and desktop devices.' },
        { q: 'Is my data safe?', a: 'Yes! All data is saved locally in your browser. No data is shared with any third party.' },
        { q: 'How long does each debate session take?', a: 'Typically 10-20 minutes per session. You can end anytime.' },
        { q: 'What if I make mistakes?', a: 'It\'s a training platform! Mistakes help you learn. AI gives constructive feedback to improve.' },
        { q: 'Can I use this in Urdu or Arabic?', a: 'Yes! English, Urdu, and Arabic are fully supported.' },
        { q: 'How do I track my progress?', a: 'All debates are automatically saved in history. View scores and AI Coach Analysis anytime.' },
        { q: 'Is it really effective?', a: 'Yes! Consistent practice with structured feedback leads to significant improvement in debate skills.' },
        { q: 'Can I share my debate sessions?', a: 'Yes! Share via WhatsApp, copy to clipboard, or download as text file.' }
      ],
      
      contactTitle: 'Contact & Credits',
      developedBy: 'Developed by',
      supervisedBy: 'Supervised by',
      muftiName: 'Dr. Mufti Yasir Nadeem Al Wajdi',
      email: 'azaanmansuri900@gmail.com',
      copyright: '© 2026 — For Dawah training of Ulama e Ikram'
    },
    ur: {
      pageTitle: 'اس پلیٹ فارم کے بارے میں',
      back: '← واپس',
      
      missionTitle: 'ہمارا مشن',
      missionDesc: 'علمائے کرام اور طلبہ کو ایک منظم، دہرائی جانے والی اور موثر تربیتی پلیٹ فارم فراہم کرنا تاکہ وہ الحادی دلائل کے خلاف اپنی استدلال کی صلاحیتوں کو مضبوط کر سکیں۔ مختلف الحادی شخصیات اور چیلنجنگ موضوعات کے ساتھ مسلسل مشق کے ذریعے، علماء اپنے دلائل کو بہتر بنا سکتے ہیں اور دعوت میں اعتماد کے ساتھ جواب دے سکتے ہیں۔',
      
      visionTitle: 'ہمارا وژن',
      visionDesc: 'ایک ایسی دنیا جہاں ہر عالم اور طالب علم کو جدید AI تربیتی ٹولز تک رسائی حاصل ہو، جو انہیں الحادی اعتراضات کا اعتماد سے جواب دینے اور عالمی سطح پر اسلامی دعوت کو مضبوط کرنے کے قابل بنائے۔ ہم ایک ایسے مستقبل کا تصور کرتے ہیں جہاں اسلامی علم کو ٹیکنالوجی سے تقویت ملے، اس سے خطرہ نہ ہو۔',
      
      whyTitle: 'ہم نے یہ کیوں بنایا',
      whyDesc: 'آج کے ڈیجیٹل دور میں، الحادی دلائل سوشل میڈیا، یوٹیوب اور آن لائن فورمز کے ذریعے تیزی سے پھیل رہے ہیں۔ علمائے کرام کو ایک محفوظ، قابل رسائی اور موثر طریقہ کار کی ضرورت ہے تاکہ وہ اپنے جوابات کی مشق اور بہتری لا سکیں۔ یہ پلیٹ فارم منظم مباحثہ تربیت کی بڑھتی ہوئی ضرورت کو پورا کرنے کے لیے بنایا گیا ہے جو 24/7 دستیاب ہو، بغیر کسی فیصلے کے، اور جدید AI ٹیکنالوجی سے چلتی ہو۔',
      
      expertTitle: 'ماہر کیسے بنیں',
      expertSteps: [
        'روزانہ مشق کریں — 15-20 منٹ مسلسل مشق',
        'تمام شخصیات آزمائیں — ہر شخصیت کے منفرد دلائل ہیں؛ ان سب پر مہارت حاصل کریں',
        'AI کوچ تجزیہ کا جائزہ لیں — اپنی غلطیوں سے سیکھیں',
        'مشکل بڑھائیں — شروعات سے ماہر تک جائیں',
        'وائس موڈ استعمال کریں — قدرتی طور پر بول کر حقیقی مباحثے کی مشق کریں',
        'تجویز کردہ وسائل کا مطالعہ کریں — گہری سیکھنے کے لیے AI کی تجاویز پر عمل کریں',
        'اپنی پیشرفت ٹریک کریں — وقت کے ساتھ اپنے اسکورز میں بہتری دیکھیں'
      ],
      
      whoTitle: 'یہ کس کے لیے ہے؟',
      whoItems: [
        { icon: '🎓', title: 'علمائے کرام', desc: 'ایک محفوظ، منظم ماحول میں الحادی اعتراضات کے جوابات کی مشق کریں' },
        { icon: '👨‍🏫', title: 'اساتذہ و مدارس', desc: 'کلاسز بنائیں، مباحثے تفویض کریں، اور طلبہ کی پیشرفت ٹریک کریں' },
        { icon: '📚', title: 'طلبہ علم', desc: 'منظم AI طاقتور مشق کے ذریعے دعوت میں اعتماد پیدا کریں' },
        { icon: '🌍', title: 'دعوتی تنظیمیں', desc: 'رضاکاروں کو منظم طریقے سے تربیت دیں اور پیمانے پر تربیت کریں' }
      ],
      
      statsTitle: 'پلیٹ فارم کے اعداد و شمار',
      stats: [
        { number: '10+', label: 'الحادی شخصیات' },
        { number: '12', label: 'مباحثہ موضوعات' },
        { number: '4', label: 'مباحثہ موڈز' },
        { number: '3', label: 'زبانوں کی معاونت' },
        { number: '∞', label: 'لامحدود مشق' },
        { number: '📈', label: 'بڑھتی ہوئی کمیونٹی' }
      ],
      
      worksTitle: 'کیسے کام کرتا ہے',
      worksSteps: [
        'اکاؤنٹ بنائیں / لاگ ان کریں',
        'انفرادی پریکٹس یا کلاس روم موڈ منتخب کریں',
        'موڈ، شخصیت، موضوع اور مشکل منتخب کریں',
        'زبان اور ان پٹ طریقہ منتخب کریں (ٹائپ / وائس)',
        '"مباحثہ شروع کریں" پر کلک کریں → AI اعتراض پیش کرتا ہے',
        'آپ جواب دیتے ہیں → AI فیڈبیک اور نمبر دیتا ہے',
        'سیشن ختم کریں → AI کوچ تجزیہ دیکھیں'
      ],
      
      disclaimerTitle: 'AI انتباہ',
      disclaimerText: 'یہ پلیٹ فارم مصنوعی ذہانت استعمال کرتا ہے۔ AI غلطیاں کر سکتا ہے، نامکمل جوابات دے سکتا ہے۔',
      disclaimerWarning: 'ہمیشہ اہم معلومات کی تصدیق مستند اسلامی ذرائع اور مستند علماء سے کریں۔',
      disclaimerNote: 'اس ٹول کو تربیتی معاون کے طور پر استعمال کریں، فتویٰ یا مذہبی احکام کے ذریعہ کے طور پر نہیں۔',
      
      benefitsTitle: 'اس پلیٹ فارم کے استعمال کے فوائد',
      benefits: [
        { icon: '🕌', title: 'علمائے کرام کے لیے', desc: 'کسی بھی وقت، کہیں بھی مشق کریں۔ غلطیاں کرنے اور سیکھنے کے لیے محفوظ ماحول۔ حقیقی مباحثوں سے پہلے اعتماد پیدا کریں۔ کوئی فیصلہ نہیں — AI ایک صابر کوچ ہے۔' },
        { icon: '👨‍🏫', title: 'اساتذہ کے لیے', desc: 'طلبہ کی پیشرفت آسانی سے مانیٹر کریں۔ مخصوص موضوعات اور شخصیات تفویض کریں۔ انفرادی تربیت پر وقت بچائیں۔ کلاس کی کارکردگی کے تجزیات حاصل کریں۔' },
        { icon: '📚', title: 'طلبہ کے لیے', desc: 'اپنی رفتار سے سیکھیں۔ جوابات پر فوری فیڈبیک۔ بنیادی علم بنائیں۔ اعتماد کے ساتھ دعوت کے لیے تیار ہوں۔' },
        { icon: '🌍', title: 'دعوتی تنظیموں کے لیے', desc: 'رضاکاروں کو منظم طریقے سے تربیت دیں۔ مباحثہ کی تربیت کو معیاری بنائیں۔ خطوں میں تربیت کو پیمانہ دیں۔ تاثیر کی پیمائش کریں۔' }
      ],
      
      improveTitle: 'یہ پلیٹ فارم آپ کو کیسے بہتر بناتا ہے',
      improveItems: [
        { icon: '', title: 'تنقیدی سوچ', desc: 'دلائل کا منطقی تجزیہ کرنا، حقیقی وقت میں مغالطوں کی نشاندہی کرنا، اور منظم جوابات بنانا سیکھیں۔' },
        { icon: '', title: 'مواصلاتی مہارتیں', desc: 'واضح طور پر خیالات کا اظہار کریں، دباؤ میں جواب دیں، اور مؤثر طریقے سے قائل کرنے والی زبان استعمال کریں۔' },
        { icon: '', title: 'علم کا ذخیرہ', desc: 'کلیدی موضوعات کی سمجھ گہری کریں، AI کے جوابی دلائل سے سیکھیں، اور نئے زاویے دریافت کریں۔' },
        { icon: '', title: 'اعتماد سازی', desc: 'فیصلے کے خوف کے بغیر مشق کریں، غلطیوں سے محفوظ طریقے سے سیکھیں، اور عوامی تقریر کا اعتماد بنائیں۔' },
        { icon: '', title: 'اسٹریٹجک سوچ', desc: 'مباحثہ کی حکمت عملی کی منصوبہ بندی کریں، اعتراضات کا اندازہ لگائیں، اور درستگی کے ساتھ جواب دیں۔' }
      ],
      
      maximizeTitle: 'اس پلیٹ فارم سے زیادہ سے زیادہ فائدہ کیسے اٹھائیں',
      maximizeRoutine: 'روزانہ مشق کا معمول',
      maximizeRoutineItems: [
        'روزانہ 15-20 منٹ',
        'شروعاتی مشکل سے شروع کریں',
        'آہستہ آہستہ تمام شخصیات آزمائیں',
        'ہر سیشن کے بعد AI کوچ تجزیہ کا جائزہ لیں',
        'ہفتہ وار اپنے اسکورز ٹریک کریں'
      ],
      maximizeProTips: 'ماہرانہ مشورے',
      maximizeProItems: [
        'حقیقی مشق کے لیے وائس موڈ استعمال کریں',
        'ماہر مشکل کے ساتھ خود کو چیلنج کریں',
        'ساتھیوں کے ساتھ کلاس روم موڈ میں مشق کریں',
        'فیڈبیک کے لیے اساتذہ کے ساتھ سیشنز شیئر کریں',
        'بہتری دیکھنے کے لیے ماضی کی مباحثوں کا دوبارہ جائزہ لیں'
      ],
      
      faqTitle: 'اکثر پوچھے جانے والے سوالات',
      faqItems: [
        { q: 'کیا یہ پلیٹ فارم مفت ہے؟', a: 'جی ہاں! علمائے کرام اور طلبہ علم کے لیے مکمل طور پر مفت۔' },
        { q: 'کیا مجھے اسے استعمال کرنے کے لیے استاد کی ضرورت ہے؟', a: 'نہیں! خود سے سیکھنا مکمل طور پر ممکن ہے۔ لیکن اساتذہ کلاس روم موڈ میں پیشرفت ٹریک کر سکتے ہیں۔' },
        { q: 'کیا میں موبائل پر استعمال کر سکتا ہوں؟', a: 'جی ہاں! موبائل، ٹیبلیٹ اور ڈیسک ٹاپ آلات کے لیے مکمل طور پر موزوں۔' },
        { q: 'کیا میرا ڈیٹا محفوظ ہے؟', a: 'جی ہاں! تمام ڈیٹا آپ کے براؤزر میں مقامی طور پر محفوظ ہوتا ہے۔ کوئی ڈیٹا کسی تیسرے فریق کے ساتھ شیئر نہیں کیا جاتا۔' },
        { q: 'ہر مباحثہ سیشن میں کتنا وقت لگتا ہے؟', a: 'عام طور پر 10-20 منٹ فی سیشن۔ آپ کسی بھی وقت ختم کر سکتے ہیں۔' },
        { q: 'اگر میں غلطیاں کروں تو کیا ہوگا؟', a: 'یہ ایک تربیتی پلیٹ فارم ہے! غلطیاں آپ کو سیکھنے میں مدد دیتی ہیں۔ AI بہتری کے لیے تعمیری فیڈبیک دیتا ہے۔' },
        { q: 'کیا میں اردو یا عربی میں استعمال کر سکتا ہوں؟', a: 'جی ہاں! انگریزی، اردو اور عربی مکمل طور پر معاونت یافتہ ہیں۔' },
        { q: 'میں اپنی پیشرفت کیسے ٹریک کروں؟', a: 'تمام مباحثے خودکار طور پر ہسٹری میں محفوظ ہوتے ہیں۔ کسی بھی وقت اسکورز اور AI کوچ تجزیہ دیکھیں۔' },
        { q: 'کیا یہ واقعی مؤثر ہے؟', a: 'جی ہاں! مسلسل مشق اور منظم فیڈبیک مباحثہ کی مہارتوں میں نمایاں بہتری لاتی ہے۔' },
        { q: 'کیا میں اپنے مباحثہ سیشنز شیئر کر سکتا ہوں؟', a: 'جی ہاں! واٹس ایپ پر شیئر کریں، کلپ بورڈ پر کاپی کریں، یا ٹیکسٹ فائل کے طور پر ڈاؤن لوڈ کریں۔' }
      ],
      
      contactTitle: 'رابطہ و تعاون',
      developedBy: 'تیار کردہ',
      supervisedBy: 'نگرانی',
      muftiName: 'ڈاکٹر مفتی یاسر ندیم الواجدی',
      email: 'azaanmansuri900@gmail.com',
      copyright: '© 2026 — علمائے کرام کی دعوتی تربیت کے لیے'
    },
    ar: {
      pageTitle: 'حول هذه المنصة',
      back: '← رجوع',
      
      missionTitle: 'مهمتنا',
      missionDesc: 'توفير منصة تدريبية منظمة وقابلة للتكرار وفعالة للعلماء وطلاب العلم لتقوية مهاراتهم الاستدلالية ضد الحجج الإلحادية. من خلال الممارسة المستمرة مع شخصيات إلحادية متنوعة وموضوعات صعبة، يمكن للعلماء تحسين حججهم والرد بثقة في الدعوة.',
      
      visionTitle: 'رؤيتنا',
      visionDesc: 'عالم حيث كل عالم وطالب علم لديه إمكانية الوصول إلى أدوات تدريب ذكاء اصطناعي متقدمة، تمكنهم من الرد بثقة على الاعتراضات الإلحادية وتعزيز الدعوة الإسلامية عالمياً. نتخيل مستقبلاً حيث يتم تمكين المعرفة الإسلامية بالتكنولوجيا، وليس تهديدها بها.',
      
      whyTitle: 'لماذا بنينا هذا',
      whyDesc: 'في العصر الرقمي الحالي، تنتشر الحجج الإلحادية بسرعة عبر وسائل التواصل الاجتماعي ويوتيوب والمنتديات الإلكترونية. يحتاج علماء الأمة إلى طريقة آمنة وسهلة وفعالة لممارسة وتحسين ردودهم. تم بناء هذه المنصة لتلبية الحاجة المتزايدة للتدريب المنظم على المناظرة المتاح 24/7، بدون أحكام مسبقة، ومدعوم بتكنولوجيا الذكاء الاصطناعي المتطورة.',
      
      expertTitle: 'كيف تصبح خبيراً',
      expertSteps: [
        'مارس يومياً — 15-20 دقيقة من الممارسة المستمرة',
        'جرب جميع الشخصيات — كل شخصية لها حجج فريدة؛ أتقنها جميعاً',
        'راجع تحليل المدرب الذكي — تعلم من أخطائك',
        'زد الصعوبة — ابدأ من المبتدئ → تقدم إلى الخبير',
        'استخدم وضع الصوت — محاكاة المناظرات الحقيقية بالتحدث بشكل طبيعي',
        'ادرس الموارد المقترحة — اتبع توصيات الذكاء الاصطناعي للتعلم العميق',
        'تتبع تقدمك — شاهد تحسن درجاتك مع مرور الوقت'
      ],
      
      whoTitle: 'لمن هذه المنصة؟',
      whoItems: [
        { icon: '🎓', title: 'علماء الأمة', desc: 'تدرب على الرد على الاعتراضات الإلحادية في بيئة آمنة ومنظمة' },
        { icon: '👨‍🏫', title: 'المعلمون والمدارس', desc: 'أنشئ فصولاً دراسية، وحدد مناظرات، وتتبع تقدم الطلاب' },
        { icon: '📚', title: 'طلاب العلم', desc: 'ابنِ الثقة في الدعوة من خلال ممارسة منظمة مدعومة بالذكاء الاصطناعي' },
        { icon: '🌍', title: 'منظمات الدعوة', desc: 'درب المتطوعين بشكل منهجي وعلى نطاق واسع' }
      ],
      
      statsTitle: 'إحصائيات المنصة',
      stats: [
        { number: '10+', label: 'شخصيات إلحادية' },
        { number: '12', label: 'موضوعات المناظرة' },
        { number: '4', label: 'أوضاع المناظرة' },
        { number: '3', label: 'لغات مدعومة' },
        { number: '∞', label: 'ممارسة غير محدودة' },
        { number: '📈', label: 'مجتمع متنامي' }
      ],
      
      worksTitle: 'كيف يعمل',
      worksSteps: [
        'إنشاء حساب / تسجيل دخول',
        'اختر الممارسة الفردية أو وضع الفصل الدراسي',
        'اختر الوضع، الشخصية، الموضوع والصعوبة',
        'اختر اللغة وطريقة الإدخال (كتابة / صوت)',
        'انقر "ابدأ المناظرة" → يقدم الذكاء الاصطناعي اعتراضاً',
        'ترد → يقدم الذكاء الاصطناعي ملاحظات ودرجة',
        'انهِ الجلسة → شاهد تحليل المدرب الذكي'
      ],
      
      disclaimerTitle: 'تنبيه الذكاء الاصطناعي',
      disclaimerText: 'تستخدم هذه المنصة الذكاء الاصطناعي. قد يخطئ الذكاء الاصطناعي أو يقدم إجابات غير كاملة.',
      disclaimerWarning: 'تحقق دائماً من المعلومات الهامة من مصادر إسلامية موثوقة وعلماء مؤهلين.',
      disclaimerNote: 'استخدم هذه الأداة كمساعدة تدريبية لممارسة مهارات المناظرة، وليس كمصدر للفتوى أو الأحكام الدينية.',
      
      benefitsTitle: 'فوائد استخدام هذه المنصة',
      benefits: [
        { icon: '🕌', title: 'لعلماء الأمة', desc: 'تدرب في أي وقت، في أي مكان. بيئة آمنة لارتكاب الأخطاء والتعلم. ابنِ الثقة قبل المناظرات الحقيقية. لا أحكام مسبقة — الذكاء الاصطناعي مدرب صبور.' },
        { icon: '👨‍🏫', title: 'للمعلمين', desc: 'راقب تقدم الطلاب بسهولة. حدد موضوعات وشخصيات محددة. وفر الوقت على التدريب الفردي. احصل على تحليلات أداء الفصل.' },
        { icon: '📚', title: 'للطلاب', desc: 'تعلم بوتيرتك الخاصة. ملاحظات فورية على الإجابات. ابنِ المعرفة الأساسية. استعد للدعوة بثقة.' },
        { icon: '🌍', title: 'لمنظمات الدعوة', desc: 'درب المتطوعين بشكل منهجي. وحد تدريب المناظرة. وسع التدريب عبر المناطق. قس الفعالية.' }
      ],
      
      improveTitle: 'كيف تحسنك هذه المنصة',
      improveItems: [
        { icon: '', title: 'التفكير النقدي', desc: 'تعلم تحليل الحجج منطقياً، وتحديد المغالطات في الوقت الفعلي، وبناء ردود منظمة.' },
        { icon: '', title: 'مهارات التواصل', desc: 'عبر عن الأفكار بوضوح، ورد تحت الضغط، واستخدم لغة مقنعة بفعالية.' },
        { icon: '', title: 'القاعدة المعرفية', desc: 'عمق فهمك للموضوعات الرئيسية، وتعلم من حجج الذكاء الاصطناعي المضادة، واكتشف وجهات نظر جديدة.' },
        { icon: '', title: 'بناء الثقة', desc: 'تدرب دون خوف من الحكم، وتعلم من الأخطاء بأمان، وابنِ ثقة التحدث أمام الجمهور.' },
        { icon: '', title: 'التفكير الاستراتيجي', desc: 'خطط لاستراتيجيات المناظرة، وتوقع الاعتراضات، ورد بدقة.' }
      ],
      
      maximizeTitle: 'كيف تحقق أقصى استفادة من هذه المنصة',
      maximizeRoutine: 'روتين الممارسة اليومية',
      maximizeRoutineItems: [
        '15-20 دقيقة يومياً',
        'ابدأ بمستوى المبتدئ',
        'جرب جميع الشخصيات تدريجياً',
        'راجع تحليل المدرب الذكي بعد كل جلسة',
        'تتبع درجاتك أسبوعياً'
      ],
      maximizeProTips: 'نصائح احترافية',
      maximizeProItems: [
        'استخدم وضع الصوت للممارسة الواقعية',
        'تحدى نفسك بمستوى الخبير',
        'تدرب في وضع الفصل الدراسي مع الزملاء',
        'شارك الجلسات مع المعلمين للحصول على ملاحظات',
        'راجع المناظرات السابقة لرؤية التحسن'
      ],
      
      faqTitle: 'الأسئلة الشائعة',
      faqItems: [
        { q: 'هل هذه المنصة مجانية؟', a: 'نعم! مجانية تماماً للعلماء وطلاب العلم.' },
        { q: 'هل أحتاج إلى معلم لاستخدام هذا؟', a: 'لا! التعلم الذاتي مدعوم بالكامل. ولكن يمكن للمعلمين تتبع التقدم في وضع الفصل الدراسي.' },
        { q: 'هل يمكنني استخدامه على الهاتف؟', a: 'نعم! متجاوب بالكامل مع أجهزة الهاتف واللوحي والكمبيوتر.' },
        { q: 'هل بياناتي آمنة؟', a: 'نعم! جميع البيانات محفوظة محلياً في متصفحك. لا تتم مشاركة أي بيانات مع أي طرف ثالث.' },
        { q: 'كم تستغرق كل جلسة مناظرة؟', a: 'عادة 10-20 دقيقة لكل جلسة. يمكنك إنهاء الجلسة في أي وقت.' },
        { q: 'ماذا لو ارتكبت أخطاء؟', a: 'إنها منصة تدريب! الأخطاء تساعدك على التعلم. يقدم الذكاء الاصطناعي ملاحظات بناءة للتحسين.' },
        { q: 'هل يمكنني استخدام هذا بالأردية أو العربية؟', a: 'نعم! الإنجليزية والأردية والعربية مدعومة بالكامل.' },
        { q: 'كيف أتتبع تقدمي؟', a: 'يتم حفظ جميع المناظرات تلقائياً في السجل. شاهد الدرجات وتحليل المدرب الذكي في أي وقت.' },
        { q: 'هل هو فعال حقاً؟', a: 'نعم! الممارسة المستمرة مع الملاحظات المنظمة تؤدي إلى تحسن كبير في مهارات المناظرة.' },
        { q: 'هل يمكنني مشاركة جلسات المناظرة الخاصة بي؟', a: 'نعم! شارك عبر واتساب، أو انسخ إلى الحافظة، أو حمل كملف نصي.' }
      ],
      
      contactTitle: 'جهات الاتصال والاعتمادات',
      developedBy: 'تم التطوير بواسطة',
      supervisedBy: 'بإشراف',
      muftiName: 'الدكتور المفتي ياسر نديم الوجدي',
      email: 'azaanmansuri900@gmail.com',
      copyright: '© 2026 — لتدريب الدعوة لعلماء الأمة'
    }
  };

  const content = t[language];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      fontFamily: language === 'ur' ? "'Noto Nastaliq Urdu', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" : (language === 'ar' ? "'Amiri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"),
      direction: language === 'ar' ? 'rtl' : 'ltr',
      color: '#ffffff',
      overflowX: 'hidden'
    }}>
      
      {/* Sticky Header with Glass Effect */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: `rgba(10,10,10,${Math.min(0.95, 0.85 + scrollY * 0.0005)})`,
          backdropFilter: `blur(${Math.min(30, 10 + scrollY * 0.05)}px)`,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '16px 24px',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              style={{
                background: 'rgba(26,26,26,0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '8px 18px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10a37f'; e.currentTarget.style.background = 'rgba(16,163,127,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(26,26,26,0.8)'; }}
            >
              {content.back}
            </motion.button>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                margin: 0, 
                background: 'linear-gradient(135deg, #ffffff, #10a37f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {content.pageTitle}
            </motion.h1>
          </div>
          
          {/* Language Switcher - 3D Button Style */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', gap: '4px', background: 'rgba(26,26,26,0.8)', borderRadius: '24px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {['en', 'ur', 'ar'].map((lang) => (
              <motion.button
                key={lang}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(lang)}
                style={{
                  background: language === lang ? '#10a37f' : 'transparent',
                  color: language === lang ? '#ffffff' : '#aaaaaa',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: language === lang ? '0 4px 20px rgba(16,163,127,0.3)' : 'none'
                }}
              >
                {lang === 'en' ? 'English' : lang === 'ur' ? 'اردو' : 'العربية'}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        
        {/* 3D Interactive Hero Banner */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, #0a1a1a, #0a0a0a)',
            borderRadius: '24px',
            padding: '48px 32px',
            marginBottom: '32px',
            border: '1px solid rgba(16,163,127,0.2)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transform: `perspective(1000px) rotateX(${mousePosition.y * 8}deg) rotateY(${mousePosition.x * 8}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Animated Background Particles */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  scale: [0, 1, 0],
                  y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  x: [Math.random() * 100 - 50, Math.random() * 100 - 50]
                }}
                transition={{ 
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 4
                }}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  background: '#10a37f',
                  borderRadius: '50%',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3
                }}
              />
            ))}
          </div>

          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ fontSize: '64px', marginBottom: '16px', position: 'relative', zIndex: 1 }}
          >
            🎙️
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#fff', 
              marginBottom: '12px',
              position: 'relative',
              zIndex: 1,
              textShadow: '0 0 40px rgba(16,163,127,0.1)'
            }}
          >
            AI Atheism Debate Training Platform
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              color: '#10a37f', 
              fontSize: '16px', 
              maxWidth: '500px', 
              margin: '0 auto',
              position: 'relative',
              zIndex: 1
            }}
          >
            Empowering Ulama e Ikram with AI-powered debate training
          </motion.p>

          {/* Glow effects */}
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(16,163,127,0.1), transparent)',
            borderRadius: '50%',
            top: '-100px',
            right: '-100px',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(16,163,127,0.05), transparent)',
            borderRadius: '50%',
            bottom: '-50px',
            left: '-50px',
            zIndex: 0
          }} />
        </motion.div>

        {/* 1. Mission */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 60px rgba(16,163,127,0.15)',
            borderColor: '#10a37f'
          }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            perspective: '1000px'
          }}
        >
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              color: '#10a37f', 
              marginBottom: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}
          >
            <motion.span
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '28px' }}
            >
              
            </motion.span> 
            {content.missionTitle}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ color: '#cccccc', lineHeight: 1.8, fontSize: '15px', margin: 0 }}
          >
            {content.missionDesc}
          </motion.p>
        </motion.div>

        {/* 2. Vision */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 60px rgba(16,163,127,0.15)',
            borderColor: '#10a37f'
          }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.visionTitle}
          </h3>
          <p style={{ color: '#cccccc', lineHeight: 1.8, fontSize: '15px', margin: 0 }}>
            {content.visionDesc}
          </p>
        </motion.div>

        {/* 3. Why We Built This */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 60px rgba(16,163,127,0.15)',
            borderColor: '#10a37f'
          }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.whyTitle}
          </h3>
          <p style={{ color: '#cccccc', lineHeight: 1.8, fontSize: '15px', margin: 0 }}>
            {content.whyDesc}
          </p>
        </motion.div>

        {/* 5. How to Become an Expert */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ 
            boxShadow: '0 20px 60px rgba(16,163,127,0.15)',
            borderColor: '#10a37f'
          }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.expertTitle}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
            {content.expertSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                whileHover={{ scale: 1.02, borderColor: '#10a37f' }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  color: '#cccccc', 
                  fontSize: '14px', 
                  lineHeight: 1.5,
                  background: 'rgba(255,255,255,0.02)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #1a1a1a',
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.span 
                  whileHover={{ scale: 1.2 }}
                  style={{ 
                    color: '#10a37f', 
                    fontSize: '16px',
                    background: 'rgba(16,163,127,0.15)',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {idx + 1}
                </motion.span>
                <span>{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 6. Who Is This For? */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          whileHover={{ borderColor: '#10a37f40' }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.whoTitle}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {content.whoItems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + idx * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 40px rgba(16,163,127,0.15)',
                  borderColor: '#10a37f'
                }}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(10,10,10,0.9), rgba(10,26,10,0.9))', 
                  padding: '24px', 
                  borderRadius: '16px', 
                  border: '1px solid #1a2a1a',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <motion.div 
                  whileHover={{ rotate: 20, scale: 1.1 }}
                  style={{ fontSize: '36px', marginBottom: '10px' }}
                >
                  {item.icon}
                </motion.div>
                <h4 style={{ color: '#fff', marginBottom: '6px', fontSize: '16px' }}>{item.title}</h4>
                <p style={{ color: '#aaa', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 7. Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ borderColor: '#10a37f40' }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.statsTitle}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', textAlign: 'center' }}>
            {content.stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.08, type: 'spring' }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 10px 40px rgba(16,163,127,0.2)',
                  borderColor: '#10a37f'
                }}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(10,10,10,0.9), rgba(10,26,10,0.9))', 
                  padding: '24px 16px', 
                  borderRadius: '16px', 
                  border: '1px solid #1a2a1a',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.08, type: 'spring' }}
                  style={{ fontSize: '36px', fontWeight: '700', color: '#10a37f' }}
                >
                  {stat.number}
                </motion.div>
                <div style={{ fontSize: '13px', color: '#aaa', marginTop: '6px' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 8. How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          whileHover={{ borderColor: '#10a37f40' }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.worksTitle}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
            {content.worksSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + idx * 0.05 }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: '0 5px 30px rgba(16,163,127,0.1)',
                  borderColor: '#10a37f'
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  background: 'rgba(255,255,255,0.02)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #1a1a1a',
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.span 
                  whileHover={{ scale: 1.2 }}
                  style={{ 
                    background: '#10a37f', 
                    color: '#fff', 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(16,163,127,0.3)'
                  }}
                >
                  {idx + 1}
                </motion.span>
                <span style={{ color: '#cccccc', fontSize: '13px' }}>{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 9. AI Disclaimer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 60px rgba(255,0,0,0.1)'
          }}
          style={{
            backgroundColor: '#1a0000',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #330000',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,0,0,0.05), transparent)',
            borderRadius: '50%',
            top: '-50px',
            right: '-50px'
          }} />
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#ff6666', 
            marginBottom: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '28px' }}
            >
              ⚠️
            </motion.span> 
            {content.disclaimerTitle}
          </h3>
          <p style={{ color: '#ffaaaa', lineHeight: 1.8, fontSize: '14px', margin: 0 }}>
            {content.disclaimerText}<br/><br/>
            <strong style={{ color: '#ff8888' }}>{content.disclaimerWarning}</strong><br/><br/>
            {content.disclaimerNote}
          </p>
        </motion.div>

        {/* 10. Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          whileHover={{ borderColor: '#10a37f40' }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.benefitsTitle}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {content.benefits.map((benefit, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + idx * 0.08 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 40px rgba(16,163,127,0.15)',
                  borderColor: '#10a37f'
                }}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(10,10,10,0.9), rgba(10,26,10,0.9))', 
                  padding: '24px', 
                  borderRadius: '16px', 
                  border: '1px solid #1a2a1a',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <motion.div 
                  whileHover={{ rotate: 20, scale: 1.1 }}
                  style={{ fontSize: '36px', marginBottom: '10px' }}
                >
                  {benefit.icon}
                </motion.div>
                <h4 style={{ color: '#fff', marginBottom: '6px', fontSize: '16px' }}>{benefit.title}</h4>
                <p style={{ color: '#aaa', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 11. How This Platform Improves You */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ borderColor: '#10a37f40' }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.improveTitle}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {content.improveItems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + idx * 0.08 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 40px rgba(16,163,127,0.15)',
                  borderColor: '#10a37f'
                }}
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  padding: '20px', 
                  borderRadius: '16px', 
                  border: '1px solid #1a1a1a',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <motion.div 
                  whileHover={{ rotate: 20, scale: 1.1 }}
                  style={{ fontSize: '32px', marginBottom: '8px' }}
                >
                  {item.icon}
                </motion.div>
                <h4 style={{ color: '#fff', marginBottom: '4px', fontSize: '15px' }}>{item.title}</h4>
                <p style={{ color: '#aaa', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 12. How to Get the Most Out */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          whileHover={{ borderColor: '#10a37f40' }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.maximizeTitle}
          </h3>
          
          <h4 style={{ color: '#10a37f', fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span></span> {content.maximizeRoutine}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {content.maximizeRoutineItems.map((item, idx) => (
              <motion.span 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 + idx * 0.05 }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 5px 20px rgba(16,163,127,0.2)',
                  borderColor: '#10a37f'
                }}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(10,10,10,0.9), rgba(10,26,10,0.9))', 
                  padding: '6px 16px', 
                  borderRadius: '20px', 
                  fontSize: '13px', 
                  color: '#ccc', 
                  border: '1px solid #1a2a1a',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>

          <h4 style={{ color: '#10a37f', fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span></span> {content.maximizeProTips}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {content.maximizeProItems.map((item, idx) => (
              <motion.span 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 5px 20px rgba(16,163,127,0.2)',
                  borderColor: '#10a37f'
                }}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(10,10,10,0.9), rgba(10,26,10,0.9))', 
                  padding: '6px 16px', 
                  borderRadius: '20px', 
                  fontSize: '13px', 
                  color: '#ccc', 
                  border: '1px solid #1a2a1a',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* 13. FAQ - Dropdown Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ borderColor: '#10a37f40' }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #1a2a22',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <motion.span
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '28px' }}
            >
              
            </motion.span> 
            {content.faqTitle}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {content.faqItems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.03 }}
                style={{
                  border: `1px solid ${openFaq === idx ? '#10a37f' : 'rgba(26,42,26,0.5)'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  background: openFaq === idx ? 'rgba(16,163,127,0.05)' : 'transparent'
                }}
              >
                <motion.button
                  whileHover={{ background: 'rgba(16,163,127,0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ color: openFaq === idx ? '#10a37f' : '#fff' }}>
                    {item.q}
                  </span>
                  <motion.span 
                    animate={{ 
                      rotate: openFaq === idx ? 180 : 0,
                      scale: openFaq === idx ? 1.2 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      fontSize: '20px', 
                      color: '#10a37f',
                    }}
                  >
                    ▼
                  </motion.span>
                </motion.button>
                
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ 
                        padding: '0 20px 16px 20px',
                        borderTop: '1px solid rgba(16,163,127,0.1)'
                      }}>
                        <p style={{ 
                          color: '#aaa', 
                          fontSize: '13px', 
                          lineHeight: 1.6, 
                          margin: 0,
                          paddingTop: '12px'
                        }}>
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 14. Contact & Credits - Premium Footer with Glow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          whileHover={{ 
            borderColor: '#10a37f40',
            boxShadow: '0 20px 60px rgba(16,163,127,0.05)'
          }}
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #1a2a22',
            textAlign: 'center',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#10a37f', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px' 
          }}>
            <span style={{ fontSize: '28px' }}></span> {content.contactTitle}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
  {/* Contact Message */}
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.78 }}
    style={{
      color: '#888',
      fontSize: '13px',
      margin: 0,
      letterSpacing: '0.3px',
      background: 'rgba(16,163,127,0.05)',
      padding: '8px 20px',
      borderRadius: '20px',
      border: '1px solid rgba(16,163,127,0.1)'
    }}
  >
    📩 For any queries, doubts, or issues — feel free to reach out
  </motion.p>
  
  {/* Email Link */}
  <motion.a 
    href="mailto:azaanmansuri900@gmail.com"
    whileHover={{ 
      scale: 1.05,
      boxShadow: '0 10px 40px rgba(16,163,127,0.4)',
      borderColor: '#10a37f'
    }}
    style={{
      color: '#10a37f',
      fontSize: '14px',
      textDecoration: 'none',
      background: 'linear-gradient(135deg, rgba(10,10,10,0.9), rgba(10,26,10,0.9))',
      padding: '10px 24px',
      borderRadius: '24px',
      border: '1px solid #1a2a1a',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 0 30px rgba(16,163,127,0.1)'
    }}
  >
    {content.email}
  </motion.a>
</div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ borderTop: '1px solid #1a2a1a', paddingTop: '20px' }}
          >
            <motion.p 
              whileHover={{ scale: 1.02 }}
              style={{ color: '#888', fontSize: '14px', margin: '6px 0' }}
            >
              {content.developedBy}{' '}
              <motion.span 
                whileHover={{ 
                  textShadow: '0 0 30px rgba(16,163,127,0.6)',
                  color: '#10a37f'
                }}
                style={{ 
                  color: '#10a37f', 
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
              >
                Azaan Mansuri
              </motion.span>
            </motion.p>
            
            <motion.p 
              whileHover={{ scale: 1.02 }}
              style={{ color: '#888', fontSize: '14px', margin: '6px 0' }}
            >
              {content.supervisedBy}{' '}
              <motion.span 
                whileHover={{ 
                  textShadow: '0 0 30px rgba(16,163,127,0.6)',
                  color: '#10a37f'
                }}
                style={{ 
                  color: '#10a37f', 
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
              >
                {content.muftiName}
              </motion.span>
            </motion.p>
            
            <motion.p 
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 5px 20px rgba(16,163,127,0.15)'
              }}
              style={{ 
                color: '#666', 
                fontSize: '12px', 
                margin: '14px 0 0', 
                background: 'rgba(255,255,255,0.02)',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'inline-block',
                border: '1px solid #1a1a1a',
                transition: 'all 0.3s ease'
              }}
            >
              {content.copyright}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}