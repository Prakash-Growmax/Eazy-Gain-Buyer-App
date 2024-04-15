"use client";
import React, { ElementType, Ref, forwardRef } from "react";
import {
  LazyLoadImage,
  LazyLoadImageProps,
} from "react-lazy-load-image-component";
// @mui
import Box, { BoxProps } from "@mui/material/Box";
import { Theme, alpha, useTheme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
//
import { getRatio } from "./utils";

// ----------------------------------------------------------------------

interface ImageProps {
  ratio?:
    | "4/3"
    | "3/4"
    | "6/4"
    | "4/6"
    | "16/9"
    | "9/16"
    | "21/9"
    | "9/21"
    | "1/1";
  overlay?: string;
  disabledEffect?: boolean;
  alt: string;
  src: string;
  afterLoad?: () => void;
  delayTime?: number;
  threshold?: number;
  beforeLoad?: () => void;
  delayMethod?: string;
  placeholder?: React.ReactElement;
  wrapperProps?: LazyLoadImageProps["wrapperProps"];
  scrollPosition?: LazyLoadImageProps["scrollPosition"];
  effect?: LazyLoadImageProps["effect"];
  visibleByDefault?: boolean;
  wrapperClassName?: string;
  useIntersectionObserver?: boolean;
  sx?: SxProps<Theme> & BoxProps;
}

const Image = forwardRef<HTMLSpanElement, ImageProps>(
  (
    {
      ratio,
      overlay,
      disabledEffect = false,
      alt,
      src,
      afterLoad,
      delayTime,
      threshold,
      beforeLoad,
      delayMethod,
      placeholder,
      wrapperProps,
      scrollPosition,
      effect = "blur",
      visibleByDefault,
      wrapperClassName,
      useIntersectionObserver,
      sx,
      ...other
    },
    ref: Ref<HTMLSpanElement>
  ) => {
    const theme = useTheme();

    const overlayStyles = !!overlay && {
      "&:before": {
        content: "''",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 1,
        position: "absolute",
        background: overlay || alpha(theme.palette.grey[900], 0.48),
      },
    };

    const content = (
      <Box
        component={LazyLoadImage as ElementType}
        //
        alt={alt}
        src={src}
        afterLoad={afterLoad}
        delayTime={delayTime}
        threshold={threshold}
        beforeLoad={beforeLoad}
        delayMethod={delayMethod}
        placeholder={placeholder}
        wrapperProps={wrapperProps}
        scrollPosition={scrollPosition}
        visibleByDefault={visibleByDefault}
        effect={disabledEffect ? undefined : effect}
        useIntersectionObserver={useIntersectionObserver}
        wrapperClassName={wrapperClassName || "component-image-wrapper"}
        placeholderSrc={
          disabledEffect ? "/assets/transparent.png" : "/assets/placeholder.png"
        }
        //
        sx={{
          width: 1,
          height: 1,
          objectFit: "cover",
          verticalAlign: "bottom",
          ...(!!ratio && {
            top: 0,
            left: 0,
            position: "absolute",
          }),
          ...(sx as any),
        }}
      />
    );

    return (
      <Box
        ref={ref}
        component="span"
        className="component-image"
        sx={{
          overflow: "hidden",
          position: "relative",
          verticalAlign: "bottom",
          display: "inline-block",
          ...(!!ratio && {
            width: 1,
          }),
          "& span.component-image-wrapper": {
            width: 1,
            height: 1,
            verticalAlign: "bottom",
            backgroundSize: "cover !important",
            ...(!!ratio && {
              pt: getRatio(ratio),
            }),
          },
          ...overlayStyles,
          ...(sx as any),
        }}
        {...other}
      >
        {content}
      </Box>
    );
  }
);
Image.displayName = "Custom Image";
export default Image;
