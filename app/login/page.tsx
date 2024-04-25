"use client";

import dynamic from "next/dynamic";
import React from "react";
const Login = dynamic(() => import("@/components/sections/Login"));

export default function LoginPage() {
  return (
    <>
      <Login />
    </>
  );
}
