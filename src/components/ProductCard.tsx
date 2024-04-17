"use client";
import { getSuitableDiscountByQuantity } from "@/lib/cart-calculation";
import useUser from "@/lib/hooks/useUser";
import useCart from "@/lib/hooks/usecart";
import { LoadingButton } from "@mui/lab";
import { CardActions, IconButton, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { find, map } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import IncrementerButton from "./IncrementerButton";
import PricingFormat from "./PricingFormat";
import DiscountTable from "./ProductList/DiscountDetails";
import QuantityEdit from "./QuantityEdit";
import TextMaxLine from "./TextMaxContent";
import MuIconify from "./iconify/mui-iconify";
import { pluralize } from "./image/utils";
import Label from "./label";
import { useLightBox } from "./lightbox";
import Lightbox from "./lightbox/lightbox";

function ProductCard({
  data,
  DiscountData,
  DiscountisLoading,
  showOnlyDiscountedPrice,
  hidediscountTable,
  isFromCart,
}: {
  data: any;
  DiscountData: any[];
  DiscountisLoading: boolean;
  showOnlyDiscountedPrice?: boolean;
  hidediscountTable?: boolean;
  isFromCart?: boolean;
}) {
  const { t } = useTranslation("Product");
  const [openQtyEdit, setopenQtyEdit] = useState<any>({});
  const searchParams = useSearchParams();
  // const QtyEditProductId = searchParams.get("qty") || "";
  const ImageOpen = searchParams.get("img");
  const pathName = usePathname();
  const { push } = useRouter();
  useEffect(() => {
    if (!ImageOpen && lightbox.open) {
      lightbox.onClose();
    }
    // if (openQtyEdit.hasOwnProperty(QtyEditProductId)) {
    //   return;
    // } else if (!QtyEditProductId) {
    //   setopenQtyEdit({});
    // }
    // if (QtyEditProductId) {
    //   setopenQtyEdit({ [QtyEditProductId]: true });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ImageOpen]);
  const {
    CartData,
    CartisValidating,
    handleAddToCart,
    addingToCart,
    handleDeleteToCart,
    handleRemoveToCart,
    handleRemoveToBag,
    handleAddToBag,
  } = useCart();

  const { user } = useUser();
  const { roundOff } = user || {};
  const {
    productAssetss,
    productShortDescription,
    unitOfMeasure,
    productId,
    primaryUOM,
    shortDescription,
    secondaryUOM,
  } = data || {};

  const lightbox = useLightBox(
    productAssetss?.map((o: any) => {
      return { type: o.type, poster: o.source, src: o.source };
    })
  );
  const IsInCart = find(CartData, (cart) => cart.productId === productId);

  const ProductImage = productAssetss?.length
    ? map(
        productAssetss.filter(
          (o1: { isDefault: any; source: any }, i: number) => {
            if (o1.isDefault) {
              return o1?.source;
            } else if (i === 0) {
              return o1?.source;
            }
          }
        ),
        "source"
      )[0]
    : "/assets/placeholder.png";
  const ProductWise_Discounts = find(
    DiscountData,
    (o) => o.ProductVariantId === data.productId
  );
  const discount_Percentage = ProductWise_Discounts?.isOveridePricelist
    ? 0
    : ((ProductWise_Discounts?.MasterPrice - ProductWise_Discounts?.BasePrice) /
        ProductWise_Discounts?.MasterPrice) *
      100;
  const discount_Price =
    (ProductWise_Discounts?.MasterPrice - ProductWise_Discounts?.BasePrice) /
    ProductWise_Discounts?.MasterPrice;
  const minQty = data.minOrderQuantity
    ? data.minOrderQuantity
    : data.packagingQty;
  const OverallQty = IsInCart?.quantity;
  const CasesQty = Math.floor(
    unitOfMeasure ? IsInCart?.quantity / unitOfMeasure : IsInCart?.quantity
  );
  const ShowQty = Math.abs(
    OverallQty -
      Math.floor(
        unitOfMeasure ? IsInCart?.quantity / unitOfMeasure : IsInCart?.quantity
      ) *
        unitOfMeasure
  );
  const { suitableDiscount } = getSuitableDiscountByQuantity(
    IsInCart?.askedQuantity || 0,
    ProductWise_Discounts?.discounts || []
  );
  const BagDiscount = getSuitableDiscountByQuantity(
    unitOfMeasure,
    ProductWise_Discounts?.discounts
  );
  const Discount = !ProductWise_Discounts?.isOveridePricelist
    ? suitableDiscount?.Value + discount_Percentage
    : suitableDiscount?.Value;
  const Product_Price = !ProductWise_Discounts?.isOveridePricelist
    ? ProductWise_Discounts?.MasterPrice
    : ProductWise_Discounts?.BasePrice;
  const FinalPrice = suitableDiscount
    ? Product_Price - (Product_Price * Discount) / 100
    : null;
  const Bag_taken_Discount =
    BagDiscount?.suitableDiscount?.Value + discount_Percentage;

  const BagPrice = Bag_taken_Discount
    ? Product_Price - (Product_Price * Bag_taken_Discount) / 100
    : ProductWise_Discounts?.BasePrice;
  const ProductWiseCartDiscount =
    IsInCart?.quantity &&
    getSuitableDiscountByQuantity(
      IsInCart?.quantity,
      ProductWise_Discounts?.discounts
    );
  const CartDiscount_taken_Discount = ProductWiseCartDiscount
    ? ProductWiseCartDiscount?.suitableDiscount?.Value + discount_Percentage
    : null;

  const CartDiscountPrice = CartDiscount_taken_Discount
    ? Product_Price - (Product_Price * CartDiscount_taken_Discount) / 100
    : ProductWise_Discounts?.BasePrice;
  const [IsOpenCase, setIsOpenCase] = useState(false);
  const HandleOpenImage = () => {
    const images = productAssetss?.map((o: any) => {
      return { type: o.type, poster: o.source, src: o.source };
    });
    lightbox.onOpen(images[0]);
    push(`${pathName}?img=${productId}`);
  };

  return (
    <>
      <Card variant="outlined" sx={{ my: 0.5, mx: 0.5 }}>
        <Box display="flex" alignItems="center">
          <Box
            position="relative"
            minWidth={125}
            minHeight={125}
            maxWidth={125}
            maxHeight={125}
            onClick={HandleOpenImage}
          >
            {/* <Image
              ratio="1/1"
              src={ProductImage}
              sx={{
                objectFit: "contain",
                p: 1,
                width:'100%',
                height:'100%',
                maxHeight:'100%',
                maxWidth:'100%',

              }}
              
              alt={productShortDescription || shortDescription}
            /> */}
            <img
              alt={productShortDescription || shortDescription}
                  src={ProductImage}
                  height="100%"
                  width="100%"
                  style={{ height: "125px",  width: "125px",  maxHeight: "125px",  maxWidth: "125px", objectFit: "contain" }}
                />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flex: "1 0 auto" }}>
              <TextMaxLine line={5} variant="h6">
                {productShortDescription || shortDescription}
              </TextMaxLine>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {DiscountisLoading  ? (
                  <Skeleton
                    sx={{
                      my: 0.5,
                    }}
                    width={"100%"}
                    variant="text"
                  />
                ) : (
                  <Box my={0.5}>
                    {t("MRP")}:&nbsp;
                    {!showOnlyDiscountedPrice ? (
                      <>
                        <Typography
                          fontWeight="bold"
                          lineHeight="1"
                          color="#b12704"
                          component="span"
                        >
                          <PricingFormat
                            value={
                              ProductWise_Discounts?.isOveridePricelist
                                ? ProductWise_Discounts?.BasePrice
                                : FinalPrice
                                ? FinalPrice
                                : ProductWise_Discounts?.BasePrice
                            }
                          />
                        </Typography>
                        &nbsp;
                        {!ProductWise_Discounts?.isOveridePricelist && (
                          <Box
                            component="span"
                            sx={{
                              color: "text.disabled",
                              textDecoration: "line-through",
                            }}
                          >
                            <PricingFormat
                              value={ProductWise_Discounts?.MasterPrice}
                            />
                          </Box>
                        )}
                      </>
                    ) : suitableDiscount ? (
                      <Box color="#b12704" component="span">
                        <PricingFormat
                          value={
                            ProductWise_Discounts?.BasePrice -
                            (ProductWise_Discounts?.BasePrice *
                              suitableDiscount.Value) /
                              100
                          }
                        />
                      </Box>
                    ) : (
                      <Box color="#b12704" component="span">
                        <PricingFormat
                          value={ProductWise_Discounts?.BasePrice}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Typography>
              {discount_Percentage > 0 && (
                <Label
                  variant="filled"
                  sx={{
                    bgcolor: "#b12704",
                    // mb: 0.5,
                  }}
                  color="success"
                >
                  {t("Profit")}
                  &nbsp;
                  <PricingFormat
                    value={
                      FinalPrice
                        ? Product_Price - FinalPrice!
                        : Product_Price - ProductWise_Discounts?.BasePrice
                    }
                  />
                  {/* {FinalPrice
                    ? Product_Price 8  - FinalPrice
                    : Product_Price - ProductWise_Discounts?.BasePrice} */}
                </Label>
              )}
              {primaryUOM && secondaryUOM && (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  {pluralize(primaryUOM, 1)}:&nbsp;
                  <Box color="#b12704" component="span">
                    <PricingFormat value={BagPrice * unitOfMeasure} />
                  </Box>
                </Typography>
              )}

              {IsInCart ? (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  {t("Net Price")}:&nbsp;
                  <Box component="span" color="error.main">
                    <PricingFormat
                      value={CartDiscountPrice * IsInCart?.quantity}
                    />
                  </Box>
                </Typography>
              ) : (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  visibility="hidden"
                >
                  {t("Net Price")}:&nbsp;
                  <Box component="span" color="error.main">
                    <PricingFormat
                      value={CartDiscountPrice * IsInCart?.quantity}
                    />
                  </Box>
                </Typography>
              )}
            </CardContent>
          </Box>
        </Box>
        <CardActions
          sx={{
            pt: 0,
            alignItems: "baseline",
          }}
        >
          {IsInCart ? (
            <Box display="flex" gap={1} flexDirection="column" width="100%">
              <Box
                display="flex"
                width="100%"
                gap={0.5}
                justifyContent="center"
              >
                {primaryUOM && (
                  <IncrementerButton
                    label={primaryUOM}
                    sx={{
                      width: "50%",
                    }}
                    productId={productId}
                    setIsOpenCase={() => {
                      setIsOpenCase(true);
                    }}
                    quantity={CasesQty}
                    onDecrease={handleRemoveToBag(IsInCart, data, minQty)}
                    onDelete={handleDeleteToCart(IsInCart, data, CasesQty, false, true)}
                    onIncrease={handleAddToBag(IsInCart, data, unitOfMeasure)}
                    minQty={minQty}
                    addingToCart={addingToCart}
                    onQuantityClick={(productId : any) => {
                      setopenQtyEdit({[productId] : true})
                    }}
                  />
                )}

                <IncrementerButton
                  label={secondaryUOM}
                  sx={{
                    width: primaryUOM ? "50%" : "100%",
                  }}
                  setIsOpenCase={() => {
                    setIsOpenCase(false);
                  }}
                  productId={productId}
                  quantity={!primaryUOM ? OverallQty : ShowQty}
                  onDecrease={handleRemoveToCart(IsInCart, data, minQty)}
                  onDelete={handleDeleteToCart(
                    IsInCart,
                    data,
                    !primaryUOM ? OverallQty : ShowQty
                  )}
                  onIncrease={handleAddToCart(IsInCart, data, minQty)}
                  minQty={minQty}
                  addingToCart={addingToCart}
                  onQuantityClick={(productId : any) => {
                    setopenQtyEdit({[productId] : true})
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                component="div"
                sx={{ color: "text.secondary" }}
              >
                {primaryUOM &&
                  `${pluralize(primaryUOM, 1)} = ${
                    unitOfMeasure && secondaryUOM
                      ? `${unitOfMeasure} ${secondaryUOM}, `
                      : ""
                  }`}
                {primaryUOM
                  ? CasesQty > 0 && ShowQty > 0
                    ? `${CasesQty} ${primaryUOM} + ${ShowQty} ${secondaryUOM} ${t(
                        "added"
                      )}`
                    : ShowQty > 0
                    ? `${ShowQty} ${secondaryUOM} ${t("added")}`
                    : CasesQty > 0
                    ? `${pluralize(primaryUOM, CasesQty)} ${t("added")}`
                    : ""
                  : `${OverallQty} ${secondaryUOM} ${t("added")}`}
              </Typography>
            </Box>
          ) : (
            <Box
              width="100%"
              textAlign="center"
              display="flex"
              flexDirection="column"
            >
              <LoadingButton
                loading={addingToCart}
                onClick={handleAddToCart(IsInCart, data, minQty)}
                size="large"
                variant="contained"
                color="warning"
                fullWidth
              >
                {t("AddToCart")}
              </LoadingButton>
              <Typography
                variant="caption"
                component="div"
                sx={{ color: "text.secondary", mt: 1 }}
                textAlign="left"
              >
               {primaryUOM &&
                  `${pluralize(primaryUOM, 1)} = ${
                    unitOfMeasure && secondaryUOM
                      ? `${unitOfMeasure} ${secondaryUOM}, `
                      : ""
                  }`} {minQty} {secondaryUOM} {t("will be added")}
              </Typography>
            </Box>
          )}
          {isFromCart && (
            <IconButton
              color="error"
              disabled={addingToCart}
              onClick={handleDeleteToCart(IsInCart, data, minQty, isFromCart)}
            >
              <MuIconify icon={"ic:outline-delete"} />
            </IconButton>
          )}
        </CardActions>
        {!hidediscountTable &&
          Boolean(ProductWise_Discounts?.discounts?.length) && (
            <DiscountTable
              roundOff={roundOff}
              Product_Price={
                !ProductWise_Discounts?.isOveridePricelist
                  ? ProductWise_Discounts?.MasterPrice
                  : ProductWise_Discounts?.BasePrice
              }
              suitableDiscount={suitableDiscount}
              data={ProductWise_Discounts?.discounts}
              discount_Percentage={discount_Percentage}
              unitOfMeasure={unitOfMeasure}
              isOveridePricelist={ProductWise_Discounts?.isOveridePricelist}
              secondaryUOM={secondaryUOM}
            />
          )}
      </Card>

      {openQtyEdit && openQtyEdit[productId.toString()] && (
        <QuantityEdit
          openQtyEdit={openQtyEdit && openQtyEdit[productId.toString()]}
          data={data}
          ProductImages={ProductImage}
          IsInCart={IsInCart}
          OverallQty={OverallQty}
          CasesQty={CasesQty}
          ShowQty={ShowQty}
          IsOpenCase={IsOpenCase}
          closeQtyEdit={() => {
            setopenQtyEdit({})
          }}
        />
      )}
      <Lightbox
        index={lightbox.selected}
        slides={productAssetss?.map((o: any) => {
          return { type: o.type, poster: o.source, src: o.source };
        })}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </>
  );
}

export default memo(ProductCard);
