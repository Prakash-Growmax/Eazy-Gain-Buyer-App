import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { sortBy } from "lodash";
import { useTranslation } from "react-i18next";
import MuIconify from "../iconify/mui-iconify";
import PricingFormat from "../PricingFormat";
interface DiscountTableProps {
  data: Array<{
    Value: number;
    min_qty: number;
    max_qty: number;
    // Add any other properties present in the 'data' array
  }>;
  suitableDiscount?: {
    Value: number;
    // Add any other properties present in the 'suitableDiscount' object
  };
  Product_Price: number;
  discount_Percentage: number;
  isOveridePricelist: boolean;
  roundOff?: number | undefined;
  unitOfMeasure?: any;
  secondaryUOM?: any;
}

const DiscountTable: React.FC<DiscountTableProps> = ({
  data,
  suitableDiscount,
  Product_Price,
  discount_Percentage,
  isOveridePricelist,
  roundOff,
  // unitOfMeasure,
  secondaryUOM,
}) => {
  const { t } = useTranslation("Product");

  return (
    <TableContainer
      sx={{
        borderRadius: 0.5,
        width: "95%",
        // margin: "8px",
        ml: "8px",
        mb: 1,
        // mr: "-10px",

        // border: (theme) => `3px solid ${theme.palette.primary.light}`,
        // boxShadow: 2,
      }}
      elevation={4}
      component={Paper}
    >
      <Table size="small" aria-label="simple table">
        <TableHead
          sx={{
            backgroundColor: "#0b5cff",
            color: "white",
          }}
        >
          <TableRow>
            <TableCell
              sx={{
                background: "inherit",
                color: "white",
              }}
              align="center"
            >
              {t("Quantity")}
            </TableCell>
            <TableCell
              sx={{
                background: "inherit",
                color: "white",
              }}
              align="center"
            >
              {t("Price")} / {secondaryUOM}
            </TableCell>
            <TableCell
              sx={{
                background: "inherit",
                color: "white",
              }}
              align="center"
            >
              {t("Profit")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            backgroundColor: "#0b5cff4d",
          }}
        >
          {sortBy(data, "Value")?.map((o) => {
            const Discount = !isOveridePricelist
              ? o.Value + discount_Percentage
              : o.Value;
            const Price = Product_Price - (Product_Price * Discount) / 100;
            return (
              <TableRow
                key={o.Value}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="center" component="th" scope="row">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {suitableDiscount?.Value === o?.Value && (
                      <MuIconify
                        icon={"material-symbols:star-outline"}
                        color="success.main"
                        width={15}
                      />
                    )}
                    <Typography variant="body2">
                      {o.max_qty === 999999
                        ? `>= ${o.min_qty}`
                        : ` ${o.min_qty}-${o.max_qty}`}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  <Typography variant="body2">
                    <PricingFormat value={Price} />
                  </Typography>
                  {/* &nbsp;
                <Typography color="text.disabled" variant="caption">
                  ({parseFloat(Discount?.toFixed(roundOff))}%)
              </Typography> */}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  <Typography variant="body2" color="text">
                   <PricingFormat value={Product_Price -Price } />
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DiscountTable;
