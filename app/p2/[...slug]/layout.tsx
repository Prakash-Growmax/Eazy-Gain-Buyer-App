"use client";
import SwipeProvider from "@/components/ProductList/SwipeProvider";
import { ReactNode } from "react";
export default function ProductLayout({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) {
  return (
    <SwipeProvider>
      {header}
      {children}
    </SwipeProvider>
  );
}
