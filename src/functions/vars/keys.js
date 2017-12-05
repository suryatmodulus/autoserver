'use strict';

const {
  SYSTEM_VARS,
  LATER_SYSTEM_VARS,
  POSITIONAL_VARS,
  TEMP_SYSTEM_VARS,
} = require('./system');

// Retrieve schema functions variables names
const getVarsKeys = function ({ schema: { variables = {} } }) {
  const namedKeys = [
    ...Object.keys(SYSTEM_VARS),
    ...LATER_SYSTEM_VARS,
    ...TEMP_SYSTEM_VARS,
    ...Object.keys(variables),
  ];
  const posKeys = POSITIONAL_VARS;
  return { namedKeys, posKeys };
};

module.exports = {
  getVarsKeys,
};