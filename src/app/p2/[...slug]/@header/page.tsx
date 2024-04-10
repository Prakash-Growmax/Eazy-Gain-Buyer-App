import PlpHeader2 from "@/components/ProductList/PlpHeader2";
import getBrands from "@/lib/get-brands";
import getCategoryData from "@/lib/get-categorys";

const getData = async ( CheckIfBrands: boolean) => {
  let data;
  if (CheckIfBrands) {
    data = await getBrands();
  } else {
    data = await getCategoryData();
  }
  return data;
};

export default async function PlpHeader({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: { sc_id: string, brandId: string};
}) {
  const { slug } = params;
  
  const CheckIfBrands = slug[0] === "Brands";
  const id =(CheckIfBrands ? searchParams?.brandId : slug[1])?.split("_")[1] || "";
  const data = await getData(CheckIfBrands);
  return (
    <>
      <PlpHeader2
        searchParams={CheckIfBrands ? searchParams?.brandId : searchParams?.sc_id}
        data={data}
        CurrentId={id}
        isBrands={CheckIfBrands}
      />
    </>
  );
}
