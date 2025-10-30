// app/api/user/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDB } from '../../../util/db';
import User from '../../../models/User';
import { signToken } from '../../../util/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    await connectToDB();
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ message: 'User already exists' }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed });

    const token = signToken({ id: user._id, email: user.email });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

    return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
