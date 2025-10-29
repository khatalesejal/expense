import { NextResponse } from "next/server";
import Transaction from "../../../models/Transaction";
import getUserFromCookie from "../../../util/auth";
import { connectToDB } from "../../../util/db";


export async function GET() {
  try {
    await connectToDB();
    const user = await getUserFromCookie();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const transactions = await Transaction.find({ userId: user.id }).sort({ date: -1 });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
