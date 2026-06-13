'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClassroomPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Create form state
  const [teacherName, setTeacherName] = useState('');
  const [madrasaName, setMadrasaName] = useState('');
  const [subject, setSubject] = useState('');
  
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [loadingCountries, setLoadingCountries] = useState(false);
  
  // Success modal state
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassName, setNewClassName] = useState('');
  
  // Join form state
  const [classCode, setClassCode] = useState('');
  const [studentName, setStudentName] = useState('');

  // Join form state
const [studentGrade, setStudentGrade] = useState('');           // ✅ Add this line
const [studentCountry, setStudentCountry] = useState('');       // ✅ Add this line
const [studentState, setStudentState] = useState('');           // ✅ Add this line
const [studentStatesList, setStudentStatesList] = useState([]); // ✅ Add this line
  
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
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch(e) {
        console.error('Error parsing user:', e);
      }
    }
    
    fetchData();
    fetchCountries();
  }, []);
  
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const [myRes, joinedRes] = await Promise.all([
        fetch(`${API_URL}/api/classroom/my-classes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/classroom/joined-classes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const myData = await myRes.json();
      const joinedData = await joinedRes.json();
      
      if (myData.success) setMyClasses(myData.classrooms);
      if (joinedData.success) setJoinedClasses(joinedData.classrooms);
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
  setLoadingCountries(true);
  try {
    const res = await fetch('https://api.countrystatecity.in/v1/countries', {
      headers: {
        'X-CSCAPI-KEY': 'a5ed8432f2d1d4e3d7190e094ae9f627905666e480666831ca23ff074d437b8b'
      }
    });
    const data = await res.json();
    console.log('Countries:', data);
    if (Array.isArray(data)) {
      setCountries(data);
    } else {
      setCountries([]);
    }
  } catch (error) {
    console.error('Error fetching countries:', error);
    setCountries([]);
  } finally {
    setLoadingCountries(false);
  }
};

 const fetchStates = async (countryCode) => {
  if (!countryCode) return;
  try {
    const res = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
      headers: {
        'X-CSCAPI-KEY': 'a5ed8432f2d1d4e3d7190e094ae9f627905666e480666831ca23ff074d437b8b'  // ✅ YEH ADD KARO
      }
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setStates(data);
    } else {
      setStates([]);
    }
  } catch (error) {
    console.error('Error fetching states:', error);
    setStates([]);
  }
};

  const handleCountryChange = async (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState('');
    setStates([]);
    
    if (countryCode) {
      await fetchStates(countryCode);
    }
  };

  const handleStudentCountryChange = async (e) => {
  const countryCode = e.target.value;
  setStudentCountry(countryCode);
  setStudentState('');
  setStudentStatesList([]);
  
  if (countryCode) {
    try {
      const res = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
        headers: {
          'X-CSCAPI-KEY': 'a5ed8432f2d1d4e3d7190e094ae9f627905666e480666831ca23ff074d437b8b'
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudentStatesList(data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  }
};
  
  const createClassroom = async () => {
    if (!teacherName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/api/classroom/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
               body: JSON.stringify({
          teacher_name: teacherName,
          madrasa_name: madrasaName,
          subject: subject || 'Atheism Debate Training',
          country: selectedCountry,   
          state: selectedState,       
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewClassCode(data.classroom.class_code);
        setNewClassName(madrasaName || 'Your Classroom');
        setShowSuccessModal(true);
        setShowCreateForm(false);
        setTeacherName('');
        setMadrasaName('');
        setSubject('');
        setSelectedCountry('');  
        setSelectedState('');    
        fetchData();
      } else {
        alert('Failed to create classroom');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating classroom');
    }
  };
  
  const joinClassroom = async () => {
    if (!classCode.trim() || !studentName.trim()) {
      alert('Please enter class code and your name');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/api/classroom/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
  class_code: classCode.toUpperCase(),
  student_name: studentName,
  student_grade: studentGrade,     // ✅ Add
  student_country: studentCountry, // ✅ Add
  student_state: studentState      // ✅ Add
})
      });
      const data = await res.json();
     if (data.success) {
  alert(`✅ Joined classroom successfully!`);
  setShowJoinForm(false);
  setClassCode('');
  setStudentName('');
  localStorage.setItem('current_classroom_id', data.classroom_id);
  localStorage.setItem('hasJoinedClass', 'true');  // ✅ Add this
  window.location.href = '/dashboard';  // ✅ Force reload
} else {
        alert(data.detail || 'Failed to join classroom');
      }
    } catch (err) {
      console.error(err);
      alert('Error joining classroom');
    }
  };
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #1a1a1a', borderTopColor: '#10a37f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: "'Inter', system-ui, sans-serif", padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ background: 'none', border: 'none', color: '#10a37f', cursor: 'pointer', marginBottom: '8px', fontSize: '14px' }}
            >
              ← Back to Dashboard
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: 0 }}>🏫 Classroom Mode</h1>
            <p style={{ color: '#888', marginTop: '4px' }}>Create a classroom for your students or join as a student</p>
          </div>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16,163,127,0.1)', padding: '6px 16px', borderRadius: '40px' }}>
              <span style={{ fontSize: '14px', color: '#10a37f' }}>👤 {user.email?.split('@')[0]}</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '12px 28px',
              backgroundColor: '#10a37f',
              border: 'none',
              borderRadius: '40px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ➕ Create Classroom (Teacher)
          </button>
          <button
            onClick={() => setShowJoinForm(true)}
            style={{
              padding: '12px 28px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '40px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            🔑 Join Classroom (Student)
          </button>
        </div>
        
        {/* My Classrooms (Teacher) */}
        {myClasses.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
               My Classrooms ({myClasses.length})
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {myClasses.map((cls) => (
                <div
                  key={cls._id}
                  onClick={() => router.push(`/dashboard/classroom/${cls._id}`)}
                  style={{
                    backgroundColor: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #333',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#222'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ color: '#fff', margin: '0 0 4px 0' }}>{cls.madrasa_name || 'My Classroom'}</h3>
                      <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
                        Code: <span style={{ color: '#10a37f', fontFamily: 'monospace', fontSize: '14px' }}>{cls.class_code}</span>
                      </p>
                      <p style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>
                        Students: {cls.students?.length || 0} · Created: {new Date(cls.created_at * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#10a37f' }}>View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Joined Classrooms (Student) */}
        {joinedClasses.length > 0 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
               My Classes ({joinedClasses.length})
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {joinedClasses.map((cls) => (
                <div
                  key={cls._id}
                  style={{
                    backgroundColor: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #333'
                  }}
                >
                  <div>
                    <h3 style={{ color: '#fff', margin: '0 0 4px 0' }}>{cls.madrasa_name || 'Classroom'}</h3>
                    <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
                      Teacher: {cls.teacher_name} · Subject: {cls.subject}
                    </p>
                    <p style={{ color: '#10a37f', fontSize: '11px', marginTop: '8px' }}>
                      You joined as: {cls.my_student_name}
                    </p>
                    <button
                      onClick={() => {
                        localStorage.setItem('current_classroom_id', cls._id);
                        router.push('/dashboard');                 
                          }}
                      style={{
                        marginTop: '12px',
                        padding: '6px 16px',
                        backgroundColor: '#10a37f',
                        border: 'none',
                        borderRadius: '20px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Start Debating →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {myClasses.length === 0 && joinedClasses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#1a1a1a', borderRadius: '24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏫</div>
            <h3 style={{ color: '#fff', marginBottom: '8px' }}>No classrooms yet</h3>
            <p style={{ color: '#888' }}>Create a classroom as a teacher or join one as a student</p>
          </div>
        )}
        
        {/* Create Form Modal */}
        {showCreateForm && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)'
          }}>
            <div style={{ backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '24px', width: '460px', maxWidth: '90%', border: '1px solid #333' }}>
              <h3 style={{ fontSize: '28px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Create Classroom</h3>
              <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>Set up a new learning space for your students</p>
              
              <input
                type="text"
                placeholder="Your Full Name (Teacher)"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                style={{ width: '100%', padding: '14px', marginBottom: '12px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10a37f'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
              <input
                type="text"
                placeholder="Madrasa/Institute Name"
                value={madrasaName}
                onChange={(e) => setMadrasaName(e.target.value)}
                style={{ width: '100%', padding: '14px', marginBottom: '12px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10a37f'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />

              {/* ✅ YAHAN COUNTRY DROPDOWN ADD KARO */}
<div style={{ marginBottom: '12px' }}>
  <select
    value={selectedCountry}
    onChange={handleCountryChange}
    style={{
      width: '100%',
      padding: '14px',
      backgroundColor: '#222',
      border: '1px solid #333',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '15px',
      outline: 'none'
    }}
    onFocus={(e) => e.target.style.borderColor = '#10a37f'}
    onBlur={(e) => e.target.style.borderColor = '#333'}
    disabled={loadingCountries}
  >
    <option value="">🌍 Select Country</option>
    {countries.map((country) => (
      <option key={country.iso2} value={country.iso2}>
        {country.name}
      </option>
    ))}
  </select>
  {loadingCountries && <p style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>Loading countries...</p>}
</div>

{/* ✅ YAHAN STATE DROPDOWN ADD KARO */}
{selectedCountry && (
  <div style={{ marginBottom: '12px' }}>
    <select
      value={selectedState}
      onChange={(e) => setSelectedState(e.target.value)}
      style={{
        width: '100%',
        padding: '14px',
        backgroundColor: '#222',
        border: '1px solid #333',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none'
      }}
      onFocus={(e) => e.target.style.borderColor = '#10a37f'}
      onBlur={(e) => e.target.style.borderColor = '#333'}
    >
      <option value="">📍 Select State / City</option>
      {states.map((state) => (
        <option key={state.iso2} value={state.name}>
          {state.name}
        </option>
      ))}
    </select>
  </div>
)}
              <input
                type="text"
                placeholder="Subject (optional)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', padding: '14px', marginBottom: '24px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10a37f'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={createClassroom} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #10a37f, #1a7f64)', border: 'none', borderRadius: '40px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Create Classroom</button>
                <button onClick={() => setShowCreateForm(false)} style={{ flex: 1, padding: '14px', background: '#222', border: '1px solid #333', borderRadius: '40px', color: '#fff', fontSize: '15px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        
       {/* Join Form Modal */}
{showJoinForm && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)'
  }}>
    <div style={{ backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '24px', width: '460px', maxWidth: '90%', border: '1px solid #333', maxHeight: '90vh', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '28px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Join Classroom</h3>
      <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>Enter the class code provided by your teacher</p>
      
      {/* 1. Class Code */}
      <input
        type="text"
        placeholder="Class Code (e.g., ABC123XYZ)"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
        style={{ width: '100%', padding: '14px', marginBottom: '12px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '12px', color: '#fff', fontSize: '18px', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '2px', outline: 'none' }}
        maxLength={8}
      />
      
      {/* 2. Your Full Name */}
      <input
        type="text"
        placeholder="Your Full Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        style={{ width: '100%', padding: '14px', marginBottom: '12px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none' }}
      />

     {/* 3. ✅ ARABIC LEVEL DROPDOWN - Full Name ke BAAD */}
<div style={{ marginBottom: '12px' }}>
  <select
    value={studentGrade}
    onChange={(e) => setStudentGrade(e.target.value)}
    style={{
      width: '100%',
      padding: '14px',
      backgroundColor: '#222',
      border: '1px solid #333',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '15px',
      outline: 'none'
    }}
  >
    <option value="">📚 Select Arabic Level</option>
    <option value="Arabic 1">Arabic 1</option>
    <option value="Arabic 2">Arabic 2</option>
    <option value="Arabic 3">Arabic 3</option>
    <option value="Arabic 4">Arabic 4</option>
    <option value="Arabic 5">Arabic 5</option>
    <option value="Arabic 6">Arabic 6</option>
    <option value="Arabic 7">Arabic 7</option>
    <option value="Other / Islamic Studies">📖 Other / Islamic Studies</option>  {/* ✅ ADD THIS LINE */}
  </select>
</div>

      {/* 4. ✅ COUNTRY DROPDOWN - Arabic Level ke BAAD */}
      <div style={{ marginBottom: '12px' }}>
        <select
          value={studentCountry}
          onChange={handleStudentCountryChange}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#222',
            border: '1px solid #333',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none'
          }}
        >
          <option value="">🌍 Select Country</option>
          {countries.map((country) => (
            <option key={country.iso2} value={country.iso2}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* 5. ✅ STATE DROPDOWN - Country ke BAAD (Sirf tab dikhega jab country select ho) */}
      {studentCountry && (
        <div style={{ marginBottom: '24px' }}>
          <select
            value={studentState}
            onChange={(e) => setStudentState(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#222',
              border: '1px solid #333',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '15px',
              outline: 'none'
            }}
          >
            <option value="">📍 Select State / City</option>
            {studentStatesList.map((state) => (
              <option key={state.iso2} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* 6. Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={joinClassroom} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #10a37f, #1a7f64)', border: 'none', borderRadius: '40px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Join Classroom</button>
        <button onClick={() => {
          setShowJoinForm(false);
          setClassCode('');
          setStudentName('');
          setStudentGrade('');
          setStudentCountry('');
          setStudentState('');
        }} style={{ flex: 1, padding: '14px', background: '#222', border: '1px solid #333', borderRadius: '40px', color: '#fff', fontSize: '15px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  </div>
)}

        {/* Premium Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001,
                backdropFilter: 'blur(8px)'
              }}
              onClick={() => setShowSuccessModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                style={{
                  background: 'linear-gradient(135deg, #121212 0%, #0a0a0a 100%)',
                  borderRadius: '32px',
                  padding: '48px',
                  width: '480px',
                  maxWidth: '90%',
                  border: '1px solid rgba(16,163,127,0.3)',
                  textAlign: 'center',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '40px'
                  }}
                >
                  🎉
                </motion.div>
                
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                  Classroom Created!
                </h2>
                <p style={{ color: '#888', marginBottom: '24px' }}>
                  {newClassName} is ready for your students
                </p>
                
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '32px',
                  border: '1px solid #333'
                }}>
                  <p style={{ color: '#888', fontSize: '12px', letterSpacing: '1px', marginBottom: '8px' }}>
                    CLASS CODE
                  </p>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    color: '#10a37f',
                    letterSpacing: '4px',
                    fontFamily: 'monospace',
                    background: '#0a0a0a',
                    padding: '16px',
                    borderRadius: '16px',
                    marginBottom: '16px'
                  }}>
                    {newClassCode}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newClassCode);
                      alert('✅ Class code copied!');
                    }}
                    style={{
                      background: 'rgba(16,163,127,0.15)',
                      border: '1px solid rgba(16,163,127,0.3)',
                      padding: '10px 20px',
                      borderRadius: '40px',
                      color: '#10a37f',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      width: '100%'
                    }}
                  >
                    📋 Copy Code
                  </button>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      const classroom = myClasses.find(c => c.class_code === newClassCode);
                      if (classroom && classroom._id) {
                        router.push(`/dashboard/classroom/${classroom._id}`);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'linear-gradient(135deg, #10a37f, #1a7f64)',
                      border: 'none',
                      borderRadius: '40px',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    View Classroom →
                  </button>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '40px',
                      color: '#fff',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

  
      </div>
    </div>
  );
}