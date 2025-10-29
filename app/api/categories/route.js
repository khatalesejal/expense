// app/api/categories/route.js

import { NextResponse } from 'next/server';
import { connectToDB } from '../../util/db';
import Expense from '../../models/Expense';
import mongoose from 'mongoose';
import { getUserFromCookie } from '../../util/auth';
import Category from '../../models/Category';

export async function GET() {
  try {
    await connectToDB();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('GET /categories', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const { name } = await req.json();
    if (!name) return NextResponse.json({ message: 'Missing name' }, { status: 400 });

    await connectToDB();
    const existing = await Category.findOne({ name });
    if (existing) return NextResponse.json({ message: 'Category exists' }, { status: 409 });

    const category = await Category.create({ name, userId: user.id });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error('POST /categories', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
