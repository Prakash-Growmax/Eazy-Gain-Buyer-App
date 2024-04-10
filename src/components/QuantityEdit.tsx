import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { isArray } from "lodash";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";
import useCart from "@/lib/hooks/usecart";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import useUser from "@/lib/hooks/useUser";
import MuIconify from "./iconify/mui-iconify";

interface QuantityEditProps {
  openQtyEdit: boolean;
  OverallQty: number;
  CasesQty: number;
  ShowQty: number;
  IsOpenCase?: boolean;
  ProductImages: string | string[];
  data: {
    productShortDescription?: string;
    unitOfMeasure: number;
    secondaryUOM?: string;
    unitQuantity?: number;
    primaryUOM?: any;
    packagingQty?: number;
    minOrderQuantity?: any;
    productId?: number;
  };
  IsInCart: {
    itemNo: string;
    quantity: number | undefined;
  } | null;
}

function QuantityEdit({
  ProductImages,
  data,
  IsInCart,
  CasesQty,
  ShowQty,
  IsOpenCase,
  openQtyEdit,
}: QuantityEditProps) {

  const [AddingToCart, setaddToCart] = useState(false);
  const AxiosInstance = useAxiosAuth();
  const {
    productShortDescription,
    unitOfMeasure,
    packagingQty,
    minOrderQuantity,
    productId,
    primaryUOM,
  } = data;

  const minQty = data.minOrderQuantity
    ? data.minOrderQuantity
    : data.packagingQty;
  const [Value, setValue] = useState<any | undefined>(
    IsInCart?.quantity || minQty
  );
  const { user } = useUser();
  const { userId, accessToken } = user || {};
  const { Cartmutate } = useCart();
  const router = useRouter();
  useEffect(() => {
    setValue(
      !primaryUOM ? IsInCart?.quantity : IsOpenCase ? CasesQty : ShowQty
    );
  }, [
    ShowQty,
    openQtyEdit,
    IsOpenCase,
    CasesQty,
    IsInCart?.quantity,
    primaryUOM,
  ]);

  const handleAddToCart = async () => {
    try {
      setaddToCart(true);
      await AxiosInstance({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        url: IsInCart
          ? `corecommerce/carts?userId=${userId}&productsId=${productId}&itemNo=${IsInCart.itemNo}&pos=0`
          : `corecommerce/carts?userId=${userId}&pos=0`,
        method: "PUT",
        headers: {
          Authorization: "Bearer " + accessToken,
          "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
          "Content-Type": "application/json",
        },
        data: {
          pos: 0,
          productsId: data.productId,
          itemNo: IsInCart?.itemNo,
          quantity: !packagingQty
            ? parseFloat(Value)
            : IsOpenCase
            ? ShowQty + parseFloat(Value) * unitOfMeasure
            : CasesQty * unitOfMeasure + parseFloat(Value),
        },
      });
      await Cartmutate();

      router.back();
      setaddToCart(false);
    } catch (error) {
      setaddToCart(false);
    }
  };
  const handleRemoveToCart = async () => {
    try {
      setaddToCart(true);
      await AxiosInstance({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        url: `corecommerce/carts/${user.userId}?productsId=${data.productId}&itemNo=${IsInCart?.itemNo}&pos=0`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + accessToken,
          "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
          "Content-Type": "application/json",
        },
      });
      await Cartmutate();
      setaddToCart(false);

      router.back();
    } catch (error) {
      setaddToCart(false);
    }
  };

  return (
    <>
      <Dialog
        // disablePortal
        disableScrollLock
        onClose={() => {
          router.back();
        }}
        fullWidth
        open={openQtyEdit}
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-end",
          },
        }}
        PaperProps={{
          sx: {
            borderTopRightRadius: "16px",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            width: "100%",
            m: 0,
            height: "50vh",
            overflow: "hidden",
            "& .MuiAutocomplete-listbox": {
              maxHeight: "83%",
              "& .MuiAutocomplete-option .MuiAutocomplete-option[aria-selected='true']":
                {
                  background: "transparent !important",
                },
            },
          },
        }}
      >
        <DialogTitle>Edit Qty</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center">
            <Box position="relative" height={80} width={80}>
              <Image
                alt="Mountains"
                src={isArray(ProductImages) ? ProductImages[0] : ProductImages}
                fill
                style={{
                  objectFit: "contain",
                }}
                sizes="100vw"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                ml: 1,
              }}
            >
              <Typography
                // textAlign="center"
                fontSize="12px"
                fontWeight="bold"
                lineHeight="1.3"
                letterSpacing="0.5px"
                mb={0.5}
                // noWrap
              >
                {productShortDescription}
              </Typography>
            </Box>
          </Box>
          <Divider
            sx={{
              mt: 1,
            }}
          />
          <Box mt={1} display="flex" alignItems="baseline">
            <TextField
              autoFocus
              fullWidth
              helperText={
                IsOpenCase
                  ? ""
                  : `Quantity Should be multiples of ${
                      minOrderQuantity || packagingQty
                    }`
              }
              onWheel={() =>
                // @ts-ignore
                document.activeElement.blur()
              }
              size="small"
              error={
                IsOpenCase
                  ? false
                  : parseFloat(Value) % parseFloat(minQty) !== 0
              }
              type="number"
              sx={{
                "& .MuiInputBase-root": {
                  pr: 0,
                },
              }}
              onFocus={(ev) => {
                ev.target.select();
              }}
              InputProps={{
                // ref: textFieldRef,
                type: "number",
                endAdornment: (
                  <InputAdornment position="end">
                    <LoadingButton
                      loading={AddingToCart}
                      color="primary"
                      size="small"
                      onClick={handleRemoveToCart}
                    >
                      <MuIconify icon={"ic:outline-delete"} />
                    </LoadingButton>
                  </InputAdornment>
                ),
              }}
              value={Value}
              onChange={(ev) => {
                setValue(ev.target.value);
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={AddingToCart}
            onClick={() => {
              router.back();
            }}
            fullWidth
          >
            Cancel
          </Button>

          <LoadingButton
            disabled={
              IsOpenCase
                ? Value === 0
                : Value === 0 || parseFloat(Value) % parseFloat(minQty) !== 0
            }
            onClick={handleAddToCart}
            loading={AddingToCart}
            variant="contained"
            color="primary"
            fullWidth
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(QuantityEdit);
