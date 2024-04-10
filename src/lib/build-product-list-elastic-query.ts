export default function buildProductListElasticQuery(
  id: string,
  tenantId: string,
  isBrands: boolean
) {
  const query = {
    Elasticindex: tenantId + "pgandproducts",
    queryType: "search",
    ElasticType: "pgproduct",
    ElasticBody: {
      from: 0,
      size: 10000,
      _source: [
        "brandsName",
        "productId",
        "unitOfMeasure",
        "hsnTaxBreakup",
        "productAssetss",
        "productShortDescription",
        "unitQuantity",
        "unitListPrice",
        "packagingQty",
        "minOrderQuantity",
        "brandProductId",
        "productsSubCategories",
        "primaryUOM",
        "secondaryUOM",
        "brandId",
      ],
      sort: {
        "productsSubCategories.subCategoryName.keyword": { order: "asc" },
        "productShortDescription.keyword": { order: "asc" },
      },
      query: {
        bool: {
          must: [{ term: {} }],
          must_not: [
            {
              match: {
                prodgrpIndexName: {
                  query: "PrdGrp0*",
                },
              },
            },
          ],
        },
      },
    },
  };
  if (!isBrands) {
    query.ElasticBody.query.bool.must = [
      {
        term: {
          //"productsSubCategories.subCategoryId": parseInt(id),

          "productsSubCategories.categoryId": parseInt(id),
        },
      },
      { term: { isPublished: 1 } },
    ];
  } else {
    query.ElasticBody.query.bool.must = [
      {
        term: { brandId: parseInt(id) },
      },
      { term: { isPublished: 1 } },
    ];
  }
  return query;
}
