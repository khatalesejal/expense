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
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const transactions = await Transaction.find({ category, userId: user.id });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.log("CATEGORY FILTER ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
