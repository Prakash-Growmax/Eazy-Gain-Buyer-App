"use client";
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  Skeleton,
  Toolbar,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect } from "react";

import { bgBlur } from "@/components/Theme/css";
import useSetPublicPageData from "@/lib/hooks/useFetchPublicPageData";
import { filter, find, findIndex } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import slugify from "slugify";
import BackButton from "../BackButton";
import LazyImage from "../LazyImage";
import TextMaxLine from "../TextMaxContent";
import { PublicPageContext } from "../context/PublicPageContext";
import MuIconify from "../iconify/mui-iconify";
import { StyledTab, StyledTabs, a11yProps } from "./PlpHeader";
import { SwipeContext } from "./SwipeProvider";

export default function PlpHeader2({
  CurrentId,
  isBrands,
  searchParams,
}: {
  CurrentId: string;
  isBrands: boolean;
  searchParams: string | undefined;
}) {
  const { BrandList, CategoryList, isDataFetching } =
    useContext(PublicPageContext);
  useSetPublicPageData(isBrands);
  const theme = useTheme();
  const { currentId, navigating, setNavigating,setIsDataFetching } = useContext(SwipeContext);
  const { i18n } = useTranslation();
  const { push, replace } = useRouter();
  const handleSearchClick = () => {
    push("/search");
  };

  const Subcategory =
    filter(CategoryList || [], (o: any) => o.c_id === parseInt(CurrentId)) ||
    [];
  const BrandsData =
    find(BrandList || [], (o: any) => o.brandId === parseInt(CurrentId)) || [];
  const subCategoryId = currentId.length ? currentId : searchParams || "";

  const [value, setValue] = React.useState(parseInt(subCategoryId || "0"));
  const pathname = usePathname();
  useEffect(() => {
    if (navigating) {
      if (currentId === "" && !isBrands) {
        setValue(0);
        return;
      }
    }
    if (!isDataFetching) {
      if (!isBrands) {
        const Seacrhvalue = findIndex(
          Subcategory,
          (o: any) => o.sc_id === parseInt(subCategoryId)
        );
        if (value !== Seacrhvalue + 1) {
          setValue(Seacrhvalue + 1);
        }
      } else {
        if (isBrands) {
          const brand = findIndex(
            BrandList || [],
            (o) => o.brandId === parseInt(CurrentId)
          );
          setValue(brand);
        } else {
          if (value !== 0) {
            setValue(0);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategoryId, currentId, CurrentId, isDataFetching]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (navigating) {
      return;
    }
    setValue(newValue);

    if (isBrands) {
      const { brandsName, brandId } = BrandList?.[newValue];
      setIsDataFetching(true)
      setNavigating(() =>
        replace(
          `/p2/Brands?brandName=${slugify(brandsName)}&&brandId=b_${brandId}`
        )
      );
      return;
    }
    if (newValue) {
      setNavigating(() =>
        replace(`${pathname}?sc_id=${Subcategory?.[newValue - 1]?.sc_id}`)
      );
      setIsDataFetching(true)
    } else {
      setNavigating(() => replace(`${pathname}`));
      setIsDataFetching(true)
    }
  };
  return (
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
        <Toolbar disableGutters variant='dense'>
          <BackButton />
          <TextMaxLine variant='h6' flexGrow={1} color='text.primary' line={1}>
            {isBrands
              ? BrandsData?.brandsName
              : i18n.language === "en"
              ? Subcategory?.[0]?.c_name
              : Subcategory?.[0]?.c_name_tamil}
          </TextMaxLine>
          <IconButton
            sx={{
              mr: 2,
            }}
            onClick={handleSearchClick}
          >
            <MuIconify icon='eva:search-fill' />
          </IconButton>
        </Toolbar>
        {isDataFetching ? (
          <Box
            display='flex'
            justifyContent={"center"}
            alignItems={"center"}
            px={1}
          >
            {new Array(4).fill(0).map((i) => (
              <Skeleton
                width={100}
                height={30}
                key={i}
                sx={{ mx: 1 }}
                animation={"wave"}
              />
            ))}
          </Box>
        ) : (
          <StyledTabs
            variant='scrollable'
            value={value || 0}
            onChange={handleChange}
            aria-label='styled tabs example'
          >
            {!isBrands && (
              <StyledTab
                {...a11yProps(0)}
                value={0}
                disabled={navigating}
                iconPosition='start'
                icon={
                  navigating ? (
                    <CircularProgress size={18} />
                  ) : (
                    <LazyImage
                      height={20}
                      width={20}
                      sx={{
                        objectFit: "contain",
                      }}
                      src={`${
                        Subcategory?.[0]?.c_imageSource
                          ? Subcategory?.[0]?.c_imageSource
                          : "/assets/placeholder.png"
                      }`}
                      alt={Subcategory?.[0]?.c_name}
                    />
                  )
                }
                label='All'
              />
            )}
            {isBrands
              ? BrandList?.map((o, i) => (
                  <StyledTab
                    disabled={navigating}
                    {...a11yProps(i)}
                    key={o.brandId}
                    value={i || 0}
                    iconPosition='start'
                    icon={
                      navigating && value === i ? (
                        <CircularProgress size={18} />
                      ) : (
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
                      )
                    }
                    label={o.brandsName}
                  />
                ))
              : Subcategory?.map((o, i) => (
                  <StyledTab
                    disabled={navigating}
                    {...a11yProps(i + 1)}
                    value={i + 1}
                    key={o.sc_id}
                    iconPosition='start'
                    icon={
                      navigating  && (value - 1) === i ? (
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
                    label={i18n.language === "en" ? o.sc_name : o.sc_name_tamil}
                  />
                ))}
          </StyledTabs>
        )}
      </AppBar>
      <Toolbar
        sx={{
          height: 95,
        }}
      />
    </>
  );
}
