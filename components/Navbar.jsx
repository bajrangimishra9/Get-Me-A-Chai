"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [profileUsername, setProfileUsername] = useState("user");
  const dropdownRef = useRef(null);

  const makeUsername = (name, email) => {
    const value = name || email?.split("@")[0] || "user";

    return value
      .toLowerCase()
      .trim()
      .replaceAll(" ", "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  useEffect(() => {
    if (session?.user) {
      if (session.user.username) {
        setProfileUsername(session.user.username);
      } else {
        setProfileUsername(makeUsername(session.user.name, session.user.email));
      }
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setOpen(false);

    await signOut({
      redirect: false,
      callbackUrl: "/",
    });

    window.location.href = "/";
  };

  const profileImage = session?.user?.image || "/avatar.gif";
  const userRole = session?.user?.role || "user";
  const isAdmin = userRole === "admin";

  return (
    <nav className="bg-gray-800 text-white flex justify-between items-center px-8 py-5">
      <Link
        className="logo font-bold text-2xl flex items-center gap-2"
        href="/"
      >
        <span>GetMeAChai</span>
        <img width={18} src="/coffee-lover.gif" alt="coffee" />
      </Link>

      <div className="relative" ref={dropdownRef}>
        {session ? (
          <>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${isAdmin
                  ? "bg-purple-700 text-white"
                  : "bg-slate-700 text-slate-200"
                  }`}
              >
                {userRole}
              </span>

              <img
                src={profileImage}
                alt="profile"
                onClick={() => setOpen((prev) => !prev)}
                className="w-12 h-12 rounded-full cursor-pointer border-2 border-purple-500 hover:scale-105 transition object-cover"
              />
            </div>

            {open && (
              <div className="absolute right-0 top-16 z-50 w-80 rounded-xl bg-gray-800 border border-gray-700 shadow-lg p-4">
                <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-3">
                  <img
                    src={profileImage}
                    className="w-12 h-12 rounded-full object-cover"
                    alt="profile"
                  />

                  <div className="overflow-hidden">
                    <p className="font-bold truncate">
                      {session.user.name || "User"}
                    </p>

                    <p className="text-sm text-gray-300 truncate">
                      {session.user.email}
                    </p>

                    <p
                      className={`text-xs font-bold uppercase mt-1 ${isAdmin ? "text-purple-300" : "text-slate-400"
                        }`}
                    >
                      {userRole}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 text-lg">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="hover:text-purple-400 transition"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href={`/${profileUsername}`}
                    onClick={() => setOpen(false)}
                    className="hover:text-purple-400 transition"
                  >
                    Account
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="hover:text-purple-400 transition"
                  >
                    About
                  </Link>

                  <Link
                    href="\setttings"
                    onClick={() => setOpen(false)}
                    className="hover:text-purple-400 transition"
                  >
                    Settings
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="hover:text-purple-400 transition"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      document.documentElement.classList.toggle("dark");
                      setOpen(false);
                    }}
                    className="text-left hover:text-purple-400 transition"
                  >
                    🌙 Dark / Light Mode
                  </button>

                  <hr className="border-gray-600" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-left text-red-400 hover:text-red-300 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Link href="/login">
            <button className="rounded-2xl text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl px-6 py-3">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;