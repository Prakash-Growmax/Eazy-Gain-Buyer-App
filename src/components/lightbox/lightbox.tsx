import React, { ReactNode } from "react";
import ReactLightbox, {
  useLightboxState,
  LightboxExternalProps,
} from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Box from "@mui/material/Box";
import StyledLightbox from "./styles";
import MuIconify from "../iconify/mui-iconify";
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
// ----------------------------------------------------------------------

const ICON_SIZE = 24;

interface CustomLightboxProps extends LightboxExternalProps {
  disabledCaptions?: boolean | any;
  disabledFullscreen?: boolean | any;
  disabledSlideshow?: boolean | any;
  disabledThumbnails?: boolean | any;
  disabledTotal?: boolean | any;
  disabledVideo?: boolean | any;
  disabledZoom?: boolean | any;
  // eslint-disable-next-line no-unused-vars
  onGetCurrentIndex?: (index: number) => void;
  slides?: Array<any>; // Adjust the type accordingly
  [key: string]: any; // For any other props
}

export default function Lightbox({
  slides,
  disabledZoom,
  disabledVideo,
  disabledTotal,
  disabledCaptions,
  disabledSlideshow,
  disabledThumbnails,
  disabledFullscreen,
  onGetCurrentIndex,
  ...other
}: CustomLightboxProps) {
  const totalItems = slides ? slides.length : 0;

  return (
    <>
      <StyledLightbox />

      <ReactLightbox
        slides={slides}
        animation={{ swipe: 240 }}
        carousel={{ finite: totalItems < 5 }}
        controller={{ closeOnBackdropClick: true }}
        plugins={getPlugins({
          disabledZoom,
          disabledVideo,
          disabledCaptions,
          disabledSlideshow,
          disabledThumbnails,
          disabledFullscreen,
        })}
        on={{
          view: ({ index }: { index: number }) => {
            if (onGetCurrentIndex) {
              onGetCurrentIndex(index);
            }
          },
        }}
        toolbar={{
          buttons: [
            <DisplayTotal
              key={0}
              totalItems={totalItems}
              disabledTotal={disabledTotal}
            />,
            "close",
          ],
        }}
        render={{
          iconClose: () => <MuIconify width={ICON_SIZE} icon="carbon:close" />,
          iconZoomIn: () => (
            <MuIconify width={ICON_SIZE} icon="carbon:zoom-in" />
          ),
          iconZoomOut: () => (
            <MuIconify width={ICON_SIZE} icon="carbon:zoom-out" />
          ),
          iconSlideshowPlay: () => (
            <MuIconify width={ICON_SIZE} icon="carbon:play" />
          ),
          iconSlideshowPause: () => (
            <MuIconify width={ICON_SIZE} icon="carbon:pause" />
          ),
          iconPrev: () => (
            <MuIconify width={ICON_SIZE + 8} icon="carbon:chevron-left" />
          ),
          iconNext: () => (
            <MuIconify width={ICON_SIZE + 8} icon="carbon:chevron-right" />
          ),
          iconExitFullscreen: () => (
            <MuIconify width={ICON_SIZE} icon="carbon:center-to-fit" />
          ),
          iconEnterFullscreen: () => (
            <MuIconify width={ICON_SIZE} icon="carbon:fit-to-screen" />
          ),
        }}
        {...other}
      />
    </>
  );
}

interface DisplayTotalProps {
  disabledTotal?: boolean;
  totalItems: number;
}

export function DisplayTotal({
  totalItems,
  disabledTotal,
}: DisplayTotalProps): ReactNode {
  const { currentIndex } = useLightboxState();

  if (disabledTotal) {
    return null;
  }

  return (
    <Box
      component="span"
      className="yarl__button"
      sx={{
        typography: "body2",
        alignItems: "center",
        display: "inline-flex",
        justifyContent: "center",
      }}
    >
      <strong> {currentIndex + 1} </strong> / {totalItems}
    </Box>
  );
}

export function getPlugins({
  disabledZoom,
  disabledVideo,
  disabledCaptions,
  disabledSlideshow,
  disabledThumbnails,
  disabledFullscreen,
}: {
  disabledZoom: boolean | undefined;
  disabledVideo: boolean | undefined;
  disabledCaptions: boolean | undefined;
  disabledSlideshow: boolean | undefined;
  disabledThumbnails: boolean | undefined;
  disabledFullscreen: boolean | undefined;
}) {
  let plugins = [Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom];

  if (disabledThumbnails) {
    plugins = plugins.filter((plugin) => plugin !== Thumbnails);
  }
  if (disabledCaptions) {
    plugins = plugins.filter((plugin) => plugin !== Captions);
  }
  if (disabledFullscreen) {
    plugins = plugins.filter((plugin) => plugin !== Fullscreen);
  }
  if (disabledSlideshow) {
    plugins = plugins.filter((plugin) => plugin !== Slideshow);
  }
  if (disabledZoom) {
    plugins = plugins.filter((plugin) => plugin !== Zoom);
  }
  if (disabledVideo) {
    plugins = plugins.filter((plugin) => plugin !== Video);
  }

  return plugins;
}
