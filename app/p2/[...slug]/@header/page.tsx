'use client'
import PlpHeader2 from "@/components/ProductList/PlpHeader2";

export default function PlpHeader({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: { sc_id: string, brandId: string};
}) {
  const { slug } = params;
  
  const CheckIfBrands : boolean = Boolean(slug[0] === "Brands");
  const id =(CheckIfBrands ? searchParams?.brandId : slug[1])?.split("_")[1] || "";

  return (
    <>
      <PlpHeader2
        searchParams={CheckIfBrands ? searchParams?.brandId : searchParams?.sc_id}
        CurrentId={id}
        isBrands={CheckIfBrands}
      />
    </>
  );
}
