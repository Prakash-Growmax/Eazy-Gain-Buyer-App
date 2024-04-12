"use client";
import { PublicPageContext } from "@/components/context/PublicPageContext";
import { useContext, useEffect } from "react";
import getBrands from "../get-brands";
import getCategoryData from "../get-categorys";

export default function useSetPublicPageData(isBrand = false) {
  const {
    BrandList,
    CategoryList,
    setBrandList,
    setCategoryList,
    setIsDataFetching,
  } = useContext(PublicPageContext);

  async function fetchBrandData() {
    let data = await getBrands();
    setBrandList(data);
    setIsDataFetching(false);
  }

  async function fetchCategoryData() {
    let data = await getCategoryData();
    setCategoryList(data);
    setIsDataFetching(false);
  }

  useEffect(() => {
    setIsDataFetching(true);
    if (isBrand) {
      if (BrandList?.length === 0) {
        fetchBrandData();
      } else {
        setBrandList(BrandList);
        setIsDataFetching(false);
      }
    } else {
      if (CategoryList?.length === 0) {
        fetchCategoryData();
      } else {
        setCategoryList(CategoryList);
        setIsDataFetching(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BrandList, CategoryList, isBrand]);
}
