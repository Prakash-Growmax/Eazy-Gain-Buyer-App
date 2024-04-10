import useSWR from "swr/immutable";
import useAxiosAuth from "./useAxiosAuth";
import { Fetcher, MutatorCallback } from "swr";
import { useSession } from "next-auth/react";

export default function useUser() {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const fetcher: Fetcher<CoreCommerceUser> = async () => {
    const corecommercedata = await axiosAuth({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      url: `corecommerce/userses/findByName?name=${session?.user?.payload.sub}`,
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
    });
    const combine_auth_corecommerce = {
      ...session?.user?.payload,
      ...corecommercedata.data.data,
    };
    return combine_auth_corecommerce;
  };

  const {
    data: user,
    mutate: mutateUser,
    isLoading,
    isValidating,
  } = useSWR<CoreCommerceUser>(session ? "/api/user" : null, fetcher);
  return {
    user: {
      ...user,
    },
    mutateUser,
    isLoading,
    isValidating,
  } as {
    user: CoreCommerceUser;
    isLoading: boolean;
    mutateUser: MutatorCallback;
    isValidating: boolean;
  };
}

interface Currency {
  currencyCode: string;
  decimal: string;
  description: string;
  id: number;
  precision: number;
  symbol: string;
  tenantId: number;
  thousand: string;
}

interface CustomerTag {
  id: number;
  tagCode: string;
  tagTypeId: {
    id: number;
    tagType: string;
    tagTypeCode: string;
    tenantId: number;
  };
  tagValue: string;
  tenantId: number;
}

export interface User {
  accessToken?: any;
  refreshToken?: any;
}

export interface CoreCommerceUser {
  bnplCustomerId?: string;
  accessToken?: any;
  refreshToken?: any;
  bnplEnabled?: boolean;
  bnplPhone?: null | string;
  branchName?: string;
  checkListDismissed?: boolean;
  companyId?: number;
  companyMapped?: boolean;
  companyName?: string;
  currency?: Currency;
  customerTags?: CustomerTag[];
  dateFormat?: string;
  dealerPLNCode?: string;
  defaultCountryCallingCode?: number;
  defaultCountryCodeIso?: string;
  defaultPLNCode?: string;
  finStartMonth?: null | number;
  inviteAccess?: number;
  isCompanyActive?: boolean;
  isUserActive?: number;
  isregisterAddressAvailable?: boolean;
  lastLoginAt?: string;
  listAccessElements?: string[];
  roleId?: number;
  roleName?: string;
  roundOff?: number;
  seller?: boolean;
  taxExempted?: boolean;
  taxExemptionId?: null | number;
  timeFormat?: string;
  timeZone?: string;
  userActive?: number;
  userCode?: null | string;
  userId?: number;
  verified?: boolean;
  email?: string;
  emailVerified?: boolean;
  status?: string;
  tenantId?: string;
  displayName?: string;
  isSeller?: boolean;
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  picture?: string;
  secondaryEmail?: string;
  phoneNumberVerified?: boolean;
  id?: string;
  sub?: string;
  iss?: string;
  aud?: string;
  allowAutoRegsiter?: boolean;
  isSmsConfigured?: boolean;
  type?: string;
  iat?: number;
  exp?: number;
}
