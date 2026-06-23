import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About GetMeAChai
          </h1>

          <p className="mx-auto max-w-3xl text-lg md:text-xl text-slate-400 leading-relaxed">
            GetMeAChai is a simple and friendly platform where creators,
            developers, students, and chai lovers can receive support from their
            audience through small contributions.
          </p>

          <div className="mt-10">
            <Link href="/login">
              <button className="rounded-lg bg-gradient-to-br from-purple-700 to-blue-700 px-8 py-4 font-bold hover:from-purple-800 hover:to-blue-800 transition">
                Start Your Page
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-2xl bg-slate-900 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-5">Our Mission</h2>

              <p className="text-slate-400 leading-relaxed text-lg">
                Our mission is to make online support easy, transparent, and
                personal. Whether someone enjoys your work, wants to appreciate
                your effort, or simply wants to buy you a chai, GetMeAChai helps
                them do that in a clean and meaningful way.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-8">
              <h3 className="text-2xl font-bold mb-4">Why GetMeAChai?</h3>

              <ul className="space-y-4 text-slate-300">
                <li>✅ Easy profile setup for creators</li>
                <li>✅ Public supporter list to build trust</li>
                <li>✅ UPI QR based payment support</li>
                <li>✅ Admin verification before payments appear publicly</li>
                <li>✅ Clean dashboard to manage profile and payment details</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What You Can Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-900 p-8">
              <div className="text-4xl mb-5">☕</div>
              <h3 className="text-2xl font-bold mb-3">Receive Support</h3>
              <p className="text-slate-400 leading-relaxed">
                Let your audience support you with small chai contributions and
                personal messages.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 p-8">
              <div className="text-4xl mb-5">📊</div>
              <h3 className="text-2xl font-bold mb-3">Show Engagement</h3>
              <p className="text-slate-400 leading-relaxed">
                Display verified supporters, total payments, connected users,
                and funds raised to build credibility.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 p-8">
              <div className="text-4xl mb-5">🔐</div>
              <h3 className="text-2xl font-bold mb-3">Verify Payments</h3>
              <p className="text-slate-400 leading-relaxed">
                Payments appear publicly only after admin approval, keeping the
                supporter list genuine and trustworthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-2xl bg-slate-900 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-xl bg-slate-800 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 font-bold">
                1
              </div>
              <h3 className="font-bold mb-2">Login</h3>
              <p className="text-slate-400 text-sm">
                Sign in and open your dashboard.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 font-bold">
                2
              </div>
              <h3 className="font-bold mb-2">Setup Profile</h3>
              <p className="text-slate-400 text-sm">
                Add your username, cover image, profile image, and UPI QR.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 font-bold">
                3
              </div>
              <h3 className="font-bold mb-2">Share Page</h3>
              <p className="text-slate-400 text-sm">
                Share your public profile link with your audience.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 font-bold">
                4
              </div>
              <h3 className="font-bold mb-2">Get Support</h3>
              <p className="text-slate-400 text-sm">
                Supporters pay, submit UTR, and verified payments appear on the
                page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-purple-900 to-blue-900 p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Ready to get your first chai?
          </h2>

          <p className="text-slate-200 mb-8 text-lg">
            Create your page, share it with your audience, and start receiving
            support in a simple and transparent way.
          </p>

          <Link href="/login">
            <button className="rounded-lg bg-white px-8 py-4 font-bold text-black hover:bg-slate-200 transition">
              Create Your Page
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;

export const metadata = {
  title: "About",
  description: "Learn more about Get me a Chai.",
};