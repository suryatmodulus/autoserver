const { getRequestHandler } = require('../middleware/main.js')
const { loadConfig } = require('../config/main.js')

const {
  startStartupPerf,
  stopStartupPerf,
  reportStartupPerf,
} = require('./perf')
const { processErrorHandler } = require('./process')
const { connectToDatabases } = require('./database/main.js')
const { setupGracefulExit } = require('./exit/setup.js')
const { launchProtocols } = require('./launch')
const { emitStartEvent } = require('./start_event')

const startupSteps = [
  // Start monitoring main startup time
  startStartupPerf,
  // Loads config
  loadConfig,
  // Setup process warnings and errors handler
  processErrorHandler,
  // Get main request handler
  getRequestHandler,
  // Create database connections
  connectToDatabases,
  // Boot each protocol-specific server
  launchProtocols,
  // Make sure servers are closed on exit
  setupGracefulExit,
  // Stop monitoring main startup time
  stopStartupPerf,
  // Emit 'start' event
  emitStartEvent,
  // Report startup performance monitoring
  reportStartupPerf,
]

module.exports = {
  startupSteps,
}
