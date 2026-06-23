import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin payment verification panel.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}