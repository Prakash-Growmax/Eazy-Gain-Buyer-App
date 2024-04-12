import getBrands from "@/lib/get-brands";
import getCategoryData from "@/lib/get-categorys";
import { Box } from "@mui/material";
import { uniqBy } from "lodash";
import dynamic from "next/dynamic";
import SectionTitle from "./SectionTitle";
const SectionCard = dynamic(() => import("./SectionCard"), { ssr: false });

async function getData(isBrand: boolean) {
  if (isBrand) {
    const data = await getBrands();
    return data;
  }
  const data = await getCategoryData();
  return data;
}
export default async function Section({
  isBrand = false,
}: {
  isBrand?: boolean;
}) {
  const data = await getData(isBrand);
  const Sectiondata = isBrand ? data : uniqBy(data, "c_id");
  return (
    <Box p={1}>
      <SectionTitle isBrand={isBrand} />
      <SectionCard isBrand={isBrand} Data={Sectiondata} />
    </Box>
  );
}
