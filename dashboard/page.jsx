"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    profilepic: "",
    coverpic: "",
    upiqr: "",
    razorpayid: "",
    razorpaysecret: "",
  });

  const [savedData, setSavedData] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 5000);
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/user", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success && data.user) {
        const userDetails = {
          name: data.user.name || "",
          email: data.user.email || "",
          username: data.user.username || "",
          profilepic: data.user.profilepic || "/Chai-gif.webp",
          coverpic: data.user.coverpic || "/background.png",
          upiqr: data.user.upiqr || "/upi-qr.png",
          razorpayid: data.user.razorpayid || "",
          razorpaysecret: data.user.razorpaysecret || "",
        };

        setForm(userDetails);
        setSavedData(userDetails);

        // If user already has saved details, show preview first.
        // Click Edit to change them.
        setIsEditing(false);
      } else {
        showMessage("error", data.message || "Unable to load user details");
        setIsEditing(true);
      }
    } catch (error) {
      showMessage("error", "Something went wrong while loading details");
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (status === "authenticated") {
      fetchUserDetails();
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        const updatedData = {
          name: data.user.name || "",
          email: data.user.email || "",
          username: data.user.username || "",
          profilepic: data.user.profilepic || "/Chai-gif.webp",
          coverpic: data.user.coverpic || "/background.png",
          upiqr: data.user.upiqr || "/upi-qr.png",
          razorpayid: data.user.razorpayid || "",
          razorpaysecret: data.user.razorpaysecret || "",
        };

        setForm(updatedData);
        setSavedData(updatedData);
        setIsEditing(false);

        showMessage("success", "Details saved successfully");
      } else {
        showMessage("error", data.message || "Unable to save details");
      }
    } catch (error) {
      showMessage("error", "Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (savedData) {
      setForm(savedData);
    }

    setIsEditing(true);
    setMessage({ type: "", text: "" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          Welcome to your Dashboard
        </h1>

        {message.text && (
          <div
            className={`mb-6 rounded-lg px-5 py-4 ${message.type === "success"
                ? "bg-green-900/40 text-green-300"
                : "bg-red-900/40 text-red-300"
              }`}
          >
            {message.text}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block font-bold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-slate-700 outline-none"
                placeholder="Enter Name"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-slate-700 outline-none"
                placeholder="Enter Email"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-slate-700 outline-none"
                placeholder="Enter Username"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Profile Picture</label>
              <input
                type="text"
                name="profilepic"
                value={form.profilepic}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-slate-700 outline-none"
                placeholder="/Chai-gif.webp"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Cover Picture</label>
              <input
                type="text"
                name="coverpic"
                value={form.coverpic}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-slate-700 outline-none"
                placeholder="/background.png"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">UPI QR Image</label>
              <input
                type="text"
                name="upiqr"
                value={form.upiqr}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-slate-700 outline-none"
                placeholder="/upi-qr.png"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Razorpay Id</label>
              <input
                type="text"
                name="razorpayid"
                value={form.razorpayid}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-slate-700 outline-none"
                placeholder="Enter Razorpay Id"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Razorpay Secret</label>
              <input
                type="password"
                name="razorpaysecret"
                value={form.razorpaysecret}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-slate-700 outline-none"
                placeholder="Enter Razorpay Secret"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 py-4 rounded-lg font-bold"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        ) : (
          <div className="bg-slate-900 rounded-xl p-8 md:p-10 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] gap-10 items-start">
              {/* Left Details */}
              <div className="min-w-0">
                <h2 className="text-3xl font-bold mb-10">Saved Details</h2>

                <div className="space-y-6 text-lg">
                  <p className="break-words">
                    <span className="font-bold">Name:</span> {savedData?.name}
                  </p>

                  <p className="break-words">
                    <span className="font-bold">Email:</span> {savedData?.email}
                  </p>

                  <p className="break-words">
                    <span className="font-bold">Username:</span> @{savedData?.username}
                  </p>

                  <p className="break-words">
                    <span className="font-bold">Profile Picture:</span>{" "}
                    {savedData?.profilepic}
                  </p>

                  <p className="break-words">
                    <span className="font-bold">Cover Picture:</span>{" "}
                    {savedData?.coverpic}
                  </p>

                  <p className="break-words">
                    <span className="font-bold">UPI QR:</span> {savedData?.upiqr}
                  </p>

                  <p className="break-words">
                    <span className="font-bold">Razorpay Id:</span>{" "}
                    {savedData?.razorpayid || "Not added"}
                  </p>

                  <p className="break-words">
                    <span className="font-bold">Razorpay Secret:</span>{" "}
                    {savedData?.razorpaysecret ? "Added" : "Not added"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleEdit}
                  className="mt-6 rounded-lg bg-purple-600 px-12 py-4 font-bold hover:bg-purple-700 transition"
                >
                  Edit
                </button>
              </div>

              {/* Right QR */}
              <div className="w-full md:w-[280px]">
                <div className="rounded-xl bg-slate-800 p-5 text-center">
                  <p className="mb-4 text-xl font-bold">UPI QR Code</p>

                  <div className="mx-auto w-fit rounded-lg bg-white p-3">
                    <img
                      src={savedData?.upiqr || "/upi-qr.png"}
                      alt="UPI QR"
                      className="block aspect-square w-[210px] max-w-full object-contain"
                    />
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-400">
                    This QR will be shown to users for UPI payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

