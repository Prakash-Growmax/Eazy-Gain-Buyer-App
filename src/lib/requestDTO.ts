import parsePhoneNumberFromString from "libphonenumber-js";
import _, { map, round, words } from "lodash";

export const requestBody = (...props: any[]) => {
  const [
    companyId,
    defaultSellerAddress,
    billingAddressSelected,
    shippingAddressSelected,
    cartValue,
    authData,
    updatedPreference,
    cartData,
    additionalInfo,
    isSeller,
    setBuyerSelected,
    VDDetails,
    isSPRRequested,
    taxExemption,
    taxExemptionMessage,
    uploadedDocumentDetails,
    businessUnitId,
    division,
    channel,
    regAddress,
    deliveryPlace,
    Settings,
    warehouse,
    accountOwnerList,
    factor,
  ] = props;
  function getMobileNo(value: any) {
    let mobileNcountry;
    if (value) {
      mobileNcountry = value?.includes("+") ? value : "+" + value;
      const formatedNumber = parsePhoneNumberFromString(mobileNcountry);
      return formatedNumber?.number;
    } else {
      return "";
    }
  }

  // calculating the calculated Total && grand total.....based on module settings
  let calculatedTotal, grandTotal, roundingAdjustment;
  const total = VDDetails?.grandTotal  ? VDDetails?.grandTotal : cartValue?.grandTotal;
  if (Settings.roundingAdjustment) {
    calculatedTotal = total;
    grandTotal = round(total);
    roundingAdjustment = calculatedTotal - grandTotal;
  } else {
    calculatedTotal = total;
    grandTotal = total;
    roundingAdjustment = calculatedTotal - grandTotal;
  }

  var body = {
    additionalTerms: updatedPreference.additionalTerms || "",
    comment: null,
    Settings: {},
    billingAddressDetails: {
      addressLine: billingAddressSelected.addressLine,
      branchName: billingAddressSelected.branchName,
      city: billingAddressSelected.city,
      country: billingAddressSelected.country,
      district: billingAddressSelected.district,
      gst: billingAddressSelected.gst,
      locality: billingAddressSelected.locality,
      pinCodeId: billingAddressSelected.pinCodeId,
      state: billingAddressSelected.state,
      billToCode: billingAddressSelected.billToCode,
      primaryContact: billingAddressSelected?.primaryContact,
      phone: "",
      mobileNo: getMobileNo(billingAddressSelected?.mobileNo),
    },
    buyerBranchId: billingAddressSelected.branches?.[0].id,
    buyerBranchName: billingAddressSelected.branchName,
    buyerCompanyId: isSeller ? setBuyerSelected.companyID : companyId,
    buyerCompanyName: setBuyerSelected.companyName,
    buyerCurrencyId: setBuyerSelected.currencyId?.id,
    currency: setBuyerSelected.currencyId,
    branchBusinessUnit: businessUnitId,
    branchBusinessUnitId: businessUnitId,
    buyerCurrencyFactor: factor,
    currencyFactor: factor,
    customProductDetails: [],
    buyerReferenceNumber: additionalInfo?.customerReferenceNo || "",
    customerRequiredDate: additionalInfo?.customerRequiredDate
      ? new Date(additionalInfo?.customerRequiredDate).toISOString()
      : null,
    dbProductDetails: cartData,
    deliveryDate: null,
    domainURL: window.location.origin,
    calculatedTotal: calculatedTotal,
    grandTotal: grandTotal,
    roundingAdjustment: roundingAdjustment,
    isSPRRequested: isSPRRequested,
    modifiedByUsername:
      authData.displayName + ", " + setBuyerSelected?.companyName,
    notes: "notes",
    orderDeliveryDate: "string",
    orderDescription: "string",
    orderDivisionId: division ? parseInt(division.id) : null,
    orderTypeId: channel ? parseInt(channel.id) : null,
    orderIdentifier: null,
    orderName: "orderName",
    orderTerms: {
      deliveryTerms: updatedPreference?.deliveryTermsId?.name,
      deliveryTermsId: updatedPreference?.deliveryTermsId?.id,
      deliveryTermsCode2: deliveryPlace,
      diValue: 0,
      dispatchInstructions: updatedPreference?.dispatchInstructionsId?.name,
      dispatchInstructionsId: updatedPreference?.dispatchInstructionsId?.id,
      dtValue: 0,
      freight: updatedPreference?.freightId?.name,
      freightId: updatedPreference?.freightId?.id,
      beforeTax: updatedPreference?.freightId?.beforeTax,
      beforeTaxPercentage: updatedPreference?.freightId?.beforeTaxPercentage,
      freightValue: 0,
      insurance: updatedPreference.insuranceId.name,
      insuranceId: updatedPreference.insuranceId.id,
      insuranceValue: Settings?.showInsuranceCharges
        ? updatedPreference?.insuranceId?.insuranceValue
        : null,
      packageForwarding: updatedPreference.pkgFwdId.name,
      packageForwardingId: updatedPreference.pkgFwdId.id,
      paymentTerms: updatedPreference.paymentTermsId.description,
      paymentTermsId: updatedPreference.paymentTermsId.id,
      payOnDelivery: updatedPreference.paymentTermsId.payOnDelivery,
      bnplEnabled: updatedPreference.paymentTermsId.bnplEnabled,
      ptValue: 0,
      pfValue: null,
      pfPercentage:
        updatedPreference?.pkgFwdId?.pfPercentage || updatedPreference?.pfRate
          ? updatedPreference?.pkgFwdId.pfPercentage
          : null,
      warranty: updatedPreference?.warrantyId?.name,
      warrantyId: updatedPreference?.warrantyId?.id,
      warrantyValue: 0,
      insuranceCode: updatedPreference?.insuranceId?.insuranceCode,
      paymentTermsCode: updatedPreference?.paymentTermsId?.paymentTermsCode,
      packageForwardingCode: updatedPreference?.pkgFwdId?.packageForwardingCode,
      freightCode: updatedPreference?.freightId?.freightCode,
      warrantyCode: updatedPreference?.warrantyId?.warrantyCode,
      deliveryTermsCode: updatedPreference?.deliveryTermsId?.deliveryTermsCode,
      dispatchInstructionsCode:
        updatedPreference?.dispatchInstructionsId?.dispatchInstructionsCode,
      pfHeader: updatedPreference?.pkgFwdId?.pfHeader,
      pfByPercentage: updatedPreference?.pkgFwdId?.pfByPercentage,
      frByPercentage: updatedPreference?.freightId?.frByPercentage,
      frHeader: updatedPreference?.freightId?.frHeader,
      insByPercentage: updatedPreference?.insuranceId?.insByPercentage,
      insHeader: updatedPreference?.insuranceId?.insHeader,
      insurancePercentage: Settings?.showInsuranceCharges
        ? updatedPreference?.insuranceId?.insurancePercentage
        : null,
    },
    orderVersion: 0,
    overallTax: VDDetails.subTotalVolume
      ? VDDetails.overallTax
      : cartValue.totalTax,
    payerCode: regAddress?.soldToCode,
    payerBranchName: regAddress?.branchName,
    po: true,
    quotationIdentifier: null,
    requiredDate: additionalInfo?.customerRequiredDate
      ? new Date(additionalInfo.customerRequiredDate).toISOString()
      : null,
    registerAddressDetails: {
      addressLine: regAddress?.addressLine,
      branchName: regAddress?.branchName,
      city: regAddress?.city,
      country: regAddress?.country,
      district: regAddress?.district,
      locality: regAddress?.locality,
      pincode: regAddress?.pinCodeId,
      state: regAddress?.state,
      gst: regAddress?.gst,
      billToCode: regAddress?.billToCode,
      shipToCode: regAddress?.shipToCode,
      soldToCode: regAddress?.soldToCode,
      primaryContact: regAddress?.primaryContact,
      phone: "",
      mobileNo: getMobileNo(regAddress?.mobileNo),
    },
    shippingAddressDetails: {
      addressLine: shippingAddressSelected.addressLine,
      branchName: shippingAddressSelected.branchName,
      city: shippingAddressSelected.city,
      country: shippingAddressSelected.country,
      district: shippingAddressSelected.district,
      gst: shippingAddressSelected.gst,
      locality: shippingAddressSelected.locality,
      pinCodeId: shippingAddressSelected.pinCodeId,
      state: shippingAddressSelected.state,
      shipToCode: shippingAddressSelected.shipToCode,
      primaryContact: shippingAddressSelected.primaryContact,
      phone: "",
      mobileNo: getMobileNo(shippingAddressSelected.mobileNo),
    },
    shippingAddressId: shippingAddressSelected.id,
    subTotal: VDDetails.subTotalVolume
      ? VDDetails.subTotal
      : cartValue.totalValue,
    taxableAmount: VDDetails.taxableAmount
      ? VDDetails.taxableAmount
      : cartValue.taxableAmount,
    subTotalWithVD: VDDetails.subTotalVolume,
    sellerBranchId: defaultSellerAddress.id,
    salesBranchCode: defaultSellerAddress.salesBranchCode,
    sellerBranchName: defaultSellerAddress.name,
    sellerCompanyId: defaultSellerAddress?.companyId?.id,
    sellerCompanyName: defaultSellerAddress?.companyId?.name,
    sellerReferenceNumber: "string",
    taxExemption: taxExemption,
    taxMessage: taxExemptionMessage,
    uploadedDocumentDetails: uploadedDocumentDetails
      ? uploadedDocumentDetails
      : [],
    versionCreatedTimestamp: new Date().toISOString(),
    versionLevelVolumeDisscount: _.some(cartData, [
      "volumeDiscountApplied",
      true,
    ]),
    validityDate: null,

    deletableOrderUsers: [],
    deletableTagsList: [],
    tagsList: [],
  };
  let isInter;
  if (billingAddressSelected?.state !== warehouse?.addressId?.state) {
    isInter = true;
  } else {
    isInter = false;
  }
  //@ts-ignore
  body.orderUsers = map(accountOwnerList, (acc) => acc.id);
  //@ts-ignore
  body.overallShipping = 0;
  body.dbProductDetails = proceesProduct(
    body.dbProductDetails,
    updatedPreference,
    shippingAddressSelected,
    warehouse,
    accountOwnerList[0],
    isInter
  );  
  body.orderName =
    (words(setBuyerSelected.companyName)[0] + "'s")
      ?.toString()
      .concat(
        billingAddressSelected.city ? "-" : "",
        billingAddressSelected.city
      ) + " Order" || "Order";

  return body;
};

let proceesProduct = (
  dbProductDetails: any[],
  preference: any,
  shippingAddress: any,
  warehouse: any,
  accountowner: any,
  isInter: boolean
) => {
  return map(dbProductDetails, (prod) => {
    return {
      ...prod,
      accountOwnerId: accountowner ? parseInt(accountowner.id) : null,
      businessUnitId: prod.businessUnit ? prod.businessUnit.id : null,
      divisionId: prod.division ? parseInt(prod.division.id) : null,
      lineNo: null,
      itemNo: null,
      pfPercentage:
        preference.data?.pkgFwdId?.pfPercentage || preference?.pfRate
          ? preference?.pfRate
          : null,
      pfValue: null,
      shipToBranchName: shippingAddress?.branchName,
      shipToCode: shippingAddress?.shipToCode,
      productTaxes: isInter ? prod.interTaxBreakup : prod.intraTaxBreakup,
      reqDeliveryDate: null,
      orderWareHouseId: warehouse ? warehouse?.id : null,
      wareHouseName: warehouse ? warehouse?.wareHouseName : null,
      showPrice: true, // for Seller showPrice should be always true;
      hsnCode: prod.hsnDetails?.hsnCode,
      volumeDiscount: 0,
      volumeDiscountApplied: false,
      bcProductCost: 0,
      marginPercentage: 0,
      productCost: 0,
      productDiscounts:
        prod.discChanged || !prod?.discountDetails?.discountId
          ? []
          : [
              {
                id: null,
                discounId: prod?.discountDetails?.discountId || null,
                discounCode: null,
                orderProduct: null,
                discountPercentage: prod?.discountDetails?.Value || null,
                itemNo: null,
              },
            ],
    };
  });
};
