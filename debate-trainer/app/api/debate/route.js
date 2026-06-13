import { NextResponse } from 'next/server';

const API_URL = ''; 

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    const response = await fetch(`${API_URL}/api/debate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    
    const data = await response.json();
    return NextResponse.json({ reply: data.reply });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      reply: 'Backend connection failed. Make sure Python server is running' 
    });
  }
}