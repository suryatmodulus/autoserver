const { decapitalize, capitalize } = require('underscore.string')

const { throwError } = require('../errors/main.js')

const getThrowErr = function({ reason, prefix }, attrName, message) {
  const messageA = getMessage({ attrName, message })
  const messageB = capitalize(`${prefix}${messageA}`)
  throwError(messageB, { reason })
}

const getMessage = function({ attrName, message }) {
  if (message === undefined) {
    return decapitalize(attrName)
  }

  return `in '${attrName}' attribute, ${decapitalize(message)}`
}

const throwAttrValError = function({ type, throwErr }, message) {
  const msg = `The value of operator '${type}' should be ${message}`
  throwErr(msg)
}

const throwAttrTypeError = function(
  { attr: { type: attrType }, type, throwErr },
  message,
) {
  if (attrType === 'dynamic') {
    return
  }

  const msg = `The operator '${type}' must not be used because the attribute is ${message}`
  throwErr(msg)
}

module.exports = {
  getThrowErr,
  throwAttrValError,
  throwAttrTypeError,
}
