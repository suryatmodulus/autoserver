'use strict'

const encodings = require('iconv-lite/encodings')

const { omitBy } = require('../utils/functional/filter.js')

const { validateCharset } = require('./validate')
const { decodeCharset } = require('./transform')

// Normalize charset, including adding defaults and validating
const getCharset = function(charset, { format } = {}) {
  const charsetA = addDefaultCharset({ charset, format })

  const charsetB = charsetA.toLowerCase()

  validateCharset({ charset: charsetB, format })

  const charsetC = createInstance({ charset: charsetB, title: charsetA })

  return charsetC
}

// Add default charsets, including the format's default charset
const addDefaultCharset = function({ charset, format }) {
  const formatCharset = findFormatCharset({ format })

  return charset || formatCharset || DEFAULT_INPUT_CHARSET
}

const DEFAULT_INPUT_CHARSET = 'binary'

const findFormatCharset = function({ format }) {
  if (format === undefined) {
    return
  }

  return format.getCharset()
}

// Returns a charset adapter object
const createInstance = function({ charset, title }) {
  const decode = decodeCharset.bind(null, charset)

  return { name: charset, title, decode }
}

// Get list of supported charset
const getCharsets = function() {
  // Remove charsets that are just aliases, to keep return value small
  const charsets = omitBy(encodings, value => typeof value === 'string')

  const charsetsA = Object.keys(charsets)
  return charsetsA
}

module.exports = {
  getCharset,
  getCharsets,
}