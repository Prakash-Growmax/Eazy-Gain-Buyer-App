"use client";
import BackButton from "@/components/BackButton";
import PricingFormat from "@/components/PricingFormat";
import ProductCard from "@/components/ProductCard";
import MuIconify from "@/components/iconify/mui-iconify";
import useBuildOrderProducts from "@/lib/hooks/useBuildOrderProducts";
import useProductImage from "@/lib/hooks/useProductImage";
import useCart from "@/lib/hooks/usecart";
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { each, find } from "lodash";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function OrderSummary() {
  const { t } = useTranslation("Product");
  const { push } = useRouter();
  const { CartData, ClearCart } = useCart();

  const { ProductImagesData, ProductImagesDatamutate } = useProductImage(
    "order-summary",
    CartData
  );
  useEffect(() => {
    ProductImagesDatamutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  each(CartData, (o: any) => {
    const productAssetss = find(
      ProductImagesData,
      (o1: any) => o.productId === o1.productId
    )?.productAssetss;
    o.productAssetss = o.productAsset;
    if (productAssetss) {
      o.productAssetss = productAssetss;
    }
  });
  const { CartValue, DiscountData, DiscountisLoading } =
    useBuildOrderProducts(CartData);

  return (
    <>
      <AppBar color="inherit" sx={{ position: "relative" }}>
        <Toolbar variant="dense">
          <BackButton />
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t("OrderSummary")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box p={2}>
        <Box
          sx={{
            "&>div": {
              display: "flex",
              justifyContent: "space-between",
              mb: 0.5,

              "&>p:not(:first-child)": {
                textAlign: "right",
              },
            },
          }}
        >
          <Box>
            <Typography variant="h6">{t("TotalItems")}</Typography>
            <Typography variant="h6">{CartValue?.totalItems}</Typography>
          </Box>
          <Box>
            <Typography>{t("TotalLP")}</Typography>
            <PricingFormat value={CartValue?.totalLP} />
          </Box>
          <Box>
            <Typography>{t("Discount")}</Typography>
            <Typography color="success.main">
              (-)&nbsp;
              <PricingFormat
                value={CartValue?.totalLP - CartValue?.totalValue}
              />
            </Typography>
          </Box>
          <Box>
            <Typography>{t("Subtotal")}</Typography>
            <PricingFormat value={CartValue?.taxableAmount} />
          </Box>
          <Box>
            <Typography>{t("Tax")}</Typography>
            <PricingFormat value={CartValue?.totalTax} />
          </Box>
          <Divider
            sx={{
              my: 1,
            }}
          />
          <Box mb={0}>
            <Typography variant="h6">{t("Total")}</Typography>
            <Typography color="error.main" variant="h6">
              <PricingFormat value={CartValue?.grandTotal} />
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box p={1}>
        {CartData?.map((o: any) => {
          return (
            <ProductCard
              isFromCart
              // hidediscountTable
              DiscountData={DiscountData}
              DiscountisLoading={DiscountisLoading}
              data={o}
              key={o.productId}
              // showOnlyDiscountedPrice
            />
          );
        })}
      </Box>
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
              // gap: 1,
            }}
          >
            <Link
              onClick={ClearCart}
              sx={{
                textDecoration: "underline",
                // m: 2,
                mb: 1,
                alignSelf: "flex-start",
              }}
            >
              {"Clear Cart"}
            </Link>
            <Button
              sx={{
                justifyContent: "space-between",
                mb: 1,
              }}
              color="warning"
              onClick={() => {
                push("/payments");
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
                  >
                    <PricingFormat value={CartValue.grandTotal} />
                  </Typography>
                </InputAdornment>
              }
              fullWidth
              size="large"
              variant="contained"
            >
              {t("Checkout")}
            </Button>
          </Toolbar>
        </AppBar>
      </>
    </>
  );
}
