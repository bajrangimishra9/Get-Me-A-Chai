import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import connectDb from "../../../../db/connectDb.js";
import User from "../../../../models/User.js";

const getRoleByEmail = (email) => {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email?.toLowerCase()) ? "admin" : "user";
};

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        await connectDb();

        const loginEmail = user.email;
        const role = getRoleByEmail(loginEmail);

        const currentUser = await User.findOne({
          $or: [{ loginEmail }, { email: loginEmail }],
        });

        if (!currentUser) {
          const newUser = new User({
            loginEmail,
            email: user.email,
            name: user.name || profile?.name || "GitHub User",
            username: profile?.login || user.email.split("@")[0],
            profilepic: user.image,
            coverpic: "/background.png",
            upiqr: "/upi-qr.png",
            razorpayid: "",
            razorpaysecret: "",
            role,
          });

          await newUser.save();
        } else {
          await User.findByIdAndUpdate(currentUser._id, {
            loginEmail: currentUser.loginEmail || loginEmail,
            role,
            username:
              currentUser.username || profile?.login || user.email.split("@")[0],
            profilepic: currentUser.profilepic || user.image,
            coverpic: currentUser.coverpic || "/background.png",
            upiqr: currentUser.upiqr || "/upi-qr.png",
          });
        }
      }

      return true;
    },

    async session({ session }) {
      await connectDb();

      const providerEmail = session.user.email;

      const dbUser = await User.findOne({
        $or: [{ loginEmail: providerEmail }, { email: providerEmail }],
      });

      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.loginEmail = dbUser.loginEmail || providerEmail;
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
        session.user.username = dbUser.username;
        session.user.image = dbUser.profilepic;
        session.user.coverpic = dbUser.coverpic;
        session.user.upiqr = dbUser.upiqr;
        session.user.role = dbUser.role || "user";
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
