// @mui
import { useTheme, Theme } from "@mui/material/styles";
import { Variant } from "@mui/material/styles/createTypography";
import { useWidth } from "./useResponsive";
// hooks

// ----------------------------------------------------------------------

function remToPx(value: string): number {
  return Math.round(parseFloat(value) * 16);
}

export default function useTypography(variant: Variant) {
  const theme = useTheme();

  const breakpoints = useWidth();

  const key = theme.breakpoints.up(breakpoints === "xl" ? "lg" : breakpoints);

  const hasResponsive =
    variant === "h1" ||
    variant === "h2" ||
    variant === "h3" ||
    variant === "h4" ||
    variant === "h5" ||
    variant === "h6";

  const getFont =
    hasResponsive && theme.typography[variant][key]
      ? (theme.typography[variant][key] as Theme["typography"][Variant])
      : (theme.typography[variant] as Theme["typography"][Variant]) ?? {};

  const fontSizeValue: string | number = getFont?.fontSize || "";
  const fontSize = remToPx(
    typeof fontSizeValue === "number" ? fontSizeValue.toString() : fontSizeValue
  );
  const lineHeight = Number(theme.typography[variant].lineHeight) * fontSize;

  const { fontWeight, letterSpacing } = theme.typography[variant];

  return { fontSize, lineHeight, fontWeight, letterSpacing };
}
