const { LOG_OPTS } = require('../../log/info.js')

const { validateAdaptersOpts } = require('./adapter_opts')

// Validates `log.LOG.*`
const validateLogs = function({ config: { log } }) {
  const optsA = log.map(({ provider, opts = {} }) => ({ [provider]: opts }))
  const optsB = Object.assign({}, ...optsA)
  validateAdaptersOpts({ opts: optsB, adaptersOpts: LOG_OPTS, key: 'log' })
}

module.exports = {
  validateLogs,
}
