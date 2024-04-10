import useSWR from "swr/immutable";

import { useEffect, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import useUser from "./useUser";

export default function useOrdersLanding(result: number, pagenumber: number) {
  const { user } = useUser();
  const { userId, companyId } = user || {};
  const [orderdata, setorderData] = useState([]);
  const AxiosInstance = useAxiosAuth()
  const fetch = async () => {
    const data = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      url: `corecommerce/orders/findByFilter?userId=${userId}&companyId=${companyId}&offset=${
        pagenumber - 1
      }&pgLimit=${result}`,
      method: "POST",
      data: {
        filter_index: 0,
        filter_name: "All",
        accountId: [],
        accountOwners: [],
        approvalAwaiting: [],
        endDate: "",
        endCreatedDate: "",
        endValue: null,
        endTaxableAmount: null,
        endGrandTotal: null,
        identifier: "",
        limit: 5,
        offset: 0,
        name: "",
        pageNumber: 0,
        startDate: "",
        startCreatedDate: "",
        startValue: null,
        startTaxableAmount: null,
        startGrandTotal: null,
        status: [],
        quoteUsers: [],
        tagsList: [],
        options: ["ByBranch"],
        branchId: [],
        businessUnitId: [],
        selectedColumn: [
          "Name",
          "Quote Id",
          "Date",
          "Account Name",
          "Subtotal",
          "Status",
          "Awaiting Approver",
          "Quote Owner",
        ],
        selectedColumns: [],
        columnWidth: [],
        columnPosition: "",
      },
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
    });
    return data.data.data;
  };
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    userId ? `/orders-landing/${userId}/${result}/${pagenumber}` : null,
    fetch,
    {
      shouldRetryOnError: false,
      // isPaused: () => UserLoading,
    }
  );
  useEffect(() => {

    if (data?.ordersResponse) {
    //@ts-ignore
    // eslint-disable-next-line no-unsafe-optional-chaining
      setorderData([ ...orderdata,...data?.ordersResponse]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    OrdersLandingData: orderdata || [],
    OrdersLandingDataError: error,
    OrdersLandingDataisLoading: isLoading,
    OrdersLandingDatamutate: mutate,
    OrdersLandingDataisValidating: isValidating,
    totalOrderCount: data?.totalOrderCount,
  };
}
