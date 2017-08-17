'use strict';

const { omit } = require('../../../utilities');
const { addOnlyJsl, runJsl } = require('../../../jsl');

// Apply default values to args.data's models
const applyAllDefault = function (opts) {
  const { defAttributes, value } = opts;

  // When args.data is an array of models, apply this recursively
  if (Array.isArray(value)) {
    return value.map(child => applyAllDefault({ ...opts, value: child }));
  }

  // Iterate over default values for that model, to apply them
  return Object.entries(defAttributes).reduce(
    (parent, [attrName, defValue]) =>
      applyDefault({ ...opts, defValue, attrName, parent }),
    value,
  );
};

// Apply default value to args.data's attributes
const applyDefault = function ({ parent, defValue, attrName, jsl }) {
  const value = parent[attrName];

  // Only apply default if value is not empty
  if (value != null) { return parent; }

  // Process JSL if default value uses JSL
  const params = { $$: parent, $: value };
  const jslA = addOnlyJsl(jsl, params);
  const defValueA = runJsl({ jsl: jslA, jslFunc: defValue });

  if (defValueA == null) {
    return omit(parent, attrName);
  }

  return { ...parent, [attrName]: defValueA };
};

module.exports = {
  applyAllDefault,
};
