"use client";
import BackButton from "@/components/BackButton";
import ProductCard from "@/components/ProductCard";
import MuIconify from "@/components/iconify/mui-iconify";
import FormatElastic from "@/lib/format-elastic";
import useDiscounts from "@/lib/hooks/useDiscounts";
import { serchquery } from "@/lib/search-queries";
import { AppBar, IconButton, TextField, Toolbar } from "@mui/material";
import axios from "axios";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

const fetchData = async (query: string, cb: any) => {
  if (!query.length) return;
  const body = {
    Elasticindex: process.env.NEXT_PUBLIC_TENANT_ID + "pgandproducts",
    queryType: "search",
    ElasticType: "pgproduct",
    ElasticBody: serchquery(query),
  };
  const data = await axios({
    method: "POST",
    url: process.env.NEXT_PUBLIC_BASE_URL + "elasticsearch/invocations",
    data: body,
  });
  const res = FormatElastic(data);
  cb(res);
};

const debouncedFetchData = debounce((query, cb) => {
  fetchData(query, cb);
}, 500);
export default function Search() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  React.useEffect(() => {
    debouncedFetchData(query, (res: any) => {
      setResults(res);
    });
  }, [query]);
  const { DiscountData, DiscountisLoading } = useDiscounts(
    `searct/${query}`,
    results.map((o: any) => o.productId)
  );
  const {t} = useTranslation('Home')
  return (
    <>
      <AppBar color="inherit">
        <Toolbar
          sx={{
            px: 0.5,
          }}
        >
          <BackButton />
          <TextField
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => {
              setQuery(e.target.value);
            }}
            value={query}
            placeholder={t('Search')}
            size="small"
            autoComplete="off"
            autoFocus
            fullWidth
          />
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ mb: 1 }} />
      {results.map((o: any) => (
        <ProductCard
          data={o}
          key={o.productId}
          DiscountData={DiscountData}
          DiscountisLoading={DiscountisLoading}
        />
      ))}
      {/* <ProductList
        productData={results}
        isSearch
        openSummary={undefined}
        setOpenSummary={undefined}
      /> */}
    </>
  );
}
