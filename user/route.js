import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route.js";
import connectDb from "../../../db/connectDb.js";
import User from "../../../models/User.js";

export const dynamic = "force-dynamic";

const clean = (value) => String(value || "").trim();

const normalizeUsername = (value) => {
  return clean(value)
    .toLowerCase()
    .replaceAll(" ", "_")
    .replace(/[^a-z0-9_-]/g, "");
};

export async function GET(request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const username = clean(searchParams.get("username"));

    if (username) {
      const user = await User.findOne({ username }).lean();

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          username: user.username,
          profilepic: user.profilepic,
          coverpic: user.coverpic,
          upiqr: user.upiqr,
        },
      });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await User.findOne({
      $or: [
        { loginEmail: session.user.loginEmail || session.user.email },
        { email: session.user.email },
      ],
    }).lean();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Current user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        name: currentUser.name,
        email: currentUser.email,
        username: currentUser.username,
        profilepic: currentUser.profilepic,
        coverpic: currentUser.coverpic,
        upiqr: currentUser.upiqr,
        razorpayid: currentUser.razorpayid || "",
        razorpaysecret: currentUser.razorpaysecret || "",
        role: currentUser.role || "user",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await User.findOne({
      $or: [
        { loginEmail: session.user.loginEmail || session.user.email },
        { email: session.user.email },
      ],
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Current user not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const name = clean(body.name);
    const email = clean(body.email).toLowerCase();
    const username = normalizeUsername(body.username);
    const profilepic = clean(body.profilepic);
    const coverpic = clean(body.coverpic);
    const upiqr = clean(body.upiqr);
    const razorpayid = clean(body.razorpayid);
    const razorpaysecret = clean(body.razorpaysecret);

    if (!name || !email || !username) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and username are required",
        },
        { status: 400 }
      );
    }

    const duplicateName = await User.findOne({
      _id: { $ne: currentUser._id },
      name,
    });

    if (duplicateName) {
      return NextResponse.json(
        {
          success: false,
          field: "name",
          message: "This name already exists. Please use another name.",
        },
        { status: 409 }
      );
    }

    const duplicateEmail = await User.findOne({
      _id: { $ne: currentUser._id },
      email,
    });

    if (duplicateEmail) {
      return NextResponse.json(
        {
          success: false,
          field: "email",
          message: "This email already exists. Please use another email.",
        },
        { status: 409 }
      );
    }

    const duplicateUsername = await User.findOne({
      _id: { $ne: currentUser._id },
      username,
    });

    if (duplicateUsername) {
      return NextResponse.json(
        {
          success: false,
          field: "username",
          message: "This username already exists. Please use another username.",
        },
        { status: 409 }
      );
    }

    currentUser.name = name;
    currentUser.email = email;
    currentUser.username = username;
    currentUser.profilepic = profilepic || "/Chai-gif.webp";
    currentUser.coverpic = coverpic || "/background.png";
    currentUser.upiqr = upiqr || "/upi-qr.png";
    currentUser.razorpayid = razorpayid;
    currentUser.razorpaysecret = razorpaysecret;

    await currentUser.save();

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully",
      user: {
        name: currentUser.name,
        email: currentUser.email,
        username: currentUser.username,
        profilepic: currentUser.profilepic,
        coverpic: currentUser.coverpic,
        upiqr: currentUser.upiqr,
        razorpayid: currentUser.razorpayid || "",
        razorpaysecret: currentUser.razorpaysecret || "",
        role: currentUser.role || "user",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}