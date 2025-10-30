import { NextResponse } from "next/server";
import { connectToDB } from "../../../util/db";
import Transaction from "../../../models/Transaction";
import { getUserFromCookie } from "../../../util/auth";

export async function GET(req) {
  try {
    await connectToDB();
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); 
    const year = searchParams.get("year");  

    if (!month || !year) {
      return NextResponse.json({ error: "Month and Year are required" }, { status: 400 });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const transactions = await Transaction.find({
      userId: user.id,
      date: { $gte: start, $lt: end }
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.log("MONTH FILTER ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
