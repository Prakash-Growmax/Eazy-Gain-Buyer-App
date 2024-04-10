import ProductList2 from "@/components/ProductList/ProductList2";
import axios from "@/lib/axios";
import buildProductListElasticQuery from "@/lib/build-product-list-elastic-query";
import FormatElastic from "@/lib/format-elastic";
import getBrands from "@/lib/get-brands";
import getCategoryData from "@/lib/get-categorys";

const getData = async (id: string, CheckIfBrands: boolean) => {
  let CatBrandata;
  const elasticQuery = buildProductListElasticQuery(
    id,
    process.env.NEXT_PUBLIC_TENANT_ID!,
    CheckIfBrands
  );

  const esdata = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "elasticsearch/invocations",
    elasticQuery
  );

  if (CheckIfBrands) {
    CatBrandata = await getBrands();
  } else {
    CatBrandata = await getCategoryData();
  }
  return { ProductData: FormatElastic(esdata), CatBrandata };
};
export default async function page({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: { sc_id: string, brandId: string  };
}) {
  const { slug } = params;
  const CheckIfBrands = slug[0] === "Brands";
  const id =(CheckIfBrands ? searchParams?.brandId : slug[1])?.split("_")[1] || "";
  const { ProductData, CatBrandata } = await getData(id, CheckIfBrands);
  
  return (
    <>
      <ProductList2
        searchParams={searchParams?.sc_id}
        CurrentId={id}
        isBrands={CheckIfBrands}
        ProductData={ProductData}
        CatBrandata={CatBrandata}
      />
    </>
  );
}
