import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    const response = await fetch('http://localhost:8001/api/debate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    
    const data = await response.json();
    return NextResponse.json({ reply: data.reply });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      reply: 'Backend connection failed. Make sure Python server is running on port 8001' 
    });
  }
}