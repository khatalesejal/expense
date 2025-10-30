import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '../models/User';
import { connectToDB } from './db';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) throw new Error('JWT_SECRET is required in env');

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function getUserFromCookie() {
  try {
    const cookieStore = await cookies();  
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const payload = verifyToken(token);

    await connectToDB();

    const user = await User.findById(payload.id).select('-password');
    if (!user) return null;

    return { id: user._id.toString(), email: user.email, name: user.name };
  } catch (err) {
    console.warn('getUserFromCookie error', err?.message || err);
    return null;
  }
}

export default getUserFromCookie;
