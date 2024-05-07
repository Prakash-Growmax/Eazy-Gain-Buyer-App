"use client";
import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
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
          ? "/images/logo/dark_eazy_gain_logo.svg"
          : "/images/logo/light_eazy_gain_logo.svg"
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
