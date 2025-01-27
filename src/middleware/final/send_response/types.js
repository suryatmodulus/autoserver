import { serializeContentType } from '../../../formats/content_type.js'

// Each content type is sent differently
export const TYPES = {
  model: {
    mime: 'application/x-resource+',
    isText: true,
  },

  models: {
    mime: 'application/x-collection+',
    isText: true,
  },

  error: {
    // See RFC 7807
    mime: 'application/problem+',
    isText: true,
  },

  object: {
    isText: true,
  },

  html: {
    mime: 'text/html',
    isText: true,
  },

  text: {
    mime: 'text/plain',
    isText: true,
  },
}

// Retrieve response content type
export const getContentType = function ({ format, type }) {
  const { mime } = TYPES[type]
  const charset = DEFAULT_OUTPUT_CHARSET
  const contentType = serializeContentType({ mime, charset, format })
  return contentType
}

// eslint-disable-next-line unicorn/text-encoding-identifier-case
const DEFAULT_OUTPUT_CHARSET = 'utf-8'
