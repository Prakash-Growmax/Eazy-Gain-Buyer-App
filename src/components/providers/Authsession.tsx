import React, { ReactNode } from "react";
import NextAuthProvider from "./NextAuthProvider";
import auth from "./auth";

export default async function Authsession({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <NextAuthProvider session={session}>{children}</NextAuthProvider>
    </>
  );
}
