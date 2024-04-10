"use client";
import { Typography } from "@mui/material";

import React from "react";
import { useTranslation } from "react-i18next";

export default function SectionTitle({ isBrand }: { isBrand: boolean }) {
  const { t } = useTranslation("Home");
  return (
    <Typography my={1} gutterBottom variant="h6" color="text.secondary">
      {t(isBrand ? "brands" : "categories")}
    </Typography>
  );
}
