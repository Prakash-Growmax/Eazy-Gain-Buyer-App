"use client";
/* eslint-disable @next/next/no-img-element */
import Label from "@/components/label";
import useOrdersDetails from "@/lib/hooks/useOrdersDetails";
import useProductImage from "@/lib/hooks/useProductImage";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Link,
  Skeleton,
  Stack,
  Typography,
  lighten,
} from "@mui/material";
import { find, isArray } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PricingFormat from "@/components/PricingFormat";
import MuIconify from "@/components/iconify/mui-iconify";
import StatusDetails from "@/components/StatusDetails";
import { FormatDate, bgColor, statusColor } from "@/lib/OrderUtils";

export default function OrderDetails({ params }: { params: { id: string } }) {
  const { id: orderIdentifier } = params;

  const { OrdersDetailsData, OrdersDetailsDataisLoading } =
    useOrdersDetails(orderIdentifier);
  const [OpenOrdetailsisOpen, SetOpenOrdetailsisOpen] = useState(false);
  const { ProductImagesData } = useProductImage(
    "orderdetails" + orderIdentifier,
    OrdersDetailsData?.orderDetails
      ? OrdersDetailsData?.orderDetails[0]?.dbProductDetails
      : []
  );
  const { t } = useTranslation("orders");

  const { orderName, grandTotal, dbProductDetails } =
    (OrdersDetailsData?.orderDetails && OrdersDetailsData?.orderDetails[0]) ||
    {};

  return (
    <Box m={1}>
      {OrdersDetailsDataisLoading &&
        Array(2)
          .fill(0)
          .map((o, i) => (
            <Card
              key={i}
              sx={{
                borderRadius: 0,
                mb: 0.5,
              }}
              variant="outlined"
              square
            >
              <Box mb={1} pt={1} display="flex">
                <Box mx={1} position="relative">
                  <Skeleton height={100} width={100} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <CardContent
                    sx={{
                      flex: "1 0 auto",
                      p: 1,
                      "&:last-child": {
                        pb: 1,
                      },
                    }}
                  >
                    <Typography fontWeight="bold" lineHeight="1.3" mb={0.5}>
                      <Skeleton />
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      mb={0.5}
                      spacing={0.5}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        lineHeight="1.3"
                        mb={0.5}
                      >
                        <Skeleton />
                      </Typography>
                    </Stack>
                  </CardContent>
                </Box>
              </Box>
            </Card>
          ))}
      {OrdersDetailsData?.orderDetails && (
        <Card
          sx={{
            mb: 2,
          }}
        >
          <CardHeader
            disableTypography
            title={
              <Box display="flex">
                <Typography
                  width="55%"
                  fontSize="1rem"
                  flexGrow={1}
                  variant="subtitle2"
                >
                  {orderName}
                </Typography>
                <Label
                  sx={{
                    bgcolor: `${bgColor(
                      OrdersDetailsData.updatedBuyerStatus,
                      lighten
                    )} !important`,
                    color: `${statusColor(
                      OrdersDetailsData.updatedBuyerStatus
                    )} !important`,
                    border: `1px solid ${statusColor(
                      OrdersDetailsData.updatedBuyerStatus
                    )}`,
                    // ml: 3,
                    // mb: 2,
                  }}
                  // bgColor={bgColor(o.updatedBuyerStatus)}
                  variant={"outlined"}
                  // color={statusColor(o.updatedBuyerStatus)}
                >
                  {t(OrdersDetailsData.updatedBuyerStatus)}
                </Label>
              </Box>
            }
            subheader={
              <Typography width="55%" flexGrow={1} variant="caption">
                {OrdersDetailsData.orderIdentifier} {t("Order on")} &nbsp;
                {FormatDate(new Date(OrdersDetailsData.createdDate))}
              </Typography>
            }
          />

          <Divider />
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="medium" variant="subtitle2">
                {t("TotalPrice")}
              </Typography>
              <Typography fontWeight="medium" variant="subtitle2">
                <PricingFormat value={grandTotal} />
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="medium" variant="subtitle2">
                {t("TotalItems")}
              </Typography>
              <Typography fontWeight="medium" variant="subtitle2">
                {dbProductDetails.length}
              </Typography>
            </Box>
          </CardContent>

          <CardActions
            sx={{
              justifyContent: "center",
            }}
          >
            <Link
              onClick={() => {
                SetOpenOrdetailsisOpen(!OpenOrdetailsisOpen);
              }}
            >
              {t("OrderDetails")}
              <MuIconify
                sx={{
                  verticalAlign: "middle",
                }}
                icon={
                  !OpenOrdetailsisOpen
                    ? "zondicons:cheveron-down"
                    : "zondicons:cheveron-up"
                }
              />
            </Link>
          </CardActions>
          <Collapse in={OpenOrdetailsisOpen} unmountOnExit>
            <StatusDetails orderIdentifier={orderIdentifier} />
          </Collapse>
        </Card>
      )}
      {OrdersDetailsData.orderDetails && (
        <Box mb={2}>
          {OrdersDetailsData?.orderDetails[0]?.dbProductDetails.map(
            (o: any, i: number) => {
              const productAssetss = find(
                ProductImagesData,
                (o1) => o1.productId === o.productId
              )?.productAssetss;
              const DefaultImage = find(productAssetss, (o) => o.isDefault);
              const CurrentImage = DefaultImage
                ? DefaultImage.source
                : isArray(productAssetss)
                ? productAssetss.length
                  ? productAssetss[0].source
                  : "/assets/placeholder.png"
                : "/assets/placeholder.png";
              return (
                <Card
                  key={i}
                  sx={{
                    borderRadius: 0,
                    mb: 1,
                  }}
                  variant="outlined"
                  square
                >
                  <Box pt={1} display="flex">
                    <Box mx={1} height={100} position="relative" width={100}>
                      <img
                        alt={o.brandProductId}
                        src={CurrentImage}
                        height="100%"
                        width="100%"
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <CardContent
                        sx={{
                          flex: "1 0 auto",
                          p: 1,
                          "&:last-child": {
                            pb: 1,
                          },
                        }}
                      >
                        <Typography fontWeight="bold" lineHeight="1.3" mb={0.5}>
                          {o.productShortDescription}
                        </Typography>

                        <Stack
                          direction="row"
                          alignItems="center"
                          mb={0.5}
                          spacing={0.5}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            lineHeight="1.3"
                            mb={0.5}
                          >
                            <PricingFormat value={o.unitPrice} />
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            lineHeight="1.3"
                            mb={0.5}
                          >
                            X
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            lineHeight="1.3"
                            mb={0.5}
                          >
                            {o.invoiceQuantity}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            lineHeight="1.3"
                            mb={0.5}
                          >
                            =
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            lineHeight="1.3"
                            mb={0.5}
                          >
                            <PricingFormat value={o.totalPrice} />
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Box>
                  </Box>
                </Card>
              );
            }
          )}
        </Box>
      )}
      <Box height={10} />
    </Box>
  );
}
