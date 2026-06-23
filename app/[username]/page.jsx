"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const GLOBAL_SUPPORTERS_KEY = "global";

const OLD_SUPPORTER_BUCKETS = [
  "global",
  "bajrangimishra9",
  "saransh-mishra-git",
  "settings",
];

const Username = () => {
  const params = useParams();

  const username =
    typeof params.username === "string"
      ? params.username
      : params.username?.[0];

  const [userData, setUserData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const [stats, setStats] = useState({
    usersConnected: 0,
    paymentsMade: 0,
    fundsRaised: 0,
  });

  const [form, setForm] = useState({
    name: "",
    message: "",
    amount: "",
    utr: "",
  });

  const [showQr, setShowQr] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [submittedForVerification, setSubmittedForVerification] =
    useState(false);

  const [toast, setToast] = useState(null);
  const [pendingUtr, setPendingUtr] = useState("");

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      const data = await res.json();

      if (data.success) {
        setStats({
          usersConnected: data.usersConnected || 0,
          paymentsMade: data.paymentsMade || 0,
          fundsRaised: data.fundsRaised || 0,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    if (!username) return;

    try {
      const res = await fetch(
        `/api/user?username=${encodeURIComponent(username)}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      if (data.success && data.user) {
        setUserData(data.user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);

      const buckets = [
        ...OLD_SUPPORTER_BUCKETS,
        username,
        userData?.username,
      ].filter(Boolean);

      const uniqueBuckets = [...new Set(buckets)];

      const results = await Promise.all(
        uniqueBuckets.map(async (bucket) => {
          try {
            const res = await fetch(
              `/api/payments?to_user=${encodeURIComponent(bucket)}`,
              { cache: "no-store" }
            );

            const data = await res.json();

            if (data.success && Array.isArray(data.payments)) {
              return data.payments;
            }

            return [];
          } catch (error) {
            return [];
          }
        })
      );

      const mergedPayments = results.flat();

      const uniquePayments = Array.from(
        new Map(
          mergedPayments.map((payment) => [
            String(payment._id || payment.oid || payment.utr),
            payment,
          ])
        ).values()
      );

      const sortedPayments = uniquePayments.sort(
        (a, b) =>
          Number(b.amount) - Number(a.amount) ||
          new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPayments(sortedPayments);
    } catch (error) {
      console.log(error);
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, [username]);

  useEffect(() => {
    fetchPayments();
  }, [username, userData?.username]);

  useEffect(() => {
    const savedUtr = localStorage.getItem("pending-payment-utr");

    if (savedUtr) {
      setPendingUtr(savedUtr);
    }
  }, []);

  useEffect(() => {
    if (!pendingUtr) return;

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(
          `/api/payments/status?utr=${encodeURIComponent(pendingUtr)}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (!data.success || !data.payment) return;

        if (data.payment.status === "verified" && data.payment.done === true) {
          showToast(
            "success",
            "Payment successful. Thank you for your support!"
          );

          localStorage.removeItem("pending-payment-utr");
          setPendingUtr("");
          setSubmittedForVerification(false);

          await fetchPayments();
          await fetchStats();
        }

        if (data.payment.status === "rejected") {
          showToast(
            "error",
            "Payment failed or rejected. Please check your UTR and try again."
          );

          localStorage.removeItem("pending-payment-utr");
          setPendingUtr("");
          setSubmittedForVerification(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkPaymentStatus();

    const interval = setInterval(checkPaymentStatus, 5000);

    return () => clearInterval(interval);
  }, [pendingUtr]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectAmount = (amount) => {
    setForm((prev) => ({
      ...prev,
      amount: String(amount),
    }));
  };

  const handlePay = () => {
    if (!form.name.trim()) {
      showToast("error", "Please enter your name.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      showToast("error", "Please enter or select amount.");
      return;
    }

    setShowQr(true);
    setSubmittedForVerification(false);
  };

  const handleSubmitForVerification = async () => {
    if (!form.utr.trim()) {
      showToast("error", "Please enter UTR / Transaction ID.");
      return;
    }

    try {
      setSavingPayment(true);

      const submittedUtr = form.utr.trim();

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          message: form.message.trim(),
          amount: form.amount,
          utr: submittedUtr,
          to_user: GLOBAL_SUPPORTERS_KEY,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowQr(false);
        setSubmittedForVerification(true);

        localStorage.setItem("pending-payment-utr", submittedUtr);
        setPendingUtr(submittedUtr);

        setForm({
          name: "",
          message: "",
          amount: "",
          utr: "",
        });

        showToast(
          "pending",
          "Payment submitted for verification. Waiting for admin approval."
        );

        await fetchPayments();
        await fetchStats();
      } else {
        showToast("error", data.message || "Payment could not be submitted.");
      }
    } catch (error) {
      showToast("error", "Something went wrong.");
    } finally {
      setSavingPayment(false);
    }
  };

  const profilepic = userData?.profilepic || "/Chai-gif.webp";
  const coverpic = userData?.coverpic || "/background.png";
  const upiqr = userData?.upiqr || "/upi-qr.png";
  const displayUsername = userData?.username || username;

  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden pb-16">
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <div
            className={`min-w-[300px] max-w-[420px] rounded-xl px-5 py-4 shadow-lg border ${toast.type === "success"
              ? "bg-green-100 text-green-900 border-green-300"
              : toast.type === "error"
                ? "bg-red-100 text-red-900 border-red-300"
                : "bg-white text-slate-800 border-slate-300"
              }`}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-medium">{toast.message}</p>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-xl leading-none opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full">
        <div className="relative w-full aspect-[4/1.1] overflow-hidden bg-black">
          <img
            src={coverpic}
            alt="cover"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="absolute left-1/2 bottom-0 z-20 -translate-x-1/2 translate-y-1/2">
          <img
            src={profilepic}
            alt="profile"
            className="h-24 w-24 rounded-full border-4 border-black object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 pt-16 px-4 text-center">
        <div className="font-bold text-xl text-white">@{displayUsername}</div>

        <div className="text-slate-400 text-lg">
          Creating common place for Chai Lovers
        </div>

        <div className="text-slate-400 text-lg">
          {stats.usersConnected}{" "}
          {stats.usersConnected === 1 ? "user" : "users"} connected .{" "}
          {stats.paymentsMade}{" "}
          {stats.paymentsMade === 1 ? "payment" : "payments"} made . ₹
          {stats.fundsRaised} funds raised
        </div>

        {submittedForVerification && (
          <div className="mt-3 rounded-lg bg-yellow-900/50 text-yellow-300 px-4 py-2">
            Payment submitted for verification ⏳
          </div>
        )}
      </div>

      <div className="payment flex flex-col md:flex-row items-start gap-6 w-[80%] mx-auto mt-14">
        <div className="comments flex-1 bg-slate-900 rounded-lg text-white p-8 md:p-10 h-[580px] flex flex-col overflow-hidden">
          <h2 className="text-3xl font-bold mb-8 shrink-0">Supporters</h2>

          {loadingPayments ? (
            <p className="text-slate-400">Loading supporters...</p>
          ) : payments.length === 0 ? (
            <p className="text-slate-400">
              No verified supporters yet. Be the first one to support.
            </p>
          ) : (
            <div
              className="
                flex-1 min-h-0 overflow-y-auto pr-4
                [scrollbar-width:thin]
                [scrollbar-color:#475569_#0f172a]
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-slate-900
                [&::-webkit-scrollbar-thumb]:bg-slate-600
                [&::-webkit-scrollbar-thumb]:rounded-full
              "
            >
              <ul className="space-y-6 text-slate-300">
                {payments.slice(0, 10).map((payment) => (
                  <li key={payment._id} className="flex items-start gap-4">
                    <img
                      src="/avatar.gif"
                      alt="avatar"
                      className="h-7 w-7 rounded-full object-cover mt-1 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="leading-relaxed break-words">
                          <span className="font-bold text-white">
                            {payment.name}:
                          </span>{" "}
                          <span className="text-slate-200">
                            ₹{payment.amount}
                          </span>
                        </p>

                        <span className="text-xs rounded-full bg-green-900/50 text-green-300 px-3 py-1 shrink-0">
                          Verified
                        </span>
                      </div>

                      {payment.message && (
                        <p className="mt-2 leading-relaxed text-slate-300 break-words">
                          {payment.message}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="makePayment flex-1 bg-slate-900 rounded-lg text-white p-8 md:p-10 min-h-[580px]">
          <h2 className="text-3xl font-bold mb-8">Make a Payment</h2>

          <div className="flex gap-3 flex-col">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-slate-800 outline-none"
              placeholder="Enter Name"
            />

            <input
              type="text"
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-slate-800 outline-none"
              placeholder="Enter Message"
            />

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-slate-800 outline-none"
              placeholder="Enter Amount"
            />

            <button
              type="button"
              onClick={handlePay}
              className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-4 text-center mt-2"
            >
              Pay
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            {[10, 20, 30].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => selectAmount(amount)}
                className={`p-4 rounded-lg transition ${Number(form.amount) === amount
                  ? "bg-purple-700 ring-2 ring-purple-400"
                  : "bg-slate-800 hover:bg-slate-700"
                  }`}
              >
                Pay ₹{amount}
              </button>
            ))}
          </div>

          <p className="text-slate-400 text-sm mt-6 leading-relaxed break-words">
            After payment, enter your UTR / Transaction ID. Your support will
            appear on all profile pages after admin verification.
          </p>
        </div>
      </div>

      {showQr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 text-white p-8 relative border border-slate-700">
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-2">
              Scan & Pay ₹{form.amount}
            </h2>

            <p className="text-center text-slate-400 mb-6">
              Scan this QR using any UPI app.
            </p>

            <div className="bg-white rounded-xl p-4">
              <img
                src={upiqr}
                alt="UPI QR Code"
                className="w-full max-w-[260px] mx-auto"
              />
            </div>

            <div className="mt-5">
              <label className="block mb-2 font-semibold">
                Enter UTR / Transaction ID
              </label>

              <input
                type="text"
                name="utr"
                value={form.utr}
                onChange={handleChange}
                placeholder="Example: 412345678901"
                className="w-full p-3 rounded-lg bg-slate-800 outline-none"
              />
            </div>

            <p className="text-sm text-slate-400 text-center mt-5">
              Your payment will appear in Supporters only after admin approval.
            </p>

            <button
              type="button"
              onClick={handleSubmitForVerification}
              disabled={savingPayment}
              className="w-full mt-5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 px-5 py-3 font-bold"
            >
              {savingPayment ? "Submitting..." : "Submit for verification"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Username;