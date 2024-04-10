"use client";
import useCart from "@/lib/hooks/usecart";
import {
  AppBar,
  Button,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import MuIconify from "./iconify/mui-iconify";
import PricingFormat from "./PricingFormat";
import useBuildOrderProducts from "@/lib/hooks/useBuildOrderProducts";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function CartBar() {
  const { CartData, ClearCart } = useCart();
  const { CartValue } = useBuildOrderProducts(CartData);
  const { push } = useRouter();
  const { t } = useTranslation("Product");
  return (
    !!CartData?.length && (
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
    )
  );
}
