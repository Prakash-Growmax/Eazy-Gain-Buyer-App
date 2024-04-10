import axios from "axios";
import { map, sortBy } from "lodash";
import FormatElastic from "./format-elastic";
import { cache } from "react";

const getBrands = cache(async () => {
  const ElasticBody = {
    size: 0,
    query: {
      bool: {
        should: [],
        must: [{ term: { isPublished: 1 } }],
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
          field: "brandId",
          size: 1000,
        },
        aggs: {
          data: {
            top_hits: {
              size: 1,
              _source: ["brandImage", "brandsName", "brandId"],
            },
          },
        },
      },
    },
  };
  var query = {
    Elasticindex: process.env.NEXT_PUBLIC_TENANT_ID + "pgandproducts",
    queryType: "search",
    ElasticType: "pgproduct",
    ElasticBody,
  };
  const es_data = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "elasticsearch/invocations",
    query
  );
  const result = map(es_data.data.aggregations.subcategory.buckets, (o) => {
    const formatresult = FormatElastic(o.data);
    return formatresult[0];
  });
  return sortBy(result, "brandsName");
});

export default getBrands;
