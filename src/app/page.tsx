import CartBar from "@/components/CartBar";
import CategoryLoading from "@/components/Home/CategoryLoading";
import Section from "@/components/Home/Section";
import { Suspense } from "react";
// const BannerSlider = dynamic(() => import("@/components/Home/BannerSlider"));
import BannerLoading from "@/components/Home/BannerLoading";
import BannerSlider from "@/components/Home/BannerSlider";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<BannerLoading />}>
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
