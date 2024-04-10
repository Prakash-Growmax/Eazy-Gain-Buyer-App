import axios from "axios";
import { filter } from "lodash";
import { cache } from "react";

const getHomePage = cache(async () => {
  const StorefrontRes = await axios(
    process.env.NEXT_PUBLIC_BASE_URL + "storefront/graphql",
    {
      method: "POST",
      data: JSON.stringify({
        query: `{
          getAllByPropertyAndDomain(property:"HOMEPAGELIST",domain:"${process.env.NEXT_PUBLIC_TENANT_ID}"){
            storeFrontProperty,
            dataJson
          }
        }`,
        variables: {},
      }),
    }
  );
  let SliderData = [];
  if (StorefrontRes?.data?.data?.getAllByPropertyAndDomain?.dataJson) {
    const HomePageList = JSON.parse(
      StorefrontRes?.data?.data?.getAllByPropertyAndDomain?.dataJson
    );
    const findSliderInHomePage = filter(HomePageList, (o) =>
      o.storeFrontProperty.includes("SLIDER")
    );
    const promisesArray = processItems(
      findSliderInHomePage.map((o) => o.storeFrontProperty)
    );
    const results = await Promise.all(promisesArray);
    SliderData = results.map((o) => {
      if (o?.data?.data?.getAllByPropertyAndDomain?.dataJson) {
        return JSON.parse(o?.data?.data?.getAllByPropertyAndDomain?.dataJson);
      }
    });
  }

  return SliderData;
});

export default getHomePage;

function sendItem(property: any) {
  return axios(process.env.NEXT_PUBLIC_BASE_URL + "storefront/graphql", {
    method: "POST",
    data: JSON.stringify({
      query: `{
          getAllByPropertyAndDomain(property:"${property}",domain:"${process.env.NEXT_PUBLIC_TENANT_ID}"){
            storeFrontProperty,
            dataJson
          }
        }`,
      variables: {},
    }),
  });
}
function processItems(itemsArray: any) {
  const promises = [];

  for (const item of itemsArray) {
    const promise = sendItem(item);
    promises.push(promise);
  }

  return promises;
}
