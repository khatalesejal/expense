import { NextResponse } from "next/server";
import { connectToDB } from "../../../util/db";
import Transaction from "../../../models/Transaction";
import getUserFromCookie from "../../../util/auth";

// UPDATE Transaction
export async function PUT(req, context) {
  try {
    const { params } = context;
    const { id } = await params; 

    await connectToDB();
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: user.id },
      body,
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// DELETE Transaction
export async function DELETE(req, context) {
  try {
    const { params } = context;
    const { id } = await params; 

    await connectToDB();
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await Transaction.findOneAndDelete({ _id: id, userId: user.id });

    return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
