// app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from '../../util/db';
import Transaction from '../../models/Transaction';
import mongoose from 'mongoose';
import { getUserFromCookie } from '../../util/auth';


export async function GET() {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    await connectToDB();
    const userId = new mongoose.Types.ObjectId(user.id);

    // Category breakdown
    const categories = await Transaction.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    // Monthly totals for last 6 months
const now = new Date();
const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
const monthly = await Transaction.aggregate([
  { $match: { userId, createdAt: { $gte: start } } },
  { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: '$amount' } } },
  { $sort: { _id: 1 } },
]);


    // totals by type
    const totalsAgg = await Transaction.aggregate([
      { $match: { userId } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);
    const totals = { income: 0, expense: 0 };
    totalsAgg.forEach(t => {
      totals[t._id] = t.total;
    });

    return NextResponse.json({ categories, monthly, totals });
  } catch (err) {
    console.error('GET /dashboard', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
