"use client";
import useBuildOrderProducts from "@/lib/hooks/useBuildOrderProducts";
import useDiscounts from "@/lib/hooks/useDiscounts";
import useCart from "@/lib/hooks/usecart";
import {
  AppBar,
  Button,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { filter, find, findIndex } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";
import slugify from "slugify";
import PricingFormat from "../PricingFormat";
import ProductCard from "../ProductCard";
import MuIconify from "../iconify/mui-iconify";
import ProductCardLoading from "./ProductCardLoading";
import { SwipeContext } from "./SwipeProvider";

export default function ProductList2({
  ProductData,
  CurrentId,
  isBrands,
  CatBrandata,
  searchParams,
}: {
  ProductData: any[];
  CurrentId: string;
  isBrands: boolean;
  CatBrandata: any[];
  searchParams: string | undefined;
}) {
  const { t } = useTranslation("Product");
  const subCategoryId = parseInt(searchParams || "");
  const { handleChangeCurrentId, setNavigating, navigating } =
    useContext(SwipeContext);
  const { replace, push } = useRouter();
  const pathname = usePathname();
  const Subcategory = filter(
    CatBrandata,
    (o: any) => o.c_id === parseInt(CurrentId)
  );
  const BrandsData = find(
    CatBrandata,
    (o: any) => o.brandId === parseInt(CurrentId)
  );
  const { CartData, ClearCart } = useCart();
  const { CartValue } = useBuildOrderProducts(CartData);

  const { DiscountData, DiscountisLoading } = useDiscounts(
    `p/${CurrentId}`,
    ProductData.map((o) => o.productId)
  );
  const FilterProduct = isNaN(subCategoryId)
    ? ProductData
    : ProductData.filter((o) =>
        Boolean(
          o.productsSubCategories.find(
            (o: any) => o.subCategoryId === subCategoryId
          )
        )
      );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (navigating) {
        return;
      }
      if (isBrands) {
        const CurrentIndex = findIndex(
          CatBrandata,
          (o: any) => o.brandId === parseInt(CurrentId)
        );
        const HasRight = CatBrandata[CurrentIndex + 1];
        if (CurrentIndex === 0) {
          handleChangeCurrentId("");
          const { brandsName, brandId } = !Array.isArray(BrandsData)
            ? BrandsData
            : BrandsData[0];
          setNavigating(() =>
            replace(
              `/p2/Brands?brandName=${slugify(
                brandsName
              )}&&brandId=b_${brandId}`
            )
          );
        }
        if (HasRight) {
          handleChangeCurrentId(HasRight.brandId.toString());
          setNavigating(() =>
            replace(
              `/p2/Brands?brandName=${slugify(
                HasRight.brandsName
              )}&&brandId=b_${HasRight.brandId}`
            )
          );
        }
      } else {
        const currentIsSub = Boolean(subCategoryId);
        if (currentIsSub) {
          const CurrentIndex = findIndex(
            Subcategory,
            (o: any) => o.sc_id === subCategoryId
          );
          const HasRight = Subcategory[CurrentIndex + 1];
          if (CurrentIndex === 0) {
            handleChangeCurrentId("");
            setNavigating(() => replace(`${pathname}`));
          }
          if (HasRight) {
            handleChangeCurrentId(HasRight.sc_id.toString());
            setNavigating(() => replace(`${pathname}?sc_id=${HasRight.sc_id}`));
          }
        } else {
          handleChangeCurrentId(Subcategory[0].sc_id.toString());

          setNavigating(() =>
            replace(`${pathname}?sc_id=${Subcategory[0].sc_id}`)
          );
        }
      }
    },
    onSwipedRight: () => {
      if (navigating) {
        return;
      }
      if (isBrands) {
        const CurrentIndex = findIndex(
          CatBrandata,
          (o: any) => o.brandId === parseInt(CurrentId)
        );
        const HasLeft = CatBrandata[CurrentIndex - 1];
        if (CurrentIndex === 0) {
          const { brandId, brandsName } = !Array.isArray(BrandsData)
            ? BrandsData
            : BrandsData[0];
          handleChangeCurrentId(brandId.toString());
          setNavigating(() =>
            replace(
              `/p2/Brands?brandName=${slugify(
                brandsName
              )}&&brandId=b_${brandId}`
            )
          );
        }
        if (HasLeft) {
          handleChangeCurrentId(HasLeft.brandId.toString());
          setNavigating(() =>
            replace(
              `/p2/Brands?brandName=${slugify(HasLeft.brandsName)}&&brandId=b_${
                HasLeft.brandId
              }`
            )
          );
        }
      } else {
        const currentIsSub = Boolean(subCategoryId);
        if (currentIsSub) {
          const CurrentIndex = findIndex(
            Subcategory,
            (o: any) => o.sc_id === subCategoryId
          );

          if (CurrentIndex === 0) {
            handleChangeCurrentId("");
            setNavigating(() => replace(`${pathname}`));
          }
          const HasLeft = Subcategory[CurrentIndex - 1];
          if (CurrentIndex === 0) {
            handleChangeCurrentId("");
            setNavigating(() => replace(`${pathname}`));
          }
          if (HasLeft) {
            handleChangeCurrentId(HasLeft.sc_id.toString());
            setNavigating(() => replace(`${pathname}?sc_id=${HasLeft.sc_id}`));
          }
        } else {
          return;
        }
      }
    },
  });

  return (
    <>
      <div {...handlers}>
        {navigating ? (
          <ProductCardLoading />
        ) : (
          FilterProduct.map((o) => (
            <ProductCard
              data={o}
              key={o.productId}
              DiscountData={DiscountData}
              DiscountisLoading={DiscountisLoading}
            />
          ))
        )}
      </div>

      {!!CartData?.length && (
        <>
          <Toolbar
            sx={{
              height: 104,
            }}
          />
          <AppBar
            position="fixed"
            color="inherit"
            sx={{ top: "auto", bottom: 0 }}
          >
            <Toolbar
              sx={{
                flexDirection: "column",
              }}
            >
              <Link
                onClick={ClearCart}
                sx={{
                  textDecoration: "underline",
                  mb: 0.5,
                  alignSelf: "start",
                }}
              >
                {"Clear Cart"}
              </Link>
              <Button
                color="warning"
                sx={{
                  justifyContent: "space-between",
                  mb: 2,
                }}
                onClick={() => {
                  push("/order-summary");
                }}
                startIcon={
                  <InputAdornment
                    position="start"
                    sx={{
                      color: "inherit",
                    }}
                  >
                    <MuIconify icon="mdi:cart" color="inherit" />
                    &nbsp; | &nbsp;
                    <Typography
                      variant="h6"
                      fontSize=".9rem"
                      color="text.primary"
                      // color="error.main"
                    >
                      <PricingFormat value={CartValue.grandTotal} />
                    </Typography>
                  </InputAdornment>
                }
                fullWidth
                size="large"
                variant="contained"
              >
                {t("GoToCart")}
              </Button>
            </Toolbar>
          </AppBar>
        </>
      )}
    </>
  );
}
