"use client";

import { useRef, useCallback, useState } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import { Settings } from "react-slick";

// ----------------------------------------------------------------------

interface CarouselSettings {
  arrows?: boolean;
  dots?: boolean;
  fade?: boolean;
  customPaging?: any; // Replace 'any' with the correct type if possible
  rtl?: boolean;
  // eslint-disable-next-line no-unused-vars
  beforeChange?: (current: number, next: number) => void;
  // Add any other properties required for the 'props' parameter
}

interface CarouselProps extends Settings {}

export default function useCarousel(props: CarouselProps) {
  const theme = useTheme();

  const carouselRef = useRef<any>(null); // Replace 'any' with the correct type if possible

  const [currentIndex, setCurrentIndex] = useState<number>(
    props?.initialSlide || 0
  );

  const [nav, setNav] = useState<any>(undefined); // Replace 'any' with the correct type if possible

  const rtl = theme.direction === "rtl";

  const carouselSettings: CarouselSettings = {
    arrows: false,
    dots: !!props?.customPaging,
    rtl,
    beforeChange: (current, next) => setCurrentIndex(next),
    ...props,
    fade: !!(props?.fade && !rtl),
  };

  const onSetNav = useCallback(() => {
    if (carouselRef.current) {
      setNav(carouselRef.current);
    }
  }, []);

  const onPrev = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.slickPrev();
    }
  }, []);

  const onNext = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.slickNext();
    }
  }, []);

  const onTogo = useCallback((index: number) => {
    if (carouselRef.current) {
      carouselRef.current.slickGoTo(index);
    }
  }, []);

  return {
    nav,
    carouselRef,
    currentIndex,
    carouselSettings,
    //
    onPrev,
    onNext,
    onTogo,
    onSetNav,
    //
    setNav,
    setCurrentIndex,
  };
}
