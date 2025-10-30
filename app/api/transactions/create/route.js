import { NextResponse } from "next/server";
import { connectToDB } from "../../../util/db";
import Transaction from "../../../models/Transaction";
import { getUserFromCookie } from "../../../util/auth"; 

export async function POST(req) {
  try {
    await connectToDB();

    //  Get logged-in user from cookie
    const user = await getUserFromCookie();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, amount, type, category, date, note } = body;

    // Required Field Validation
    if (!title || !amount || !type || !category || !date) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // Create Transaction
    const newTransaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date: new Date(date),
      note: note || "",
      userId: user.id, 
    });

    return NextResponse.json(
      { message: "Transaction create successfully", transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.log("ADD TRANSACTION ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
