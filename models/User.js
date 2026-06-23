import mongoose from "mongoose";

const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    loginEmail: { type: String },
    email: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String },
    profilepic: { type: String },
    coverpic: { type: String },
    upiqr: { type: String },
    razorpayid: { type: String },
    razorpaysecret: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;