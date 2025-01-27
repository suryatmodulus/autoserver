import { includeKeys } from 'filter-obj'

import { getCurrentData } from './current_data.js'
import { removeDuplicates } from './duplicate.js'

// Merge arguments and retrieve model ids
export const getArgs = function ({ actions, top, top: { args: topargs } }) {
  const { args, ids } = getCommandArgs({ actions, top })

  const argsA = applyTopargs({ args, topargs })

  const currentData = getCurrentData({ actions, ids })
  const argsB = { ...argsA, currentData }

  return { args: argsB, ids }
}

// Merge all `args.data` into `newData`, for `upsert|patch|create` commands
// and into `filter.id`, for `delete` command
const getCommandArgs = function ({ actions, top: { command } }) {
  const { getModels, getArg } = handlers[command.type]

  const models = actions.map(getModels)
  const modelsA = removeDuplicates({ models })

  const ids = modelsA.map(({ id }) => id)

  const args = getArg({ models: modelsA, ids })

  return { args, ids }
}

const useArgsData = ({ args: { data } }) => data
const useCurrentData = ({ currentData }) => currentData
const setNewData = ({ models }) => ({ newData: models })
const setDeletedIds = ({ ids }) => ({ deletedIds: ids })

// `delete` uses a different logic than `create|upsert|patch`
export const handlers = {
  create: { getModels: useArgsData, getArg: setNewData },
  upsert: { getModels: useArgsData, getArg: setNewData },
  patch: { getModels: useArgsData, getArg: setNewData },
  delete: { getModels: useCurrentData, getArg: setDeletedIds },
}

// Reuse some allowed top-level arguments
const applyTopargs = function ({ args, topargs }) {
  const topargsA = includeKeys(topargs, ['dryrun'])
  return { ...topargsA, ...args }
}
