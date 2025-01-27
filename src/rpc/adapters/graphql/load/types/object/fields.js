import { excludeKeys } from 'filter-obj'

import { mapValues } from '../../../../../../utils/functional/map.js'

import { addCommand } from './command.js'
import { filterField } from './filter.js'
import { getFinalField } from './final_fields/main.js'
import { getNestedColl } from './nested_colls.js'
import { addNoAttributes } from './no_attributes.js'

// Retrieve the fields of an object, using config definition
export const getObjectFields = function (opts) {
  const fields = mappers.reduce(
    reduceFields.bind(undefined, opts),
    opts.parentDef.attributes,
  )
  const fieldsA = addNoAttributes({ fields })
  return fieldsA
}

const mappers = [addCommand, getNestedColl, filterField, getFinalField]

const reduceFields = function (opts, fields, mapper) {
  const fieldsA = mapValues(fields, mapField.bind(undefined, { opts, mapper }))
  return excludeKeys(fieldsA, hasNoValue)
}

const mapField = function ({ opts, mapper }, def, defName) {
  return mapper(def, { ...opts, defName })
}

const hasNoValue = function (key, value) {
  return value === undefined || value === null
}
