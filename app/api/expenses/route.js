// app/api/expenses/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/util/db';
import Expense from '@/app/models/Expense';
import { getUserFromCookie } from '@/app/util/auth';


export async function GET(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    await connectToDB();

    const url = new URL(req.url);
    const limit = Number(url.searchParams.get('limit') || 100);
    const skip = Number(url.searchParams.get('skip') || 0);
    const category = url.searchParams.get('category') || null;
    const type = url.searchParams.get('type') || null;
    const startDate = url.searchParams.get('startDate') || null;
    const endDate = url.searchParams.get('endDate') || null;

    const filter = { userId: user.id };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 }).skip(skip).limit(limit);
    return NextResponse.json({ expenses });
  } catch (err) {
    console.error('GET /expenses', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const { title, amount, category, date, note, type } = body;
    if (!title || !amount || !category || !date) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    await connectToDB();
    const expense = await Expense.create({
      userId: user.id,
      title,
      amount: Number(amount),
      category,
      date: new Date(date),
      note: note || '',
      type: type || 'expense',
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (err) {
    console.error('POST /expenses', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
