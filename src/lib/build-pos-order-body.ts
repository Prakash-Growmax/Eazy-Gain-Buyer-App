import { filter, find, findIndex, map } from "lodash";
import { Axios, AxiosInstance, AxiosResponse } from "axios";
import { CoreCommerceUser } from "./hooks/useUser";
import { requestBody } from "./requestDTO";

interface Address {
  addressId: {
    branches: {
      id: string;
      name: string;
      companyId: string;
    }[];
    isBilling: boolean;
    isShipping: boolean;
    // Add other properties as needed
  };
}

interface AccountOwner {
  id: any;
  email: string | undefined;
  displayName: string | undefined;
  isActive: boolean | undefined;
}

interface TaxAndCurrency {
  // Define the properties for TaxAndCurrency
  // Modify as per the actual response structure
}

interface BuildBody {
  factor: any; // Replace 'any' with the actual type of 'factor'
  address: {
    BillingAddress: Address[];
    ShippingAddress: Address[];
  };
  preference: any; // Replace 'any' with the actual type of 'preference'
  BussinessUnit: any; // Replace 'any' with the actual type of 'BussinessUnit'
  sellerAddress: any; // Replace 'any' with the actual type of 'sellerAddress'
  channelList: any; // Replace 'any' with the actual type of 'channelList'
  regAddress: any; // Replace 'any' with the actual type of 'regAddress'
  AccountOwnerList: AccountOwner[];
  DefaultWH: any; // Replace 'any' with the actual type of 'DefaultWH'
  Settings: object;
}

class BuildOrderBodyUtils {
  private CartData: any;
  private CartValue: any;
  private token: string | null;
  private UserData: CoreCommerceUser | null;
  private SellerBranchId: string | null;
  private Settings: object;
  private CurrentCustomer: CoreCommerceUser; // Replace 'any' with the actual type of 'CurrentCustomer'

  constructor(
    CartData: any,
    CartValue: any,
    CurrentCustomer: CoreCommerceUser
  ) {
    this.CartData = CartData;
    this.CartValue = CartValue;
    this.token = CurrentCustomer?.accessToken;
    this.UserData = CurrentCustomer;
    this.SellerBranchId = null;
    this.CurrentCustomer = CurrentCustomer;
    this.Settings = {};
  }

  async getcurrencyFactor(AxiosInstance: AxiosInstance): Promise<any> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: "Bearer " + this.token,
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/companys/currencyFactor?companyId=${this.CurrentCustomer.companyId}`,
      method: "GET",
    });
    return data.data.data;
  }

  async getAllModuleSettings(AxiosInstance: AxiosInstance): Promise<any> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: "Bearer " + this.token,
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/module_setting/getAllModuleSettings?userId=${this.CurrentCustomer.userId}&companyId=${this.CurrentCustomer.companyId}`,
      method: "GET",
    });

    this.Settings = {
      roundingAdjustment: find(data?.data?.data?.salesSection?.lsSalesSec, [
        "sectionDetailName",
        "ENABLE_ROUNDING_ADJUSTMENT",
      ])?.status,
      showInsuranceCharges: find(data?.data?.data?.salesSection?.lsSalesSec, [
        "sectionDetailName",
        "ENABLE_INSURANCE",
      ])?.status,
    };

    return this.Settings;
  }

  async getSellerAddressDetails(AxiosInstance: AxiosInstance): Promise<any> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: "Bearer " + this.token,
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/branches/findAllSellerBranch/2?companyId=${this.CurrentCustomer.companyId}`,
      method: "GET",
    });
    this.SellerBranchId = data?.data?.data[0]?.branchId?.id;
    return data?.data?.data;
  }

  async getAddress(AxiosInstance: AxiosInstance): Promise<{
    BillingAddress: Address[];
    ShippingAddress: Address[];
  }> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: "Bearer " + this.token,
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/branches?find=ByCompanyId&companyId=${this.CurrentCustomer.companyId}`,
      method: "GET",
    });
    const formattedAddress: Address[] = [];
    map(data.data.data, (o) => {
      formattedAddress.push({
        addressId: {
          ...o.addressId,
          branches: [{ id: o.id, name: o.name, companyId: o.companyId }],
        },
      });
    });
    const BillingAddress = filter(formattedAddress, function (n) {
      return n.addressId.isBilling;
    });
    const ShippingAddress = filter(formattedAddress, function (n) {
      return n.addressId.isShipping;
    });
    return {
      BillingAddress,
      ShippingAddress,
    };
  }

  async getPreferense(AxiosInstance: AxiosInstance): Promise<any> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: "Bearer " + this.token,
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/companypreferenceses/getUpdatedPreferences?companyId=${this.CurrentCustomer.companyId}`,
      method: "GET",
    });
    return data.data.data;
  }

  async getBusinessUnit(AxiosInstance: AxiosInstance): Promise<any> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: "Bearer " + this.token,
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/branches/findBUBySellerBranch?branchId=${this.SellerBranchId}`,
      method: "GET",
    });
    return data.data.data;
  }

  async getChannelList(AxiosInstance: AxiosInstance): Promise<any> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: "Bearer " + this.token,
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/channel`,
      method: "GET",
    });
    return data.data;
  }

  async getRegisterAddress(AxiosInstance: AxiosInstance): Promise<any> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: "Bearer " + this.token,
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/companys/getRegisterAddress?companyId=${this.CurrentCustomer.companyId}`,
      method: "GET",
    });
    return data.data.data;
  }

  async getAccountOwnerDetails(
    AxiosInstance: AxiosInstance
  ): Promise<AccountOwner[]> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: "Bearer " + this.token,
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/accountses/getAccountAndSupportOwner?companyId=${this.CurrentCustomer.companyId}`,
      method: "GET",
    });
    let accOwners: AccountOwner[] = [];
    const res = data.data.data;
    if (res.accountOwner.length > 0) {
      const activeOwners = filter(res.accountOwner, "isActive");
      if (findIndex(res, ["id", this.UserData?.userId]) === -1) {
        accOwners = [
          ...activeOwners,
          // {
          //   id: this.UserData?.userId,
          //   email: this.UserData?.email,
          //   displayName: this.UserData?.displayName,
          //   isActive: this.UserData?.isUserActive,
          // },
        ];
      } else {
        accOwners = activeOwners;
      }
    } else {
      accOwners = [
        // {
        //   id: this.UserData?.userId,
        //   email: this.UserData?.email,
        //   displayName: this.UserData?.displayName,
        //   isActive: true,
        // },
      ];
    }
    return accOwners;
  }

  async getDefaultWarehouse(AxiosInstance: AxiosInstance): Promise<any> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/branches/findWareHouseByBranchId/2?branchId=${this.SellerBranchId}`,
      method: "GET",
    });
    return data.data.data;
  }

  async getTaxandCurrency(
    AxiosInstance: AxiosInstance
  ): Promise<TaxAndCurrency> {
    const data: AxiosResponse<any> = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
      url: `corecommerce/companys/getTaxAndCurrencyByDealerId/${this.CurrentCustomer.companyId}`,
      method: "GET",
    });
    return data.data.data[0];
  }

  async build(AxiosInstance: AxiosInstance): Promise<BuildBody> {
    const Settings = await this.getAllModuleSettings(AxiosInstance);
    const factor = await this.getcurrencyFactor(AxiosInstance);
    const address = await this.getAddress(AxiosInstance);
    const preference = await this.getPreferense(AxiosInstance);
    const sellerAddress = await this.getSellerAddressDetails(AxiosInstance);
    const BussinessUnit = await this.getBusinessUnit(AxiosInstance);
    const channelList = await this.getChannelList(AxiosInstance);
    const regAddress = await this.getRegisterAddress(AxiosInstance);
    const AccountOwnerList = await this.getAccountOwnerDetails(AxiosInstance);
    const DefaultWH = await this.getDefaultWarehouse(AxiosInstance);
    const taxandcurrency = await this.getTaxandCurrency(AxiosInstance);

    this.CurrentCustomer = { ...taxandcurrency, ...this.CurrentCustomer };

    return {
      factor,
      address,
      preference,
      BussinessUnit,
      sellerAddress,
      channelList,
      regAddress,
      AccountOwnerList,
      DefaultWH,
      Settings,
    };
  }

  async procesOrderBody(AxiosInstance: AxiosInstance) {
    const buildBody = await this.build(AxiosInstance);

    return requestBody(
      this.UserData?.companyId,
      buildBody.sellerAddress[0]?.branchId,
      buildBody.address.BillingAddress[0]?.addressId,
      buildBody.address.ShippingAddress[0]?.addressId,
      this.CartValue,
      this.UserData,
      buildBody.preference,
      this.CartData,
      {},
      false,
      this.CurrentCustomer,
      {},
      false,
      false,
      null,
      [],
      buildBody.BussinessUnit?.[0]?.branchBUId,
      null,
      buildBody.channelList?.[0],
      buildBody.regAddress,
      buildBody.DefaultWH?.addressId?.city,
      buildBody.Settings,
      buildBody.DefaultWH,
      buildBody.AccountOwnerList,
      buildBody.factor
    );
  }
}

export default BuildOrderBodyUtils;
