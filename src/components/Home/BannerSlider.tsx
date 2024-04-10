import getHomePage from "@/lib/get-homepage";
import dynamic from "next/dynamic";
const HomePageCaurosel = dynamic(
  () => import("@/components/caurosel/home-page-caurosel")
);

async function getData() {
  const Slider = await getHomePage();
  return { Slider };
}

export default async function BannerSlider() {
  const { Slider } = await getData();
  return (
    <>
      {Slider.map((o: any[], i: number) => {
        return <HomePageCaurosel key={i} data={o} />
      })}
    </>
  );
}
