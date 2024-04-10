import useSWR from "swr/immutable";
import useAxiosAuth from "./useAxiosAuth";

export default function useOrdersStatus(orderIdentifier: any) {
  const AxiosInstance = useAxiosAuth();
  const fetch = async () => {
    const data = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      url: `corecommerce/orders/orderTransaction?orderIdentifier=${orderIdentifier}`,
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
    });
    return data.data.data;
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    orderIdentifier ? `/orders-Products/${orderIdentifier}` : null,
    fetch,
    {
      shouldRetryOnError: false,
      // isPaused: () => UserLoading,
    }
  );

  return {
    OrdersStatusData: data || [],
    OrdersStatusDataError: error,
    OrdersStatusDataisLoading: isLoading,
    OrdersStatusDatamutate: mutate,
    OrdersStatusDataisValidating: isValidating,
  };
}
