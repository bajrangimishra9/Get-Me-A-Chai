"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AdminPayments = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();

      if (data.success) {
        setPayments(data.payments);
      } else {
        alert(data.message || "Unable to load payments");
      }
    } catch (error) {
      alert("Something went wrong while loading payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        setLoading(false);
        return;
      }

      fetchPayments();
    }
  }, [status, session]);

  const handleAction = async (paymentId, action) => {
    const res = await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId,
        action,
      }),
    });

    const data = await res.json();

    if (data.success) {
      fetchPayments();
    } else {
      alert(data.message || "Something went wrong");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading payments...
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-black text-white px-8 py-12">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-slate-400 mt-3">
          You are logged in as a normal user. Admin access is required.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Payment Verification</h1>
            <p className="text-slate-400 mt-2">
              Logged in as{" "}
              <span className="text-purple-400 font-bold">
                {session.user.role}
              </span>
            </p>
          </div>

          <button
            onClick={fetchPayments}
            className="bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-lg"
          >
            Refresh
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="bg-slate-900 rounded-xl p-8 text-slate-400">
            No payments found. Submit one payment from the profile page first.
          </div>
        ) : (
          <div className="space-y-5">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="bg-slate-900 border border-slate-700 rounded-xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2">
                    <p>
                      <span className="font-bold">Name:</span> {payment.name}
                    </p>

                    <p>
                      <span className="font-bold">Amount:</span> ₹
                      {payment.amount}
                    </p>

                    <p>
                      <span className="font-bold">Message:</span>{" "}
                      {payment.message || "No message"}
                    </p>

                    <p>
                      <span className="font-bold">UTR / Transaction ID:</span>{" "}
                      {payment.utr || "Not provided"}
                    </p>

                    <p>
                      <span className="font-bold">To User:</span>{" "}
                      {payment.to_user}
                    </p>

                    <p>
                      <span className="font-bold">Status:</span>{" "}
                      <span
                        className={`font-bold ${
                          payment.status === "verified"
                            ? "text-green-400"
                            : payment.status === "rejected"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </p>
                  </div>

                  {payment.status === "pending" ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(payment._id, "verify")}
                        className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg font-bold"
                      >
                        Verify
                      </button>

                      <button
                        onClick={() => handleAction(payment._id, "reject")}
                        className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      Already {payment.status}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;