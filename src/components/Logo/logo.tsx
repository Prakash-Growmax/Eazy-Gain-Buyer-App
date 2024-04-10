"use client";
import Link from "next/link";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
const Logo = ({
  disabledLink = false,
  sx,
}: {
  disabledLink?: boolean;
  sx: SxProps;
}) => {
  const { palette } = useTheme();
  const logo = (
    <Box
      component="img"
      src={
        palette.mode === "dark"
          ? "/assets/logo/dark_eazy_gain_logo.svg"
          : "/assets/logo/light_eazy_gain_logo.svg"
      }
      sx={{ width: 40, height: 40, cursor: "pointer", ...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return <Link href="/">{logo}</Link>;
};

export default Logo;
