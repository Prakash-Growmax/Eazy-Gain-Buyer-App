"use client";
import React, { Fragment, Suspense, memo, useTransition } from "react";
import ProductCard from "@/components/ProductCard";
import { Box } from "@mui/material";
import useDiscounts from "@/lib/hooks/useDiscounts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SwipeableViews from "react-swipeable-views";
import { filter, findIndex } from "lodash";
import ProductCardLoading from "./ProductCardLoading";

 function ProductWrapper({
  ProductData,
  CateBrandsData,
  id,
}: {
  id: string;
  ProductData: any[];
  CateBrandsData?: any[];
}) {
  const [isPending, setTransition] = useTransition();
  const { DiscountData, DiscountisLoading } = useDiscounts(
    `p/${id}`,
    ProductData.map((o) => o.productId)
  );
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const Subcategory = filter(CateBrandsData, (o) => o.c_id === parseInt(id));
  const subCategoryId = parseInt(searchParams.get("sc_id") || "");
  let CurrentValue = isNaN(subCategoryId)
    ? 0
    : findIndex(Subcategory, (o: any) => o.sc_id === subCategoryId) + 1;
  const handleChangeIndex = (index: number) => {
    if (isPending) {
      return false;
    }
    if (index) {
      setTransition(() =>
        replace(`${pathname}?sc_id=${Subcategory[index - 1].sc_id}`)
      );
    } else {
      setTransition(() => replace(`${pathname}`));
    }
  };
  const FilterProduct = isNaN(subCategoryId)
    ? ProductData
    : ProductData.filter((o) =>
        Boolean(
          o.productsSubCategories.find(
            (o: any) => o.subCategoryId === subCategoryId
          )
        )
      );
  return (
    <Box p={0.5} px={1}>
      {isPending ? (
        <ProductCardLoading />
      ) : (
        <SwipeableViews
          axis={"x"}
          index={CurrentValue}
          onChangeIndex={handleChangeIndex}
        >
          {Subcategory?.map((_, i) => (
            <Fragment key={i}>
              {FilterProduct.map((o) => (
                <ProductCard
                  data={o}
                  key={o.productId}
                  DiscountData={DiscountData}
                  DiscountisLoading={DiscountisLoading}
                />
              ))}
            </Fragment>
          ))}
        </SwipeableViews>
      )}
    </Box>
  );
}

export default memo(ProductWrapper)

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}
