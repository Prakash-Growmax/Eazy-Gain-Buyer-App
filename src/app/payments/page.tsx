"use client";
import BackButton from "@/components/BackButton";
/* eslint-disable @next/next/no-img-element */
import PricingFormat from "@/components/PricingFormat";
import MuIconify from "@/components/iconify/mui-iconify";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import useBuildOrderProducts from "@/lib/hooks/useBuildOrderProducts";
import useBuildOrdersBody from "@/lib/hooks/useBuildOrdersBody";
import usePaymentIntegration from "@/lib/hooks/usePaymentIntegration";
import useUser from "@/lib/hooks/useUser";
import useCart from "@/lib/hooks/usecart";
import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import { find, sortBy } from "lodash";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Payment() {
  const { CartData, ClearCart } = useCart();
  const { back, ...otherRoutes } = useRouter();
  const { user } = useUser();
  const { t } = useTranslation("Payment");
  const AxiosInstance = useAxiosAuth();

  const { userId, accessToken, companyId } = user || {};
  const { CartValue, Products: CheckoutProducts } =
    useBuildOrderProducts(CartData);
  const { CreateOrderData, CreateOrderisLoading } = useBuildOrdersBody(
    CheckoutProducts,
    CartValue
  );

  const { PaymentData, PaymentisLoading: isLoading } = usePaymentIntegration();
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const razorPayData = PaymentData?.razorPayPaymentConfig;
  const Payments = [
    {
      ...razorPayData,
      message: `Pay with your Credit/Debit Card, Net Banking, Google Pay/UPI, Paytm/Wallets options.`,
    },
    {
      enabled: true,
      name: "COD",
      logo: "/assets/c_o_d.png",
      message: `${t("Pay with cash at the time of delivery")}`,
    },
  ];

  const [isOrderCreating, setIsOrderCreating] = useState(false);

  const handleCheckout = async () => {
    setIsOrderCreating(true);
    try {
      if (!CreateOrderisLoading) {
        const res = await AxiosInstance({
          baseURL: process.env.NEXT_PUBLIC_BASE_URL,
          headers: {
            Authorization: "Bearer " + accessToken,
            "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
          },
          url: `corecommerce/orders/createOrderByBuyer?userId=${userId}&companyId=${companyId}`,
          data: CreateOrderData,
          method: "POST",
        });
        await ClearCart();
        otherRoutes.replace("/order/success");
        setIsOrderCreating(false);
        return res?.data;
      }
    } catch (error) {
      console.log(error);
      setIsOrderCreating(false);
    }
  };
  const checkPaymentMode = async (mode: any) => {
    const resposne = await AxiosInstance({
      url:
        process.env.NEXT_PUBLIC_BASE_URL + `corecommerce/paymentMode/fetchAll`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        // origin: DomainName,
      },
    });

    const paymentModes = sortBy(resposne?.data?.data, ["mode"]);
    // setAllPaymentsMode(paymentModes);
    switch (mode) {
      case "card": {
        return find(paymentModes, ["mode", "Card"]).id;
      }
      case "upi": {
        return find(paymentModes, ["mode", "UPI"]).id;
      }
      case "netbanking": {
        //! we dont have "Net Banking" mode in payment Modes, so am changing it .
        return find(paymentModes, ["mode", "Bank transfer"]).id;
      }
      case "bank_transfer": {
        return find(paymentModes, ["mode", "Bank transfer"]).id;
      }
      case "wallet": {
        return find(paymentModes, ["mode", "Wallet"]).id;
      }
      case "bnpl_rupifi": {
        return find(paymentModes, ["mode", "Pay later"]).id;
      }
      default: {
        return find(paymentModes, ["mode", "Others"]).id;
      }
    }
  };
  interface addPaymentResponseType {
    razorpay_payment_id?: string; // Define razorpay_payment_id as an optional property
    // Add other properties if needed
  }
  async function addPayment(
    res: addPaymentResponseType,
    orderIdentifier: string
  ) {
    try {
      let fetchPaymentDetails;
      const razorpay_Response = await AxiosInstance({
        url: "/api/getRazorpayPaymentDetails",
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
          "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        },
        data: {
          tenantId: user?.tenantId,
          razorpay_payment_id: res?.razorpay_payment_id,
        },
      });
      fetchPaymentDetails = razorpay_Response?.data;
      fetchPaymentDetails.referencesNumber = res?.razorpay_payment_id;
      const paymentModeId = await checkPaymentMode(fetchPaymentDetails?.method);
      var data = {
        amountReceived: CartValue.grandTotal,
        paymentDate: new Date().toISOString(),
        paymentModeId,
        refernceNumber: fetchPaymentDetails?.refernceNumber,
        notes: "",
        attachments: "",
        bankBranch: "",
        payeeName: user?.displayName,
        currencyId: user?.currency?.id,
        chequeNumber: null,
        chequekDate: null,
        cardType: "",
        holderName: "",
        phoneNumber: fetchPaymentDetails.contact
          ? fetchPaymentDetails.contact
          : "",
        ifscCode: "",
        email: fetchPaymentDetails.email ? fetchPaymentDetails.email : "",
        buyerBranchId: CreateOrderData?.buyerBranchId,
        buyerCompanyId: CreateOrderData?.buyerCompanyId,
        createdBy: userId,
        ccNumber: 0,
        adjustFromWallet: false,
        adjustFromOrder: false,
        againstOrder: true,
        againstWallet: false,
        againstInvoice: false,
        b2cUserId: null,
        b2C: false,
        gateWay3ppCode:
          selectedPayment === "RAZOR PAY" ? "RAZORPAY" : selectedPayment,
        paymentAdjustments: [
          {
            orderIdentifier: orderIdentifier,
            adjustmentAmount: CartValue.grandTotal,
            paymentReferences: [],
          },
        ],
      };
      await AxiosInstance({
        url:
          process.env.NEXT_PUBLIC_BASE_URL + `corecommerce/payment/addPayment`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
          "Content-Type": "application/json",
        },
        data: data,
      });
    } catch (error: any) {
      // enqueueSnackbar(error?.message || "Something went wrong", {
      //   variant: "error",
      // });
    }
  }
  const [submitting, setSubmitting] = useState(false);
  async function handleRazorPaySubmit(razorPayResponse: any) {
    setSubmitting(true);
    const response = await handleCheckout();
    const orderIdentifier = response?.data?.orderIdentifier;
    await addPayment(razorPayResponse, orderIdentifier);
    setSubmitting(false);
    otherRoutes.replace("/order/success");
  }

  async function handleRazorPayPayment() {
    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      let options = {
        key: razorPayData?.apiKey,
        amount: Number((CartValue.grandTotal || 0) * 100),
        currency: "INR",
        name: CreateOrderData?.sellerCompanyName,
        description: "Payment",
        image: "/logo/dark_eazy_gain_logo.svg",
        handler: handleRazorPaySubmit,
        modal: {
          confirm_close: true,
          escape: false,
        },
        theme: {
          color: "primary",
          hide_topbar: false,
        },
      };
      const ISSERVER = typeof window === "undefined";
      if (!ISSERVER) {
        var rzp1 = new (window as any).Razorpay(options).on(
          "payment.failed",
          function (response: any) {
            console.log(response);
          }
        );
        rzp1.open();
      }
    } catch (error: any) {
      // enqueueSnackbar(error?.message || "Something went wrong", {
      //   variant: "error",
      // });
    }
  }

  async function handlePaymentProceed() {
    try {
      if (selectedPayment === "COD") {
        await handleCheckout();
        await ClearCart();
        otherRoutes.replace("/order/success");
      } else if (selectedPayment === "RAZOR PAY") {
        await handleRazorPayPayment();
        await ClearCart();
        otherRoutes.replace("/order/success");
      }
    } catch (error: any) {
      // enqueueSnackbar(error?.message || "Something went wrong", {
      //   variant: "error",
      // });
    }
  }

  return (
    <Dialog disablePortal disableScrollLock fullScreen open={true}>
      <AppBar color="inherit" sx={{ position: "relative" }}>
        <Toolbar variant="dense">
          <BackButton />
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t("Payment Options")}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 0.5, height: "100%" }}>
        {isLoading && <PaymentSkeleton />}

        {!isLoading && (
          <RadioGroup
            aria-label={"Payment-selection"}
            name={"paymentGateway"}
            value={selectedPayment}
            onChange={(ev) => {
              setSelectedPayment(ev.target.value);
            }}
          >
            {Payments?.length > 0 &&
              Payments.filter((o) => o.enabled).map((payment, index) => (
                <Fragment key={payment?.name || index}>
                  <GatewayCard
                    data={payment}
                    CartValue={{ grandTotal: CartValue.grandTotal }}
                    selectedPayment={selectedPayment}
                    isOrderCreating={isOrderCreating || submitting}
                    handlePaymentProceed={handlePaymentProceed}
                  />
                </Fragment>
              ))}
          </RadioGroup>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface GatewayCardPropsType {
  data: {
    name: string;
    message: string;
    logo: string;
  };
  CartValue: {
    grandTotal: number;
  };
  selectedPayment: string;
  isOrderCreating: boolean;
  handlePaymentProceed: () => {};
}

const GatewayCard = ({
  data,
  CartValue,
  selectedPayment,
  handlePaymentProceed,
  isOrderCreating,
}: GatewayCardPropsType) => {
  const { t } = useTranslation("Payment");

  return (
    <>
      <Box
        borderTop={"1px solid rgba(0, 65, 132, 0.1)"}
        borderBottom={"1px solid rgba(0, 65, 132, 0.1)"}
        p={2}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"start"}
        width={"100%"}
        bgcolor={
          data.name === selectedPayment
            ? `linear-gradient(89.03deg, rgba(216, 36, 68, 0.1) 0.43%, rgba(95, 167, 221, 0.1) 99.42%)`
            : ""
        }
      >
        <Box display="flex" flexDirection="row" width="100%">
          <FormControlLabel
            sx={{ alignItems: "center", flexGrow: 1 }}
            value={data.name}
            control={<Radio name="credit" color="primary" />}
            label={
              <Box>
                <Box
                  display="flex"
                  sx={{
                    "& img": {
                      background: (theme) =>
                        theme.palette.mode === "dark" && data?.name !== "COD"
                          ? "white"
                          : "unset",
                    },
                  }}
                  flexDirection="row"
                  alignItems="center"
                >
                  <img
                    alt={data?.name}
                    src={data?.logo}
                    style={{
                      width: "150px",
                      height: data.name === "COD" ? "150px" : "50px",
                    }}
                  />
                  <Box flexGrow={1} />
                </Box>
              </Box>
            }
          ></FormControlLabel>
        </Box>
        <Typography variant="h6">{data?.message || ""}</Typography>
        <Box display={"flex"} width="100%" mt={1}>
          {data.name === selectedPayment && (
            <Box display="flex">
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                variant="h5"
              >
                {t("TotalPrice")}&nbsp;
                <Box
                  component={Typography}
                  variant="h4"
                  color="error.main"
                  pr={2}
                >
                  <PricingFormat value={CartValue.grandTotal} />
                </Box>
              </Typography>
              <Box flexGrow={1} />
            </Box>
          )}
        </Box>
      </Box>
      <AppBar
         position="fixed"
         color="inherit"
         sx={{ top: "auto", bottom: 0 }}
      >
        <Toolbar>
        <LoadingButton
        fullWidth
          loading={isOrderCreating}
          onClick={handlePaymentProceed}
          variant="contained"
          size="large"
          color="warning"
        >
          {t("Place Order")}
        </LoadingButton>
        </Toolbar>
        
      </AppBar>
    </>
  );
};

const PaymentSkeleton = () => {
  return (
    <Box m={1}>
      {new Array(4).fill(0).map((data) => (
        <Fragment key={data}>
          <Box ml={4} my={2}>
            <Skeleton width="30%" height="50%" variant="text"></Skeleton>
            <Skeleton width="50%" height="20%" variant="text"></Skeleton>
          </Box>
          <Divider />
        </Fragment>
      ))}
    </Box>
  );
};
