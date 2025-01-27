import { includeKeys } from 'filter-obj'

import { mapValues } from '../../../utils/functional/map.js'

import { renameData } from './data.js'
import { renameFilter } from './filter.js'
import { renameOrder } from './order.js'

// Some databases require a specific name for `id`, e.g. `_id` for MongoDB.
// This is a translation layer that modifies `id` name inside and outside of
// the database adapter.
export const renameIdsInput = function ({ dbAdapter: { idName }, args }) {
  // Database adapter declare optional `id` name with `idName`
  if (idName === undefined) {
    return
  }

  const newIdName = idName
  const oldIdName = 'id'

  const renamedInput = renameArgs({ args, newIdName, oldIdName })
  return { ...renamedInput }
}

// Revert changes
export const renameIdsOutput = function ({
  dbAdapter: { idName },
  args,
  dbData,
}) {
  if (idName === undefined) {
    return
  }

  const newIdName = 'id'
  const oldIdName = idName

  const renamedInput = renameArgs({ args, newIdName, oldIdName })
  const renamedInputA = renameDbData({ dbData, newIdName, oldIdName })
  return { ...renamedInput, ...renamedInputA }
}

const renameArgs = function ({ args, newIdName, oldIdName }) {
  const input = includeKeys(
    args,
    (name, value) =>
      value !== undefined && Object.keys(idsInput).includes(name),
  )

  const argsA = mapValues(input, (value, name) =>
    idsInput[name]({ value, newIdName, oldIdName }),
  )

  const argsB = { ...args, ...argsA }
  return { args: argsB }
}

const renameDbData = function ({ dbData, newIdName, oldIdName }) {
  if (dbData === undefined) {
    return
  }

  const dbDataA = idsInput.dbData({ value: dbData, newIdName, oldIdName })
  return { dbData: dbDataA }
}

const idsInput = {
  newData: renameData,
  filter: renameFilter,
  order: renameOrder,
  dbData: renameData,
}
