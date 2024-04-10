"use client";

import React from "react";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { findLastIndex } from "lodash";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import useOrdersStatus from "@/lib/hooks/useOrdersStatus";
import { FormatDate, actionStatus, statusColor } from "@/lib/OrderUtils";

export default function StatusDetails({
  orderIdentifier,
}: {
  orderIdentifier: any;
}) {
  const { OrdersStatusData } = useOrdersStatus(orderIdentifier);
  const { t } = useTranslation("orders");
  return (
    <>
      <Timeline
        sx={{
          p: 0,
        }}
        position="alternate"
      >
        {OrdersStatusData?.map((o: any, i: number) => (
          <TimelineItem key={o.id}>
            <TimelineSeparator>
              <TimelineDot
                variant="outlined"
                sx={{
                  color: statusColor(actionStatus(o.action, null)),
                  bgcolor: statusColor(actionStatus(o.action, null)),
                }}
              />
              {findLastIndex(OrdersStatusData) !== i && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent
              display="flex"
              flexDirection="column"
              sx={{
                fontSize: "0.5rem",
                pt: "14px",
              }}
            >
              <Typography variant="subtitle2">
                {
                  //@ts-ignore
                  t(actionStatus(o.action, null))
                }
              </Typography>
              <Typography variant="caption">
                {FormatDate(new Date(o.initiatedDateTime))}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
}
