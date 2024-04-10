import { isArray } from 'lodash'; // Assuming you are using lodash's isArray function
import { remove } from 'lodash'; // Assuming you are using lodash's remove function

interface Document {
  _source: any;
  _id: string;
  buildNum?: string;
  notExpandable?: boolean;
}

interface ElasticData {
  data?: {
    hits: {
      hits: Document[];
    };
  };
  hits?: {
    hits: Document[];
  };
}

export default function FormatElastic(documents: ElasticData): any[] {
  const formattedResults: any[] = [];

  if (isArray(documents.data)) {
    return documents.data;
  }

  if (documents.data && documents.data.hits.hits) {
    documents.data.hits.hits.forEach(function (documnt: Document) {
      const documentSource = documnt._source;
      documentSource.id = documnt._id;
      formattedResults.push(documentSource);
    });
  }

  if (documents.hits && documents.hits.hits) {
    documents.hits.hits.forEach(function (documnt: Document) {
      const documentSource = documnt._source;
      documentSource.id = documnt._id;
      formattedResults.push(documentSource);
    });
  }

  remove(formattedResults, (o) => o.buildNum || o.notExpandable);

  return formattedResults;
}
