// app/api/user/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDB } from '../../../util/db';
import User from '../../../models/User';
import { signToken } from '../../../util/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });

    await connectToDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: user._id, email: user.email });

    // Updated cookie API — must await cookies()
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

