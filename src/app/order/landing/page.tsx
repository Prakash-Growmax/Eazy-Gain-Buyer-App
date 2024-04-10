"use client";
import PricingFormat from "@/components/PricingFormat";
import Label from "@/components/label/label";
import { FormatDate, bgColor, statusColor } from "@/lib/OrderUtils";
import useOrdersLanding from "@/lib/hooks/useOrdersLanding";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import { lighten } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function OrderLanding() {
  // const [Tabvalue, setTabvalue] = React.useState(0);
  let result = 5;
  const { t } = useTranslation("orders");

  const [pagenumber, setpagenumber] = useState(1);
  const {
    OrdersLandingData,
    totalOrderCount,
    OrdersLandingDataisValidating,
    OrdersLandingDataisLoading,
  } = useOrdersLanding(result, pagenumber);
  const { push } = useRouter();
  const handleLoadMore = () => {
    setpagenumber(pagenumber + 1);
  };

  return (
    <>
      {OrdersLandingDataisLoading &&
        new Array(5).fill(0).map((o, i) => (
          <Card
            variant="outlined"
            sx={{
              mb: 1,
              mx: 1,
              // borderRadius: 0,
            }}
            key={i}
          >
            <CardHeader title={<Skeleton />} subheader={<Skeleton />} />
            <CardContent
              sx={{
                pb: 0,
              }}
            >
              <Box mb={2} display="flex" justifyContent="space-between">
                <Label
                  sx={{
                    width: "102px",
                  }}
                >
                  <Skeleton />
                </Label>
                <Typography fontWeight="bold" color="success.main">
                  <Skeleton />
                </Typography>
              </Box>
              <Divider />
              <Skeleton width="100%" />
              <Divider />
            </CardContent>
          </Card>
        ))}
      {OrdersLandingData?.map((o: any, i) => (
        <Card
          variant="outlined"
          onClick={() => {
            push(`/order/detail/${o.orderIdentifier}`);
          }}
          sx={{
            mb: 1,
            mx: 1,
            // borderRadius: 0,
          }}
          key={i}
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
                  {o.orderName}
                </Typography>
                <Label
                  sx={{
                    bgcolor: `${bgColor(
                      o.updatedBuyerStatus,
                      lighten
                    )} !important`,
                    color: `${statusColor(o.updatedBuyerStatus)} !important`,
                    border: `1px solid ${statusColor(o.updatedBuyerStatus)}`,
                    // ml: 3,
                    // mb: 2,
                  }}
                  // bgColor={bgColor(o.updatedBuyerStatus)}
                  variant={"outlined"}
                  // color={statusColor(o.updatedBuyerStatus)}
                >
                  {t(o.updatedBuyerStatus)}
                </Label>
              </Box>
            }
            subheader={
              <Typography width="55%" flexGrow={1} variant="caption">
                {o.orderIdentifier} Order on &nbsp;
                {FormatDate(new Date(o.createdDate))}
              </Typography>
            }
          />

          <Divider />
          <CardContent
            sx={{
              // pb: `0px !important`,
              p: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="medium" variant="subtitle2">
                {t("TotalPrice")}
              </Typography>
              <Typography fontWeight="medium" variant="subtitle2">
                <PricingFormat value={o.grandTotal} />
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="medium" variant="subtitle2">
                {t("TotalItems")}
              </Typography>
              <Typography fontWeight="medium" variant="subtitle2">
                {o.itemcount}
              </Typography>
            </Box>
          </CardContent>
          {/* <CardActions
            sx={{
              justifyContent: "center",
            }}
          >
            <Link
              onClick={() => {
                if (OpenOrdetails.isOpen[o.orderIdentifier]) {
                  SetOpenOrderDetails({
                    isOpen: {
                      [o.orderIdentifier]: false,
                    },
                    data: o,
                  });
                } else {
                  SetOpenOrderDetails({
                    isOpen: {
                      [o.orderIdentifier]: true,
                    },
                    data: o,
                  });
                }
              }}
            >
              OrderDetails
              <MuIconify
                sx={{
                  verticalAlign: "middle",
                }}
                icon={
                  !OpenOrdetails.isOpen[o.orderIdentifier]
                    ? "zondicons:cheveron-down"
                    : "zondicons:cheveron-up"
                }
              />
            </Link>
          </CardActions> */}
          {/* <Collapse in={OpenOrdetails.isOpen[o.orderIdentifier]} unmountOnExit>
            <CardContent>
              <OrderDetails OpenOrdetails={OpenOrdetails} />
            </CardContent>
          </Collapse> */}
        </Card>
      ))}
      {(totalOrderCount > OrdersLandingData?.length ||
        OrdersLandingDataisValidating) && (
        <Box display="flex" justifyContent="center" mb={2}>
          <LoadingButton
            onClick={handleLoadMore}
            color="primary"
            variant="contained"
            loading={OrdersLandingDataisValidating}
          >
            Load More
          </LoadingButton>
        </Box>
      )}
      <Toolbar variant="dense" />
    </>
  );
}
