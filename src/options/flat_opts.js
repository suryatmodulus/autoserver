'use strict';

const { flatten } = require('../utilities');

// Get `flatOpts`, i.e. all options in a flat array
// Recursively validate each option, including intermediate objects
// in object chains
const getFlatOpts = function ({ prefix = '', options, availableOpts }) {
  if (!options || options.constructor !== Object) { return []; }

  const flatOpts = Object.entries(options).map(([optName, optVal]) =>
    getFlatOpt({ prefix, optName, optVal, availableOpts }));
  const flatOptsA = flatten(flatOpts);
  return flatOptsA;
};

const getFlatOpt = function ({ prefix, optName, optVal, availableOpts }) {
  const name = `${prefix}${optName}`;
  // Retrieve from `availableOptions`
  const availableOpt = availableOpts.find(({ name: nameA }) => nameA === name);

  if (!availableOpt) {
    return [{ name, unknown: true }];
  }

  const { validate = {}, subConfFiles, dynamic } = availableOpt;

  const flatOpt = [{ name, validate, optVal }];

  // Sub-conf options do not recurse
  // E.g. schema is a sub-conf which resolves to an object, but schema
  // properties are not options themselves
  // Dynamic options also do not recurse
  if (subConfFiles !== undefined || dynamic) { return flatOpt; }

  const children = getFlatOpts({
    prefix: `${name}.`,
    options: optVal,
    availableOpts,
  });

  return [...flatOpt, ...children];
};

module.exports = {
  getFlatOpts,
};
