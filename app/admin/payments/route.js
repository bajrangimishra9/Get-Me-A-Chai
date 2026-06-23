import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route.js";
import connectDb from "../../../../db/connectDb.js";
import Payment from "../../../../models/Payments.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can access payments",
        },
        { status: 403 }
      );
    }

    await connectDb();

    const payments = await Payment.find({})
      .sort({
        status: 1,
        amount: -1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      payments: payments.map((payment) => ({
        ...payment,
        _id: payment._id.toString(),
      })),
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

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can verify payments",
        },
        { status: 403 }
      );
    }

    await connectDb();

    const body = await request.json();
    const { paymentId, action } = body;

    if (!paymentId || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "paymentId and action are required",
        },
        { status: 400 }
      );
    }

    if (!["verify", "reject"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action",
        },
        { status: 400 }
      );
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: action === "verify" ? "verified" : "rejected",
        done: action === "verify",
      },
      {
        new: true,
      }
    );

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment,
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