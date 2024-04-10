import React, { forwardRef, ReactNode, Ref } from "react";
import Typography, { TypographyOwnProps } from "@mui/material/Typography";
import useTypography from "@/lib/hooks/useTypography";
import { Variant } from "@mui/material/styles/createTypography";
import { SxProps } from "@mui/material";
import { Theme } from "@mui/system";

interface TextMaxLineProps extends TypographyOwnProps {
  variant?: Variant;
  line?: number;
  persistent?: boolean;
  children: ReactNode;
  sx?: SxProps<any> | undefined;
}

const TextMaxLine = forwardRef(
  (
    {
      variant = "body1",
      line = 2,
      persistent = false,
      children,
      sx,
      ...other
    }: TextMaxLineProps,
    ref: Ref<any>
  ) => {
    const { lineHeight } = useTypography(variant);

    const styles = {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: line,
      WebkitBoxOrient: "vertical",
      ...(persistent && {
        height: lineHeight * line,
      }),
      ...sx,
    };

    return (
      //@ts-ignore
      <Typography ref={ref} variant={variant} sx={{ ...styles }} {...other}>
        {children}
      </Typography>
    );
  }
);

TextMaxLine.displayName = "TextMaxLine";
export default TextMaxLine;
