import HomePageCaurosel from "@/components/caurosel/home-page-caurosel";
import getHomePage from "@/lib/get-homepage";

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
