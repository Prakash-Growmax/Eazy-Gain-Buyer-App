"use client";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Tab,
  TabOwnProps,
  Tabs,
  TabsOwnProps,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React, {
  Fragment,
  Suspense,
  useContext,
  useEffect,
  useTransition,
} from "react";
import SwipeableViews from "react-swipeable-views";

import { bgBlur } from "@/components/Theme/css";
import useBuildOrderProducts from "@/lib/hooks/useBuildOrderProducts";
import useDiscounts from "@/lib/hooks/useDiscounts";
import useCart from "@/lib/hooks/usecart";
import { filter, find, findIndex } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import slugify from "slugify";
import BackButton from "../BackButton";
import LazyImage from "../LazyImage";
import PricingFormat from "../PricingFormat";
import ProductCard from "../ProductCard";
import TextMaxLine from "../TextMaxContent";
import MuIconify from "../iconify/mui-iconify";
import { pluralize } from "../image/utils";
import PlpHeaderLoading from "./PlpHeaderLoading";
import ProductCardLoading from "./ProductCardLoading";
import { SwipeContext } from "./SwipeProvider";

export default function PlpHeader({
  data,
  CurrentId,
  isBrands,
  ProductData,
}: {
  data: any[];
  CurrentId: string;
  isBrands: boolean;
  ProductData: any[];
}) {
  const theme = useTheme();
  const { handleChangeCurrentId } = useContext(SwipeContext);
  const { back, push, replace } = useRouter();

  const { CartData, ClearCart } = useCart();
  const { CartValue } = useBuildOrderProducts(CartData);

  const pathname = usePathname();
  const { DiscountData, DiscountisLoading } = useDiscounts(
    `p/${CurrentId}`,
    ProductData.map((o) => o.productId)
  );
  const [isPending, setTransition] = useTransition();
  const handleSearchClick = () => {
    push("/search");
  };

  const Subcategory = filter(data, (o) => o.c_id === parseInt(CurrentId));
  const BrandsData = find(data, (o) => o.brandId === parseInt(CurrentId));

  const [value, setValue] = React.useState(0);
  const searchParams = useSearchParams();

  const subCategoryId = searchParams.get("sc_id");

  useEffect(() => {
    if (subCategoryId) {
      const Seacrhvalue = findIndex(
        Subcategory,
        (o: any) => o.sc_id === parseInt(subCategoryId)
      );
      if (value !== Seacrhvalue + 1) {
        setValue(Seacrhvalue + 1);
      }
    } else {
      if (isBrands) {
        const brand = findIndex(data, (o) => o.brandId === parseInt(CurrentId));
        setValue(brand);
      } else {
        if (value !== 0) {
          setValue(0);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategoryId]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (isPending) {
      return;
    }
    setValue(newValue);
    if (isBrands) {
      const { brandsName, brandId } = data[newValue];
      setTransition(() => replace(`/p2/${slugify(brandsName)}/b_${brandId}`));
      return;
    }
    if (newValue) {
      setTransition(() =>
        replace(`${pathname}?sc_id=${Subcategory[newValue - 1].sc_id}`)
      );
    } else {
      setTransition(() => replace(`${pathname}`));
    }
  };
  const handleChangeIndex = (index: number) => {
    if (isPending) {
      return false;
    }
    if (isBrands) {
      const { brandsName, brandId } = data[index];
      setTransition(() => replace(`/p2/${slugify(brandsName)}/b_${brandId}`));
      return;
    }

    setValue(index);
    if (index) {
      setTransition(() =>
        replace(`${pathname}?sc_id=${Subcategory[index - 1].sc_id}`)
      );
    } else {
      setTransition(() => replace(`${pathname}`));
    }
  };
  const FilterProduct = isBrands
    ? ProductData.filter((o) => (o.brandsId = parseInt(CurrentId || "")))
    : isNaN(parseInt(subCategoryId || ""))
    ? ProductData
    : ProductData.filter((o) =>
        Boolean(
          o.productsSubCategories.find(
            (o: any) => o.subCategoryId === parseInt(subCategoryId || "")
          )
        )
      );

  return (
    <Suspense fallback={<PlpHeaderLoading />}>
      <>
        <AppBar
          elevation={2}
          sx={{
            zIndex: theme.zIndex.appBar + 1,
            ...bgBlur({
              color: theme.palette.background.paper,
            }),
            transition: theme.transitions.create(["height"], {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          <Toolbar disableGutters variant="dense">
           <BackButton />
            <TextMaxLine
              variant="h6"
              flexGrow={1}
              fontWeight="500"
              color="text.primary"
              line={1}
            >
              {isBrands ? BrandsData?.brandsName : Subcategory[0].c_name}
            </TextMaxLine>
            <IconButton
              sx={{
                mr: 2,
              }}
              onClick={handleSearchClick}
            >
              <MuIconify icon="eva:search-fill" />
            </IconButton>
          </Toolbar>
          <StyledTabs
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="styled tabs example"
          >
            {!isBrands && (
              <StyledTab
                {...a11yProps(0)}
                value={0}
                disabled={isPending}
                iconPosition="start"
                icon={
                  isPending ? (
                    <CircularProgress size={18} />
                  ) : (
                    <LazyImage
                      height={20}
                      width={20}
                      sx={{
                        objectFit: "contain",
                      }}
                      src={`${
                        Subcategory[0].c_imageSource
                          ? Subcategory[0].c_imageSource
                          : "/assets/placeholder.png"
                      }`}
                      alt={Subcategory[0].c_name}
                    />
                  )
                }
                label="All"
              />
            )}
            {isBrands
              ? data.map((o, i) => (
                  <StyledTab
                    {...a11yProps(0)}
                    key={o.brandId}
                    value={i}
                    iconPosition="start"
                    icon={
                      <LazyImage
                        height={20}
                        width={20}
                        sx={{
                          objectFit: "contain",
                        }}
                        src={`${
                          o.brandImage
                            ? o.brandImage
                            : "/assets/placeholder.png"
                        }`}
                        alt={o.brandsName}
                      />
                    }
                    label={o.brandsName}
                  />
                ))
              : Subcategory.map((o, i) => (
                  <StyledTab
                    disabled={isPending}
                    {...a11yProps(i + 1)}
                    value={i + 1}
                    key={o.sc_id}
                    iconPosition="start"
                    icon={
                      isPending ? (
                        <CircularProgress size={18} />
                      ) : (
                        <LazyImage
                          height={20}
                          width={20}
                          sx={{
                            objectFit: "contain",
                          }}
                          src={`${
                            o.sc_imageSource
                              ? o.sc_imageSource
                              : "/assets/placeholder.png"
                          }`}
                          alt={o.sc_name}
                        />
                      )
                    }
                    label={o.sc_name}
                  />
                ))}
          </StyledTabs>
        </AppBar>
        <Toolbar
          sx={{
            height: 90,
          }}
        />

        <Box p={0.5} px={1}>
          {isPending ? (
            <ProductCardLoading />
          ) : (
            <SwipeableViews
              axis={"x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              {isBrands
                ? data?.map((_: any, i: any) => (
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
                  ))
                : Subcategory?.map((_, i) => (
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
      </>
      {CartData?.length && (
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
                gap: 1,
              }}
            >
              <Link
                onClick={ClearCart}
                sx={{
                  textDecoration: "underline",
                  m: 2,
                  mb: 0,
                }}
              >
                {"ClearCart"}
              </Link>
              <Button
                sx={{
                  justifyContent: "space-between",
                  mb: 2,
                }}
                onClick={() => {
                  push("/order-summary");
                }}
                startIcon={
                  <InputAdornment position="start">
                    <Typography
                      variant="h6"
                      fontSize=".9rem"
                      color="text.primary"
                    >
                      {pluralize("Item", CartData?.length)} &nbsp; | &nbsp;
                    </Typography>
                    <Typography
                      variant="h6"
                      fontSize=".9rem"
                      color="error.main"
                    >
                      <PricingFormat value={CartValue.grandTotal} />
                    </Typography>
                  </InputAdornment>
                }
                fullWidth
                size="large"
                variant="contained"
              >
                Checkout
              </Button>
            </Toolbar>
          </AppBar>
        </>
      )}
    </Suspense>
  );
}

interface StyledTabsProps extends TabsOwnProps {
  children?: React.ReactNode;
  value?: number;
  onChange?: (event: React.SyntheticEvent, newValue: number) => void;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  minHeight: "unset",
  height: 40,
  transition: "all .2s ease-in",
  "& .MuiButtonBase-root": {
    // padding: 0,
  },
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "none",
  },
});

interface StyledTabProps extends TabOwnProps {
  label: any;
  icon?: any;
}

export const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  textTransform: "none",
  minHeight: "unset",
  height: 32,
  transition: "all .2s ease-in",
  borderRadius: 4,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

export const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};
