'use strict';

const { omit } = require('../../utilities');
const { throwError } = require('../../error');
const { mapColls } = require('../helpers');

// Transforms can copy each `alias` as a real attribute,
// and set `aliasOf` property
const normalizeAliases = function ({ schema }) {
  return mapColls({ func: mapColl, schema });
};

const mapColl = function ({ coll }) {
  if (!coll.attributes) { return coll; }

  const attributes = Object.entries(coll.attributes)
    .reduce(normalizeAlias.bind(null, coll), {});

  return { ...coll, attributes };
};

const normalizeAlias = function (coll, attrs, [attrName, attr]) {
  const aliases = createAliases({ coll, attrs, attr, attrName });
  return { ...attrs, ...aliases, [attrName]: attr };
};

const createAliases = function ({ coll, attrs, attr, attrName }) {
  if (!attr.alias) { return {}; }
  const aliases = Array.isArray(attr.alias) ? attr.alias : [attr.alias];

  const aliasesA = aliases
    .map(alias => createAlias({ coll, attrs, attr, attrName, alias }));
  const aliasesB = Object.assign({}, ...aliasesA);
  return aliasesB;
};

const createAlias = function ({ coll, attrs, attr, attrName, alias }) {
  checkAliasDuplicates({ coll, attrs, attrName, alias });

  const aliasAttr = omit(attr, 'alias');
  const attrA = { ...aliasAttr, aliasOf: attrName };

  return { [alias]: attrA };
};

const checkAliasDuplicates = function ({ coll, attrs, attrName, alias }) {
  if (coll.attributes[alias]) {
    const message = `Attribute '${attrName}' cannot have an alias '${alias}' because this attribute already exists`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  if (attrs[alias]) {
    const otherAttrName = attrs[alias].aliasOf;
    const message = `Attributes '${otherAttrName}' and '${attrName}' cannot have the same alias '${alias}'`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

module.exports = {
  normalizeAliases,
};
