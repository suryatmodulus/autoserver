'use strict';

const { extname } = require('path');

const { is: isType } = require('type-is');

const allFormats = require('./handlers');
const { DEFAULT_FORMAT } = require('./merger');

// Retrieve correct format, using MIME type
// Returns undefined if nothing is found
const findByMime = function ({ formats, mime }) {
  // We try the extensions MIME (e.g. `+json`) after the other MIME types
  // (e.g. `application/jose+json`)
  const format = formats
    .find(({ mimes }) => mimeMatches({ mime, mimes }));
  if (format !== undefined) { return format; }

  const formatA = formats
    .find(({ mimeExtensions: mimes }) => mimeMatches({ mime, mimes }));
  if (formatA !== undefined) { return formatA; }
};

// Only the right side of `isType` allow complex types like
// `application/*` or `+json`. However, we might use them both in
// `mime` (e.g. with Content-Type HTTP header `application/*`) or in
// `formats` (e.g. with JSON format `+json`), so we check both sides
const mimeMatches = function ({ mime, mimes = [] }) {
  return mimes.some(mimeA => isType(mime, mimeA) || isType(mimeA, mime));
};

// Retrieve correct format, using file extension
const findByExt = function ({ formats, path }) {
  const fileExt = extname(path).slice(1);
  const format = formats
    .find(({ extNames = [] }) => extNames.includes(fileExt));

  if (format === undefined) { return DEFAULT_FORMAT; }

  return format;
};

const findFormat = function ({ type, path, mime }) {
  const formats = allFormats.filter(({ types }) => types.includes(type));
  const finder = finders[type];
  const format = finder({ formats, path, mime });
  return format;
};

const finders = {
  payload: findByMime,
  conf: findByExt,
  db: findByExt,
};

module.exports = {
  findFormat,
};
