'use strict';

const { promisify } = require('util');

const testPlugin = async function ({ schema, opts: { exampleOption } }) {
  await promisify(process.nextTick)();

  return { ...schema, 'x-plugin-attr': exampleOption };
};

module.exports = testPlugin;
