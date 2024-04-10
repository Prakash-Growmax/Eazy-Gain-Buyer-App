/* eslint-disable no-unused-vars */
import "@mui/material/styles";
import "@mui/material/Typography";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    fontWeightSemiBold: number;
  }

  // allow configuration using `createTheme`
  export interface TypographyVariantsOptions {
    fontWeightSemiBold?: number;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    fontWeightSemiBold: true;
  }
}
