"use client";
import useSWR from "swr/immutable";
import useAxiosAuth from "./useAxiosAuth";
import useUser from "./useUser";

export default function useDiscounts(path: any, productIds: any[]) {
  const { user,isLoading:UserLoading } = useUser();
  const { companyId, currency, userId } = user;
  const AxiosInstance = useAxiosAuth();
  const fetch = async () => {
    const data = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      url: companyId
        ? `discounts/discount/getDiscount?CompanyId=${companyId}`
        : "discounts/discount/getDiscount",
      method: "POST",
      data: {
        currency: currency?.id,
        Productid: productIds,
      },
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
    });
    return data.data.data;
  };
  const { data, error, isLoading, mutate } = useSWR(
    userId && productIds?.length
      ? [
          `${path}/${userId}/${JSON.stringify(productIds)}`,
          [...productIds],
          companyId,
        ]
      : null,
    fetch,
    {
      shouldRetryOnError: false,
    }
  );
  return {
    DiscountData: data,
    DiscountError: error,
    DiscountisLoading: isLoading || UserLoading,
    Discountmutate: mutate,
  };
}
