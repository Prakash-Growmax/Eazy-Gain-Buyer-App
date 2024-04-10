"use client";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { palette } from "./pallete";
import { merge } from "lodash";
import { typography } from "./typography";
import { customShadows } from "./custom-shadows";
import { shadows } from "./shadows";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const isBrowserDefaultDark =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  const baseOption = React.useMemo(
    () => ({
      palette: palette(isBrowserDefaultDark ? "dark" : "light"),
      typography,
      shadows: shadows(isBrowserDefaultDark ? "dark" : "light"),
      customShadows: customShadows(isBrowserDefaultDark ? "dark" : "light"),
      shape: { borderRadius: 8 },
    }),

    [isBrowserDefaultDark]
  );
  const memoizedValue = React.useMemo(() => merge(baseOption), [baseOption]);
  const theme = createTheme({
    ...memoizedValue,
  });
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
