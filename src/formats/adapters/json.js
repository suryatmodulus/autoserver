// Parses a JSON file
const parse = function ({ content }) {
  return JSON.parse(content)
}

// Serializes a JSON file
const serialize = function ({ content }) {
  return JSON.stringify(content, undefined, 2)
}

export const json = {
  name: 'json',
  title: 'JSON',
  extensions: ['json'],
  mimes: ['application/json'],
  mimeExtensions: ['+json'],
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  charsets: ['utf-8'],
  jsonCompat: [],
  parse,
  serialize,
}
