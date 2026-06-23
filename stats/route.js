import { NextResponse } from "next/server";
import connectDb from "../../../db/connectDb.js";
import User from "../../../models/User.js";
import Payment from "../../../models/Payments.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb();

    const usersConnected = await User.countDocuments({});

    const paymentStats = await Payment.aggregate([
      {
        $match: {
          status: "verified",
          done: true,
        },
      },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalFunds: { $sum: "$amount" },
        },
      },
    ]);

    const stats = paymentStats[0] || {
      totalPayments: 0,
      totalFunds: 0,
    };

    return NextResponse.json({
      success: true,
      usersConnected,
      paymentsMade: stats.totalPayments,
      fundsRaised: stats.totalFunds,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}