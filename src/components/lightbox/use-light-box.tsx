import { useState, useCallback } from "react";

// ----------------------------------------------------------------------

export default function useLightBox(
  slides: Array<{ type: any; poster: any; src: any }>
) {
  const [selected, setSelected] = useState(-1);

  const handleOpen = useCallback(
    (slideUrl: { type: any; poster: any; src: any }) => {
      const slideIndex = slides.findIndex(
        (slide: { type: any; poster: any; src: any }) =>
          slide.type === "video"
            ? slide.poster === slideUrl.poster
            : slide.src === slideUrl.src
      );

      setSelected(slideIndex);
    },
    [slides]
  );

  const handleClose = useCallback(() => {
    setSelected(-1);
  }, []);

  return {
    selected,
    open: selected >= 0,
    onOpen: handleOpen,
    onClose: handleClose,
    setSelected,
  };
}
