import React from "react";
import MuIconify from "./iconify/mui-iconify";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const { back } = useRouter();
  return (
    <>
      <IconButton
        edge="start"
        color="default"
        size="large"
        onClick={() => {
          back();
        }}
        aria-label="close"
      >
        <MuIconify
          sx={{
            width: "inherit",
            height: "inherit",
          }}
          icon="ic:outline-chevron-left"
        />
      </IconButton>
    </>
  );
}
