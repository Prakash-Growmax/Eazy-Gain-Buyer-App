import CartBar from "@/components/CartBar";
import CategoryLoading from "@/components/Home/CategoryLoading";
import Section from "@/components/Home/Section";
import Skeleton from "@mui/material/Skeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const BannerSlider = dynamic(() => import("@/components/Home/BannerSlider"));

export default async function Home() {
  return (
    <>
      <Suspense fallback={<Skeleton variant="rectangular" height={200} />}>
        <BannerSlider />
      </Suspense>
      <Suspense fallback={<CategoryLoading />}>
        <Section />
      </Suspense>
      <Suspense fallback={<CategoryLoading />}>
        <Section isBrand />
      </Suspense>
      <CartBar />
    </>
  );
}
