import useSWR from "swr/immutable";
import axios from "axios";
import FormatElastic from "@/lib/format-elastic";
import useUser from "./useUser";

export default function useProductImage(pathname: string, prdIds: any) {
  const { user } = useUser();
  const { userId } = user || {};

  const fetch = async () => {
    const elasticQuery = {
      Elasticindex: process.env.NEXT_PUBLIC_TENANT_ID + "pgandproducts",
      queryType: "search",
      ElasticType: "pgproduct",
      ElasticBody: {
        from: 0,
        size: prdIds.length,
        _source: ["productId", "productAssetss"],
        query: {
          bool: {
            must: [
              { terms: { productId: prdIds.map((o1: any) => o1.productId) } },
            ],
          },
        },
      },
    };
    const esdata = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + "elasticsearch/invocations",
      elasticQuery
    );
    return FormatElastic(esdata);
  };
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    userId && prdIds?.length
      ? `/${pathname}/${userId}` + prdIds.map((o1: any) => o1.productId)
      : null,
    fetch
  );

  return {
    ProductImagesData: data,
    ProductImagesDataError: error,
    ProductImagesDataisLoading: isLoading,
    ProductImagesDatamutate: mutate,
    ProductImagesDataisValidating: isValidating,
  };
}
