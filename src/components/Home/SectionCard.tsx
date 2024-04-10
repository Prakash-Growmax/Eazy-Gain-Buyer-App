"use client";
import LazyImage from "@/components/LazyImage";
import { Box, Paper, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import slugify from "slugify";
import TextMaxLine from "../TextMaxContent";

export default function CategoryTab({
  Data,
  isBrand,
}: {
  Data: any[];
  isBrand: boolean;
}) {
  const { i18n } = useTranslation();
  const { push } = useRouter();
  const handleClick = (data: any) => () => {
    if (isBrand) {
      push(`/p2/Brands?brandName=${slugify(data.brandsName)}&&brandId=b_${data?.brandId}`);
    } else {
      push(`/p2/${slugify(data.c_name)}/c_${data?.c_id}`);
    } 
  };

  return (
    <>
      <Box
        gap={1}
        display="flex"
        sx={{
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-start",
          rowGap: "0.75rem",
          columnGap: "0.5rem",
        }}
        flexWrap="wrap"
      >
        {Data.map((o) => (
          <Stack
            key={isBrand ? o.brandId : o.c_id}
            component={Paper}
            variant="outlined"
            spacing={1}
            onClick={handleClick(o)}
            alignItems="center"
            justifyContent="space-between"
            sx={{
              overflow: "hidden",
              borderRadius: "0.5rem",
              padding: "0.25rem",
              width: { xs: "calc(35% - 0.7rem)", sm: "calc(33% - 0.3rem)" ,md:"calc(25% - 0.4rem)"},
            }}
          >
            <Box position="relative" height={100} width={100}>
              <LazyImage
                alt={isBrand ? o.brandsName : o.c_name}
                layout="fill"
                sx={{
                  borderRadius: 1,
                  // objectFit: "contain",
                }}
                src={
                  isBrand
                    ? o.brandImage
                      ? o.brandImage
                      : "/assets/placeholder.png"
                    : o.c_imageSource
                    ? o.c_imageSource
                    : "/assets/placeholder.png"
                }
              />
            </Box>
            {!isBrand && (
              <TextMaxLine
                persistent
                variant="body2"
                sx={{ width: 1, mt: 2, mb: 0.5, textAlign: "center" }}
              >
                {i18n.language === "en" ? o.c_name : o.c_name_tamil}
              </TextMaxLine>
            )}
          </Stack>
        ))}
      </Box>
    </>
  );
}
