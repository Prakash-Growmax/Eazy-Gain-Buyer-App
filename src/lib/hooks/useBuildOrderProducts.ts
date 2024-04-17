import { cloneDeep, find, map } from "lodash";
import { useEffect, useState } from "react";
import {
  assign_pricelist_discounts_data_to_products,
  cartCalculation,
} from "../cart-calculation";
import useDiscounts from "./useDiscounts";

interface CartData {
  productId: number;
  // Add other properties as per the actual data structure
}

interface ProductData {
  productId: number;
  // Add other properties as per the actual data structure
}

export default function useBuildOrderProducts(cartData: CartData[]) {
  const { DiscountData, DiscountisLoading } = useDiscounts(
    "cart",
    map(cartData, "productId")
  );
  const [CartValue, SetCartValue] = useState<Record<string, any>>({});
  const [Products, setProducts] = useState<ProductData[]>([]);
  useEffect(() => {
    const Products = map(cartData, (cart) => {
      const Productwise_Discounts =
        find(cloneDeep(DiscountData) || [], (disc) => {
          return disc.ProductVariantId === cart.productId;
        }) || {};

      cart = assign_pricelist_discounts_data_to_products(
        cart,
        Productwise_Discounts
      );
      return cart;
    });
    setProducts(Products);
    const CartValue = cartCalculation(Products, true);

    if (!DiscountisLoading) {
      SetCartValue(CartValue);
    }
  }, [DiscountisLoading, cartData, DiscountData]);

  return {
    CartValue,
    Products,
    CartValueLoading: DiscountisLoading,
    DiscountData,
    DiscountisLoading,
  };
}
