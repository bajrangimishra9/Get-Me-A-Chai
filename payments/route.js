import { NextResponse } from "next/server";
import connectDb from "../../../db/connectDb.js";
import Payment from "../../../models/Payments.js";

export const dynamic = "force-dynamic";

const clean = (value) => String(value || "").trim();

export async function GET(request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const to_user = clean(searchParams.get("to_user"));

    if (!to_user) {
      return NextResponse.json(
        { success: false, message: "to_user is required" },
        { status: 400 }
      );
    }

    const allVerifiedPayments = await Payment.find({
      status: "verified",
      done: true,
    })
      .sort({
        amount: -1,
        createdAt: -1,
      })
      .lean();

    const payments = allVerifiedPayments.filter(
      (payment) =>
        clean(payment.to_user).toLowerCase() === to_user.toLowerCase()
    );

    return NextResponse.json({
      success: true,
      to_user,
      count: payments.length,
      payments: payments.map((payment) => ({
        ...payment,
        _id: payment._id.toString(),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDb();

    const body = await request.json();

    const name = clean(body.name);
    const message = clean(body.message);
    const amount = Number(body.amount);
    const to_user = clean(body.to_user);
    const utr = clean(body.utr);

    if (!name || !amount || !to_user || !utr) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, amount, to_user, and UTR are required",
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    const existingPayment = await Payment.findOne({
      utr,
    }).lean();

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          message: "This UTR / Transaction ID has already been submitted",
        },
        { status: 409 }
      );
    }

    const payment = await Payment.create({
      name,
      message,
      amount,
      to_user,
      utr,
      oid: `upi_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      status: "pending",
      done: false,
    });

    return NextResponse.json({
      success: true,
      payment,
      message: "Payment submitted for verification",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}