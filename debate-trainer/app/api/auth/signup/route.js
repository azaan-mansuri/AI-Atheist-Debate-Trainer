import { NextResponse } from 'next/server';
import { createUser, createToken } from '../lib/auth.js';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    const user = await createUser(email, password);
    
    if (!user) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    const token = createToken(user.id, user.email);
    
    return NextResponse.json({ success: true, token, user });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}