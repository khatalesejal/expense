
import { NextResponse } from "next/server";
import { connectToDB } from "../../../util/db";
import Transaction from "../../../models/Transaction";
import { getUserFromCookie } from "../../../util/auth";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectToDB();

    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    let category = searchParams.get("category");

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // Trim and case-insensitive match
    category = category.trim();

    const transactions = await Transaction.find({
      category: new RegExp(`^${category}$`, "i"),   // ✅ case-insensitive match
      userId: new mongoose.Types.ObjectId(user.id)  // ✅ Correct user match
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.log("CATEGORY FILTER ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
