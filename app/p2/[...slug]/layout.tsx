'use client'
import ProductCardLoading from "@/components/ProductList/ProductCardLoading";
import SwipeProvider from "@/components/ProductList/SwipeProvider";
import { ReactNode, Suspense } from "react";
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
      {/* <Suspense fallback={<PlpHeaderLoading />}>{header}</Suspense> */}
      <Suspense fallback={<ProductCardLoading />}>{children}</Suspense>
    </SwipeProvider>
  );
}
