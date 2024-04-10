import { Suspense } from "react";
import ProductWrapper from "./ProductWrapper";
import ProductCardLoading from "./ProductCardLoading";

export default async function ProductCardList({
  ProductData,
  id,
  CateBrandsData,
}: {
  ProductData: any[];
  id: string;
  CateBrandsData: any[];
}) {
  return (
    <Suspense fallback={<ProductCardLoading />}>
      <ProductWrapper
        id={id}
        ProductData={ProductData}
        CateBrandsData={CateBrandsData}
      />
    </Suspense>
  );
}
