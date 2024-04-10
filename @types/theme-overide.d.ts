/* eslint-disable no-unused-vars */
import {
  ThemeOptions as MuiOptions,
  Theme as MuiTheme,
  PaletteOptions,
} from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    [key: string]: any;
  }
  interface PaletteColor {
    lighter: string;
    [key: string]: any;
  }
  interface TypeBackground {
    neutral: string;
  }
}

declare module "@mui/material/styles" {
  interface Theme extends MuiTheme {
    customShadows: {
      z1: string;
      z4: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;
      card: string;
      dropdown: string;
      dialog: string;
      primary: string;
      info: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      [key: string]: any;
    };
  }
  interface ThemeOptions extends MuiOptions {
    customShadows?: {
      z1: string;
      z4: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;
      card: string;
      dropdown: string;
      dialog: string;
      primary: string;
      info: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      [key: string]: any;
      s;
    };
  }
}
