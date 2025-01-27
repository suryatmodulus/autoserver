import { excludeKeys } from 'filter-obj'

// Normalize empty values (undefined, null) by removing their key
export const normalizeEmpty = function ({ args, args: { newData } }) {
  if (newData === undefined) {
    return
  }

  const newDataA = newData.map(removeEmpty)
  return { args: { ...args, newData: newDataA } }
}

const removeEmpty = function (newData) {
  return excludeKeys(newData, hasNoValue)
}

const hasNoValue = function (key, value) {
  return value === undefined || value === null
}
