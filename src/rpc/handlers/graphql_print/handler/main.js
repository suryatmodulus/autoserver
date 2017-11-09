'use strict';

const { resolve } = require('path');

const { renderTemplate } = require('../../../../utilities');

const TEMPLATE = resolve(__dirname, './print.mustache');

// Print GraphQL schema as beautified HTML
const handler = async function ({ schema: { graphqlPrintedSchema } }) {
  const content = await renderTemplate({
    template: TEMPLATE,
    data: { graphqlPrintedSchema, prismVersion: '1.6.0' },
  });

  return { response: { type: 'html', content } };
};

module.exports = {
  handler,
};