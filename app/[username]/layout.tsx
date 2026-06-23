import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  return {
    title: username,
    description: `Support ${username} on Get me a Chai.`,
  };
}

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}