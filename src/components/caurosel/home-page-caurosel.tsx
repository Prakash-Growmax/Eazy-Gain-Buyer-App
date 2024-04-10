"use client";

import useCarousel from "@/components/caurosel/hooks/use-carousel";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Carousel from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import CarouselDots from "./carousel-dots";
import LazyImage from "../LazyImage";

export default function HomePageCaurosel({ data }: { data: any }) {


  const carousel = useCarousel({
    speed: 800,
    autoplay: true,
    lazyLoad: "ondemand",
    ...CarouselDots({
      rounded: true,
      sx: {
        right: 20,
        left: 20,
        bottom: 0,
        position: "absolute",
        color: "primary.light",
      },
    }),
  });
  const { listOfItemsMob } = data;

  return (
    <>
      <Card
        sx={{
          mx: 1,
        }}
      >
        <Carousel {...carousel.carouselSettings}>
          {listOfItemsMob.map((item: any) => (
            <CarouselItem key={item.id} item={item} />
          ))}
        </Carousel>
      </Card>
    </>
  );
}

function CarouselItem({ item }: { item: any }) {
  // const theme = useTheme();
  const { push } = useRouter();
  const {
    image,
    headline,
    showText,
    sliderLink,
    showActionButton,
    buttonColor,
    buttonLabel,
  } = item;
  const renderImg = (
    <LazyImage
      alt={"name"}
      src={image}
      fill={true}
      priority
      sx={{
        height: "100%",
        width: 1,

        objectFit: "cover",
      }}
    />
  );
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: 200,
        height: 200,
      }}
    >
      <CardContent
        onClick={() => {
          if (sliderLink) {
            push(sliderLink);
          }
        }}
        sx={{
          left: 0,
          width: 1,
          bottom: 0,
          zIndex: 9,
          textAlign: "left",
          position: "absolute",
          color: "common.white",
        }}
      >
        {showText && (
          <Typography noWrap variant="h5" sx={{ mt: 1, mb: 3 }}>
            {headline}
          </Typography>
        )}

        {showActionButton && (
          <Button
            color={"inherit"}
            sx={{
              background: buttonColor,
            }}
            onClick={() => {
              push(sliderLink);
            }}
            variant="contained"
          >
            {buttonLabel}
          </Button>
        )}
      </CardContent>
      {renderImg}
    </Box>
  );
}
