"use client";
import React from "react";
import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import TextMaxLine from "@/components/TextMaxContent";

export default function ProductCardLoading() {
  return new Array(10).fill(0).map((_, i) => (
    <Card variant="outlined" sx={{ mb: 0.5 }} key={i}>
      <Box display="flex">
        <Box
          position="relative"
          minWidth={125}
          minHeight={125}
          maxWidth={125}
          maxHeight={125}
          margin={1}
        >
          <Skeleton variant="rectangular" width={125} height={125} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }} width="100%">
          <CardContent sx={{ flex: "1 0 auto" }}>
            <TextMaxLine width="100%" line={2} variant="h5">
              <Skeleton width="100%" />
            </TextMaxLine>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              <Skeleton
                sx={{
                  my: 1,
                }}
                width={"100%"}
                variant="text"
              />
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </Card>
  ));
}
