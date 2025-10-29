import { NextResponse } from "next/server";
import { connectToDB } from "../../../util/db";
import Transaction from "../../../models/Transaction";
import { getUserFromCookie } from "../../../util/auth";

export async function GET() {
  try {
    await connectToDB();
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Category-wise totals (Pie Chart)
    const categorySummary = await Transaction.aggregate([
      { $match: { userId: user.id } },
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } }
    ]);

    // ✅ Monthly totals (Bar Chart)
    const monthlySummary = await Transaction.aggregate([
      { $match: { userId: user.id } },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    return NextResponse.json({
      categorySummary,
      monthlySummary
    }, { status: 200 });

  } catch (error) {
    console.log("SUMMARY ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
