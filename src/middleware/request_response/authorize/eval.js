'use strict';

const { throwCommonError } = require('../../../error');
const { evalFilter, mapNodes } = require('../../../filter');

const { handleSchemaFuncs } = require('./schema_func');

// Evaluate `model.authorize` filter to a boolean
// Do a partial evaluation, because we do not know the value of `$model.*` yet
// Returns partial filter if any.
const evalAuthorize = function ({
  modelname,
  authorize,
  top,
  userVars,
  schema,
  mInput,
}) {
  const { authorize: authorizeA, vars } = handleSchemaFuncs({
    modelname,
    authorize,
    userVars,
    schema,
    mInput,
  });

  const authorizeB = evalFilter({
    filter: authorizeA,
    attrs: vars,
    partialNames: PARTIAL_NAMES_REGEXP,
  });

  checkAuthorize({ modelname, authorize: authorizeB, top });

  if (authorizeB === true) { return authorizeB; }

  const authorizeC = mapNodes(authorizeB, removePrefix);
  return authorizeC;
};

// Throw error if authorization filter evaluated to false.
const checkAuthorize = function ({ modelname, authorize, top }) {
  if (authorize !== false) { return; }

  throwCommonError({ reason: 'AUTHORIZATION', modelname, top });
};

// Remove `$model.` prefix in AST's `attrName`
const removePrefix = function ({ attrName, ...node }) {
  if (attrName === undefined) { return node; }

  const attrNameA = attrName.replace(PARTIAL_NAMES_REGEXP, '');
  return { ...node, attrName: attrNameA };
};

// `$model.*` is transformed to `authorize`, which is added to
// `args.filter` and checked against `args.data`
const PARTIAL_NAMES_REGEXP = /\$model\./;

module.exports = {
  evalAuthorize,
};
