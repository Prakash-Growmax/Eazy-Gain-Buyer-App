import { useState } from "react";
import useSWR from "swr/immutable";
import useAxiosAuth from "./useAxiosAuth";
import useUser from "./useUser";

export default function useCart() {
  const { user } = useUser();
  const { userId } = user || {};
  const AxiosInstance = useAxiosAuth();
  const [addingToCart, setaddingToCart] = useState(false);
  const fetch = async () => {
    const data = await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      url: `corecommerce/carts?userId=${userId}&find=ByUserId&pos=0`,
      method: "GET",
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
    });
    return data.data.data;
  };
  const {
    data: CartData,
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR(userId ? `/cart/${userId}` : null, fetch);

  const ClearCart = async () => {
    await AxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      url: `corecommerce/carts?userId=${userId}&find=ByUserId&pos=${0}`,
      method: "DELETE",
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
        "Content-Type": "application/json",
      },
    });
    await mutate();
  };

  const handleAddToCart =
    (IsInCart: any, data: any, minQty: any) => async () => {
      const { productId } = data;
      try {
        setaddingToCart(true);
        const res = await AxiosInstance({
          baseURL: process.env.NEXT_PUBLIC_BASE_URL,
          url: IsInCart
            ? `corecommerce/carts?userId=${user.userId}&productsId=${productId}&itemNo=${IsInCart.itemNo}&pos=0`
            : `corecommerce/carts?userId=${user.userId}&pos=0`,
          method: IsInCart ? "PUT" : "POST",
          headers: {
            "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
            "Content-Type": "application/json",
          },
          data: {
            pos: 0,
            productsId: data.productId,
            productId: data.productId,
            itemNo: IsInCart?.itemNo,
            quantity: IsInCart
              ? IsInCart.quantity + parseFloat(minQty)
              : parseFloat(minQty),
          },
        });
        await mutate(res?.data?.data, false);

        setaddingToCart(false);
      } catch (error) {
        setaddingToCart(false);
      }
    };
  const handleRemoveToCart =
    (IsInCart: any, data: any, minQty: any) => async () => {
      const { productId } = data;
      try {
        setaddingToCart(true);
        if (IsInCart.quantity === parseFloat(minQty)) {
          await AxiosInstance({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            url: `corecommerce/carts/${user.userId}?productsId=${productId}&itemNo=${IsInCart?.itemNo}&pos=0`,
            method: "DELETE",
            headers: {
              "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
              "Content-Type": "application/json",
            },
          });
  
          
          await mutate();
        } else {
          await AxiosInstance({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            url: IsInCart
              ? `corecommerce/carts?userId=${user.userId}&productsId=${productId}&itemNo=${IsInCart.itemNo}&pos=0`
              : `corecommerce/carts?userId=${user.userId}&pos=0`,
            method: "PUT",
            headers: {
              "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
              "Content-Type": "application/json",
            },
            data: {
              pos: 0,
              productsId: data.productId,
              productId:data.productId,
              itemNo: IsInCart?.itemNo,
              quantity: IsInCart.quantity - parseFloat(minQty),
            },
          });
         await mutate();
        }

        setaddingToCart(false);
      } catch (error) {
        setaddingToCart(false);
      }
    };
  const handleAddToBag =
    (IsInCart: any, data: any, unitOfMeasure: any) => async () => {
      try {
        setaddingToCart(true);

        await AxiosInstance({
          baseURL: process.env.NEXT_PUBLIC_BASE_URL,
          url: `corecommerce/carts?userId=${user.userId}&productsId=${data?.productId}&itemNo=${IsInCart.itemNo}&pos=0`,
          method: IsInCart ? "PUT" : "POST",
          headers: {
            "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
            "Content-Type": "application/json",
          },
          data: {
            pos: 0,
            productsId: data.productId,
            productId:data.productId,
            itemNo: IsInCart?.itemNo,
            quantity:
              IsInCart.quantity < unitOfMeasure
                ? unitOfMeasure
                : IsInCart.quantity + unitOfMeasure,
          },
        });

        await mutate();

        setaddingToCart(false);
      } catch (error) {
        console.log(error);

        setaddingToCart(false);
      }
    };
  const handleRemoveToBag =
    (IsInCart: any, data: any, minQty: any) => async () => {
      try {
        data.unitOfMeasure = data.unitOfMeasure ? data.unitOfMeasure : 0;
        const CasesQty = Math.floor(IsInCart?.quantity / data.unitOfMeasure);
        const SeperateQty = IsInCart.quantity - CasesQty * data.unitOfMeasure;
        const CalcCase = IsInCart.quantity - data.unitOfMeasure;

        setaddingToCart(true);
        if (!SeperateQty && CasesQty === 1) {
          await AxiosInstance({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            url: `corecommerce/carts/${user.userId}?productsId=${data.productId}&itemNo=${IsInCart?.itemNo}&pos=0`,
            method: "DELETE",
            headers: {
              "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
              "Content-Type": "application/json",
            },
          });
        } else {
          await AxiosInstance({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            url: `corecommerce/carts?userId=${user.userId}&productsId=${data?.productId}&itemNo=${IsInCart.itemNo}&pos=0`,
            method: "PUT",
            headers: {
              "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
              "Content-Type": "application/json",
            },
            data: {
              pos: 0,
              productsId: data.productId,
              productId:data.productId,
              itemNo: IsInCart?.itemNo,
              quantity: IsInCart?.quantity - data.unitOfMeasure,
            },
          });
        }
        await mutate();
        setaddingToCart(false);
      } catch (error) {
        console.log(error);

        setaddingToCart(false);
      }
    };
  const handleDeleteToCart =
    (IsInCart: any, data: any, quantity?: any, isFromCart?: Boolean, isCase?:Boolean) =>
    async () => {
      setaddingToCart(true);
      data.unitOfMeasure = data.unitOfMeasure ? data.unitOfMeasure : 0;
      const CasesQty = Math.floor(IsInCart?.quantity / data.unitOfMeasure) || 0;
      const SeperateQty = IsInCart.quantity - CasesQty * data.unitOfMeasure;
      if ((!CasesQty && SeperateQty === data.minOrderQuantity) || isFromCart) {
        await AxiosInstance({
          baseURL: process.env.NEXT_PUBLIC_BASE_URL,
          url: `corecommerce/carts/${user.userId}?productsId=${data.productId}&itemNo=${IsInCart?.itemNo}&pos=0`,
          method: "DELETE",
          headers: {
            "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
            "Content-Type": "application/json",
          },
        });
   
      } else {
        if (!SeperateQty && CasesQty === 1) {
          await AxiosInstance({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            url: `corecommerce/carts/${user.userId}?productsId=${data.productId}&itemNo=${IsInCart?.itemNo}&pos=0`,
            method: "DELETE",
            headers: {
              "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
              "Content-Type": "application/json",
            },
          });
        } else {
          await AxiosInstance({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            url: `corecommerce/carts?userId=${user.userId}&productsId=${data?.productId}&itemNo=${IsInCart.itemNo}&pos=0`,
            method: "PUT",
            headers: {
              "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
              "Content-Type": "application/json",
            },
            data: {
              pos: 0,
              productsId: data.productId,
              productId:data.productId,
              itemNo: IsInCart?.itemNo,
              quantity:  IsInCart?.quantity - (isCase ?  data.unitOfMeasure : SeperateQty),
            },
          });
        }
      }
      await mutate()
      setaddingToCart(false);
    };
  return {
    CartData,
    CartError: error,
    CartisLoading: isLoading,
    Cartmutate: mutate,
    CartisValidating: isValidating,
    ClearCart: ClearCart,
    handleAddToBag,
    handleDeleteToCart,
    handleRemoveToBag,
    handleAddToCart,
    handleRemoveToCart,
    addingToCart,
  };
}
