// app/api/expenses/id/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/util/db';
import Expense from '@/app/models/Expense';
import { getUserFromCookie } from '@/app/util/auth';
import mongoose from 'mongoose';

function getIdFromReq(req) {
  
  const parts = url.pathname.split('/');
  return parts[parts.length - 1];
}

export async function GET(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const id = getIdFromReq(req);
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

    await connectToDB();
    const expense = await Expense.findById(id);
    if (!expense) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    if (expense.userId.toString() !== user.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    return NextResponse.json({ expense });
  } catch (err) {
    console.error('GET /expenses/:id', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const id = getIdFromReq(req);
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

    const data = await req.json();
    await connectToDB();
    const expense = await Expense.findById(id);
    if (!expense) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    if (expense.userId.toString() !== user.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    expense.title = data.title ?? expense.title;
    expense.amount = data.amount !== undefined ? Number(data.amount) : expense.amount;
    expense.category = data.category ?? expense.category;
    expense.date = data.date ? new Date(data.date) : expense.date;
    expense.note = data.note ?? expense.note;
    expense.type = data.type ?? expense.type;

    await expense.save();
    return NextResponse.json({ expense });
  } catch (err) {
    console.error('PUT /expenses/:id', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const id = getIdFromReq(req);
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

    await connectToDB();
    const expense = await Expense.findById(id);
    if (!expense) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    if (expense.userId.toString() !== user.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    await expense.remove();
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /expenses/:id', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
