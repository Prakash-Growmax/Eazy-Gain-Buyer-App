import useSWR from "swr/immutable";
import useUser from "./useUser";
import useAxiosAuth from './useAxiosAuth';


export default function useOrdersDetails(orderIdentifier: any) {
  const { user } = useUser();
  const { userId, companyId } = user || {};
  const AxiosInstance = useAxiosAuth()
  const fetch = async () => {
    const data = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      url: `corecommerce/orders/fetchOrderDetails?orderIdentifier=${orderIdentifier}&userId=${userId}&companyId=${companyId}`,
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
    });
    return data.data.data;
  };
  
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    userId && orderIdentifier
      ? `/orders-Products/${userId}/${orderIdentifier}`
      : null,
    fetch,
    {
      shouldRetryOnError: false,
      // isPaused: () => UserLoading,
    }
  );

  return {
    OrdersDetailsData: data || {},
    OrdersDetailsDataError: error,
    OrdersDetailsDataisLoading: isLoading,
    OrdersDetailsDatamutate: mutate,
    OrdersDetailsDataisValidating: isValidating,
  };
}
