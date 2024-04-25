"use client";
import { Box, Button, Paper, Typography } from "@mui/material";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";

export default function OrderSuccess() {
  const { replace } = useRouter();
  const { t } = useTranslation("orders");
  return (
    <Box position="relative">
      <Box
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent={"center"}
        component={Paper}
        width="100%"
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translate(0, 19%)",
          textAlign: "center",
          ...{
            borderRadius: "16px",
            width: {
              xs: "95%",
              md: "25%",
            },
            p: 2,
            m: 1,
          },
        }}
      >
        <Box position={"relative"} width="100%" height="130px" mb={1}>
          <Image
            layout="fill"
            priority
            alt={"notification"}
            src={"/assets/success.gif"}
            objectFit={"contain"}
          />
        </Box>
        <Typography variant="h4" color="rgb(0, 171, 85)" mb={1}>
          {t("Congratulations")}
        </Typography>
        <Typography variant="h6" color="inherit" mb={2}>
          {t("Your Order has been placed successfully !")}
        </Typography>
        <Button
          onClick={() => {
            replace("/");
          }}
          variant="outlined"
          color="primary"
          size="large"
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
}
