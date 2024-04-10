import useSWR from "swr/immutable";

import useAxiosAuth from "./useAxiosAuth";
import BuildOrderBodyUtils from "../build-pos-order-body";
import useUser from "./useUser";

export default function useBuildOrdersBody(
  CheckoutProducts: any[],
  CartValue: any
) {
  const { user } = useUser();
  const { userId, accessToken } = user || {};
  const axios = useAxiosAuth();

  const BuildOrderUtils = new BuildOrderBodyUtils(
    CheckoutProducts,
    CartValue,
    user
  );

  const fetch = async () => {
    const data = await BuildOrderUtils.procesOrderBody(axios);
    return data;
  };
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    userId && CheckoutProducts.length
      ? [
          `/build-order/${userId}`,
          accessToken,
          ...CheckoutProducts.map((o) => o.productId),
          CartValue,
        ]
      : null,
    fetch,
    {
      shouldRetryOnError: false,
      // isPaused: () => UserLoading,
    }
  );

  return {
    CreateOrderData: data,
    CreateOrderError: error,
    CreateOrderisLoading: isLoading,
    CreateOrdermutate: mutate,
    CreateOrderisValidating: isValidating,
  };
}
