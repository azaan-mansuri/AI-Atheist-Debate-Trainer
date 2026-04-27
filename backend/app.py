from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== FILE-BASED USER STORAGE ==========
USERS_FILE = "users.json"

def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_users(users_data):
    with open(USERS_FILE, 'w') as f:
        json.dump(users_data, f, indent=2)

# Load existing users
users = load_users()

# ========== SIMPLE & CLEAR PROMPTS IN 4 LANGUAGES ==========
PROMPTS = {
    'ur-PK': '''
آپ ایک ڈیبیٹ کوچ ہیں۔ بہت آسان اور صاف اردو میں جواب دیں۔

آپ کے دو کام ہیں:
1) ملحد کا کردار - ایک چھوٹا سا اعتراض پیش کریں
2) کوچ کا کردار - صارف کے جواب کی تشخیص کریں

جب کوچ کا کردار ہو تو یہ فارمیٹ استعمال کریں:

نمبر: X/10

اچھا کیا:
- (2 سے 3 چھوٹی باتیں)

غلط کیا:
- (2 سے 3 چھوٹی باتیں)

بہتر جواب:
- (ایک چھوٹا سا بہتر جواب)

اگلا سوال:
- (ایک چھوٹا سا اعتراض)

ہدایات:
- بہت چھوٹے جواب دیں
- مشکل الفاظ استعمال نہ کریں
- ہر بار صرف ایک اعتراض پوچھیں
- احترام سے بات کریں
''',

    'hi-IN': '''
आप एक डिबेट कोच हैं। बहुत आसान और साफ हिंदी में जवाब दें।

आपके दो काम हैं:
1) नास्तिक का किरदार - एक छोटा सा एतराज पेश करें
2) कोच का किरदार - उपयोगकर्ता के जवाब की जांच करें

जब कोच का किरदार हो तो यह फॉर्मेट इस्तेमाल करें:

स्कोर: X/10

अच्छा किया:
- (2 से 3 छोटी बातें)

गलत किया:
- (2 से 3 छोटी बातें)

बेहतर जवाब:
- (एक छोटा सा बेहतर जवाब)

अगला सवाल:
- (एक छोटा सा एतराज)

हिदायतें:
- बहुत छोटे जवाब दें
- मुश्किल शब्द इस्तेमाल न करें
- हर बार सिर्फ एक एतराज पूछें
- इज़्ज़त से बात करें
''',

    'en-US': '''
You are an AI Debate Coach. Give very simple and clear answers.

Your two roles:
1) Atheist role - ask ONE short objection
2) Coach role - evaluate user's response

When you are Coach, use this format:

Score: X/10

Good:
- (2 to 3 short points)

Bad:
- (2 to 3 short points)

Better Answer:
- (one short improved answer)

Next Question:
- (one short objection)

Rules:
- Keep answers VERY SHORT
- Use simple words only
- Ask only ONE objection at a time
- Be respectful
''',

    'ar-SA': '''
أنت مدرب مناظرة بالذكاء الاصطناعي. أجب بلغة عربية بسيطة وواضحة جداً.

وظيفتان:
1) دور الملحد - اطرح اعتراضاً واحداً قصيراً
2) دور المدرب - قيم رد المستخدم

عندما تكون مدرباً، استخدم هذا التنسيق:

النتيجة: X/10

الجيد:
- (نقطتان إلى ثلاث نقاط قصيرة)

السيئ:
- (نقطتان إلى ثلاث نقاط قصيرة)

إجابة أفضل:
- (إجابة قصيرة محسنة واحدة)

السؤال التالي:
- (اعتراض قصير واحد)

القواعد:
- أجب بإجابات قصيرة جداً
- استخدم كلمات بسيطة فقط
- اطرح اعتراضاً واحداً فقط في كل مرة
- كن محترماً
'''
}

class DebateRequest(BaseModel):
    messages: list

class DebateResponse(BaseModel):
    reply: str

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# GROQ API Setup
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("⚠️ WARNING: GROQ_API_KEY not found in environment variables!")
    GROQ_API_KEY = ""  # Empty fallback

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

def detect_language(messages):
    """Detect selected language from user's first message"""
    if messages and len(messages) > 0:
        content = messages[0].get('content', '').lower()
        if 'language: ur-pk' in content or 'ur-pk' in content:
            return 'ur-PK'
        elif 'language: hi-in' in content or 'hi-in' in content:
            return 'hi-IN'
        elif 'language: ar-sa' in content or 'ar-sa' in content:
            return 'ar-SA'
    return 'en-US'

@app.post("/api/debate")
async def debate(request: DebateRequest):
    try:
        language = detect_language(request.messages)
        system_prompt = PROMPTS.get(language, PROMPTS['en-US'])
        
        # Always use Llama for best results
        model = "llama-3.3-70b-versatile"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        *request.messages
                    ],
                    "temperature": 0.5,
                },
                timeout=60.0
            )
            
            if response.status_code == 200:
                data = response.json()
                reply = data["choices"][0]["message"]["content"]
                return DebateResponse(reply=reply)
            else:
                raise HTTPException(status_code=500, detail=f"Groq API error: {response.text}")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Debate AI Backend is running! Simple & Clear Responses"}

# ========== AUTHENTICATION APIs ==========

@app.post("/api/auth/signup")
async def signup(request: SignupRequest):
    global users
    # Check if user exists
    for user in users:
        if user.get('email') == request.email:
            raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user (plain text password for demo - use hashing in production)
    new_user = {
        "id": len(users) + 1,
        "email": request.email,
        "password": request.password  # In production, hash this!
    }
    users.append(new_user)
    save_users(users)  # Save to file
    
    return {
        "success": True,
        "token": f"fake_jwt_token_{new_user['id']}",
        "user": {"id": new_user["id"], "email": new_user["email"]}
    }

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    # Find user
    for user in users:
        if user.get('email') == request.email and user.get('password') == request.password:
            return {
                "success": True,
                "token": f"fake_jwt_token_{user['id']}",
                "user": {"id": user["id"], "email": user["email"]}
            }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/logout")
async def logout():
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)