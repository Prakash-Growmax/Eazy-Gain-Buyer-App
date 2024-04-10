import axios from "axios";
import { filter, flatMap, map } from "lodash";
import { cache } from "react";

const getCategoryData = cache(async () => {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [{ match: { isPublished: 1 } }],
        must_not: [
          {
            match: {
              internal: true,
            },
          },
        ],
      },
    },
    aggs: {
      subcategory: {
        terms: {
          field: "productsSubCategories.subCategoryId",
          size: 1000,
        },
      },
    },
  };
  var body = {
    Elasticindex: `${process.env.NEXT_PUBLIC_TENANT_ID + "pgandproducts"}`,
    queryType: "search",
    ElasticType: "pgproduct",
    ElasticBody: query,
  };
  const categoryData = await axios(
    process.env.NEXT_PUBLIC_BASE_URL + `homepagepublic/getAllSubCategories`,
    {
      headers: {
        "x-tenant": process.env.NEXT_PUBLIC_TENANT_ID,
      },
    }
  );

  const es_data = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "elasticsearch/invocations",
    body
  );
  const returndata = es_data
    ? flatMap(
        map(es_data.data?.aggregations?.subcategory?.buckets, (o) => {
          return filter(categoryData.data.data, (o1) => o1.sc_id === o.key);
        })
      )
    : [];
  return returndata;
});
export default getCategoryData;
