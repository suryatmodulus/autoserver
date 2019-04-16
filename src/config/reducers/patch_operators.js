const { mapValues } = require('../../utils/functional/map.js')
const { uniq } = require('../../utils/functional/uniq.js')
const { OPERATORS } = require('../../patch/operators/main.js')

// Parse `operators.attribute|argument` `any`
const normalizePatchOperators = function({ config: { operators } }) {
  if (operators === undefined) {
    return
  }

  const operatorsA = mapValues(operators, normalizePatchOperator)

  // Merge system patch operators and config-defined ones
  const operatorsB = { ...operatorsA, ...OPERATORS }

  return { operators: operatorsB }
}

const normalizePatchOperator = function(operator) {
  const field = normalizeField({ operator, name: 'attribute' })
  return { ...operator, ...field }
}

const normalizeField = function({ operator, name }) {
  const { [name]: field } = operator

  if (field === undefined) {
    return
  }

  const types = TYPES[name]
  const fieldA = field.flatMap(type => types[type] || type)
  const fieldB = uniq(fieldA)
  return { [name]: fieldB }
}

const TYPES = {
  attribute: {
    any: ['boolean', 'integer', 'number', 'string'],
    'any[]': ['boolean[]', 'integer[]', 'number[]', 'string[]'],
  },
  argument: {
    any: ['boolean', 'integer', 'number', 'string', 'empty', 'object'],
    'any[]': [
      'boolean[]',
      'integer[]',
      'number[]',
      'string[]',
      'empty[]',
      'object[]',
    ],
  },
}

module.exports = {
  normalizePatchOperators,
}
