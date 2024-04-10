"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";

export default function NextAuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <>
      {/* <Analytics mode={"production"} /> */}
      {/* <SpeedInsights /> */}
      <SessionProvider session={session}>{children}</SessionProvider>
    </>
  );
}
