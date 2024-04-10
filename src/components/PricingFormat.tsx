import accounting from "accounting";
import React from "react";

interface PricingFormatProps {
  value: any;
}

const PricingFormat: React.FC<PricingFormatProps> = ({ value }) => {
  // const { currency } = user || {};
  const { symbol, decimal, thousand, precision } = {
    decimal: ".",
    precision: 2,
    symbol: "₹",
    thousand: ",",
  };

  return (
    <>
      {accounting.formatMoney(parseFloat(value), {
        symbol,
        decimal,
        thousand,
        precision,
      })}
    </>
  );
};

export default PricingFormat;
