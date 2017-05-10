'use strict';


const { getIdl } = require('../idl');
const { applyDefaultOptions } = require('./default');
const { validateOptions } = require('./validate');


const processOptions = async function (options) {
  options = applyDefaultOptions({ options });

  validateOptions({ options });

  const idl = await getIdl({ conf: options.conf });
  Object.assign(options, { idl });

  return options;
};


module.exports = {
  processOptions,
};
