"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    </SessionProvider>
  );
}