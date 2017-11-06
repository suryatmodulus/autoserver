'use strict';

const { getGraphqlDocument } = require('./document');
const { getMainDef } = require('./main_def');
const { validateMainDef } = require('./validate');
const { getFragments } = require('./fragments');
const { parseOperationDef } = require('./definition');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');

// Use GraphQL-specific logic to parse the request into an
// operation-agnostic `operationDef`
const handler = function ({
  schema: { graphqlSchema },
  queryvars,
  payload,
  method,
}) {
  const { variables, operationName, queryDocument } = getGraphqlDocument({
    queryvars,
    payload,
  });

  const mainDef = getMainDef({ queryDocument, operationName });
  validateMainDef({ mainDef, operationName, method });
  const fragments = getFragments({ queryDocument });

  const operationDef = parseOperationDef({ mainDef, variables, fragments });

  // Introspection GraphQL query do not need to query the database,
  // and return right away
  if (isIntrospectionQuery({ operationDef })) {
    return handleIntrospection({
      graphqlSchema,
      queryDocument,
      variables,
      operationName,
    });
  }

  return { operationDef };
};

module.exports = {
  handler,
};
