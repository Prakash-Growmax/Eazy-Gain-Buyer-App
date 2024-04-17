"use client";

import { Box, Skeleton } from "@mui/material";

export default function BannerLoading() {
  return (
    <Box
      sx={{
        mx: 1,
      }}
    >
      <Skeleton variant="rectangular" height={200}  />
    </Box>
  );
}
