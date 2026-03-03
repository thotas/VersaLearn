"use client";

import { useSession } from "next-auth/react";
import { Navbar } from "./navbar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar user={session?.user} />
      <main>{children}</main>
    </div>
  );
}
