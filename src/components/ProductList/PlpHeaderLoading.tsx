"use client";
import { StyledTab, StyledTabs } from "@/components/ProductList/PlpHeader";
import TextMaxLine from "@/components/TextMaxContent";
import { AppBar, Box, Skeleton, Toolbar } from "@mui/material";
import React from "react";

export default function PlpHeaderLoading() {
  return (
    <>
      <AppBar color="inherit" elevation={2}>
        <Toolbar disableGutters variant="dense">
          <TextMaxLine
            variant="h6"
            flexGrow={1}
            fontWeight="500"
            color="text.primary"
            line={1}
          >
            <Skeleton />
          </TextMaxLine>
        </Toolbar>
        <StyledTabs variant="scrollable" aria-label="styled tabs example">
          {new Array(10).fill(0).map((_, i) => (
            <StyledTab
              key={i}
              value={0}
              iconPosition="start"
              label={<Skeleton width="100%" height={32} />}
            />
          ))}
        </StyledTabs>
      </AppBar>
      <Toolbar
        sx={{
          height: 90,
        }}
      />
    </>
  );
}
