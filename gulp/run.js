'use strict'

const { promisify } = require('util')

const Nodemon = require('nodemon')
// eslint-disable-next-line import/no-internal-modules
const execa = require('gulp-shared-tasks/dist/exec')

const EXAMPLE_PATH = `${__dirname}/../examples/index.js`
const DIST_PATH = `${__dirname}/../dist`

// We use this instead of requiring the application to test the CLI
const runProd = () =>
  execa('node', ['../bin/autoserver.js'], { cwd: 'examples' })

// eslint-disable-next-line fp/no-mutation
runProd.description = 'Run an example production server'

const runDev = () => startNodemon(NODEMON_CONFIG)

// eslint-disable-next-line fp/no-mutation
runDev.description = 'Start an example dev server'

const runDebug = () => startNodemon(DEBUG_NODEMON_CONFIG)

// eslint-disable-next-line fp/no-mutation
runDebug.description = 'Start an example dev server in debug mode'

const startNodemon = async function(config) {
  const nodemon = new Nodemon(config)

  // Otherwise Nodemon's log does not appear
  // eslint-disable-next-line no-restricted-globals
  nodemon.on('log', ({ colour }) => global.console.log(colour))

  await promisify(nodemon.on.bind(nodemon))('start')
}

const NODEMON_CONFIG = {
  script: EXAMPLE_PATH,
  nodeArgs: ['--inspect', '--stack-trace-limit=20'],
  env: { NODE_ENV: 'dev' },
  watch: DIST_PATH,
  delay: 100,
  quiet: true,
}

const DEBUG_NODEMON_CONFIG = {
  ...NODEMON_CONFIG,
  nodeArgs: ['--inspect-brk', '--stack-trace-limit=20'],
}

module.exports = {
  runProd,
  runDev,
  runDebug,
}