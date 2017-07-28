'use strict';

const { getDataArgument } = require('./data');
const { getFilterArgument } = require('./filter');
const { getOrderArgument } = require('./order');
const { getPaginationArgument } = require('./pagination');

// Retrieves all resolver arguments, before resolve function is fired
const getArguments = function (def, opts) {
  const options = { ...opts, def };
  return {
    ...getDataArgument(options),
    ...getFilterArgument(options),
    ...getOrderArgument(options),
    ...getPaginationArgument(options),
  };
};

module.exports = {
  getArguments,
};
