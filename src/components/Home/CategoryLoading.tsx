"use client";
import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import React from "react";
import TextMaxLine from "../TextMaxContent";

export default function CategoryLoading() {
  return (
    <>
      <Box p={1}>
        <Typography my={1} gutterBottom variant="h6" color="text.secondary">
        <Skeleton />

        </Typography>
        <Box
          gap={1}
          display="flex"
          mt={1}
          sx={{
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-start",
            rowGap: "0.75rem",
            columnGap: "0.5rem",
          }}
          flexWrap="wrap"
        >
          {new Array(7).fill(0).map((o, i) => (
            <Stack
              key={i}
              component={Paper}
              variant="outlined"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              sx={{
                overflow: "hidden",
                borderRadius: "0.5rem",
                padding: "0.25rem",
                // width: "calc(30% - 0.8rem)",
                width: "calc(35% - 0.8rem)",
              }}
            >
              <Box position="relative" height={80} width="100%">
                <Skeleton height={80} width="100%" variant="rectangular" />
              </Box>
              <TextMaxLine
                persistent
                variant="caption"
                sx={{ width: 1, mt: 2, mb: 0.5, textAlign: "center" }}
              >
                <Skeleton />
              </TextMaxLine>
            </Stack>
          ))}
        </Box>
      </Box>
    </>
  );
}
