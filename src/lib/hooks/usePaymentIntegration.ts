import useSWR from "swr/immutable";
import useAxiosAuth from "./useAxiosAuth";
import useUser from "./useUser";

export default function usePaymentIntegration() {
  const { user } = useUser();
  const AxiosInstance = useAxiosAuth()
  const fetch = async () => {
    const data = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      url: `growmaxpayments/payment/gatewayConfig/get?tenantCode=${process.env.NEXT_PUBLIC_TENANT_ID}`,
      method: "GET",
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
    });
    return data.data.data;
  };
  const { data, error, isLoading, mutate } = useSWR(`growmaxpayments`, fetch, {
    shouldRetryOnError: false,
  });
  return {
    PaymentData: data,
    PaymentError: error,
    PaymentisLoading: isLoading,
    Paymentmutate: mutate,
  };
}
