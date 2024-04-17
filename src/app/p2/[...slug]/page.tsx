"use client";
import ProductList2 from "@/components/ProductList/ProductList2";
import { SwipeContext } from "@/components/ProductList/SwipeProvider";
import axios from "@/lib/axios";
import buildProductListElasticQuery from "@/lib/build-product-list-elastic-query";
import FormatElastic from "@/lib/format-elastic";
import { useContext, useEffect, useState } from "react";

const getData = async (id: string, CheckIfBrands: boolean) => {
  
  const elasticQuery = buildProductListElasticQuery(
    id,
    process.env.NEXT_PUBLIC_TENANT_ID!,
    CheckIfBrands
  );

  const esdata = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "elasticsearch/invocations",
    elasticQuery
  );
  return { ProductData: FormatElastic(esdata) };
};

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: { sc_id: string; brandId: string };
}) {
  const { navigating } = useContext(SwipeContext);
  const { slug } = params;
  const CheckIfBrands = slug[0] === "Brands";
  const id =
    (CheckIfBrands ? searchParams?.brandId : slug[1])?.split("_")[1] || "";

  const [ProductData, setProductData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  async function fetchData() {
    setIsFetchingData(true);
    const { ProductData }: { ProductData: any } = await getData(
      id,
      CheckIfBrands
    );
    setProductData(ProductData);
    setIsFetchingData(false);
  }

  useEffect(() => {
    if(id){
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, CheckIfBrands]);

  return (
    <>
      <ProductList2
        searchParams={searchParams?.sc_id}
        CurrentId={id}
        isBrands={CheckIfBrands}
        ProductData={ProductData}
        isLoading={isFetchingData}
      />
    </>
  );
}
