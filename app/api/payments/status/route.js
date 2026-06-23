import { NextResponse } from "next/server";
import connectDb from "../../../../db/connectDb.js";
import Payment from "../../../../models/Payments.js";

export const dynamic = "force-dynamic";

const clean = (value) => String(value || "").trim();

export async function GET(request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const utr = clean(searchParams.get("utr"));

    if (!utr) {
      return NextResponse.json(
        { success: false, message: "UTR is required" },
        { status: 400 }
      );
    }

    const payment = await Payment.findOne({ utr }).lean();

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: {
        _id: payment._id.toString(),
        name: payment.name,
        amount: payment.amount,
        message: payment.message,
        utr: payment.utr,
        status: payment.status,
        done: payment.done,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}