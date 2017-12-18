'use strict';

const { throwError } = require('../../error');
const { CONTENT_TYPES } = require('../../constants');

// Action layer output validation
// Those errors should not happen, i.e. server-side (e.g. 500)
const actionValidationOut = function ({ response: { content, type } }) {
  validateType({ type });
  validateContent({ content, type });
};

const validateType = function ({ type }) {
  if (typeof type !== 'string') {
    const message = `'type' must be a string, not '${type}'`;
    throwError(message, { reason: 'ENGINE' });
  }

  const isWrongType = !CONTENT_TYPES[type];

  if (isWrongType) {
    const message = `Invalid 'type': '${type}'`;
    throwError(message, { reason: 'ENGINE' });
  }
};

const validateContent = function ({ content, type }) {
  const isRightContent = CONTENT_TYPES[type](content);
  if (isRightContent) { return; }

  const message = `Invalid 'content' of type '${type}': '${content}'`;
  throwError(message, { reason: 'ENGINE' });
};

module.exports = {
  actionValidationOut,
};
