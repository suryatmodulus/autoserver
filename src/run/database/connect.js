'use strict';

const { omit, mapValues } = require('../../utilities');
const { emitEvent } = require('../../events');

const { addAllErrorHandlers } = require('./error');
const { bindAdapters } = require('./bind');

// Initialize each database connection
const startConnections = async function ({
  adapters,
  adaptersMap,
  schema,
  runOpts,
}) {
  // Should use `options`, not `runOpts.db`
  const runOptsA = omit(runOpts, 'db');

  const adaptersA = addAllErrorHandlers({ adapters });
  const connectionsPromises = adaptersA
    .map(adapter => startConnection({ adapter, schema, runOpts: runOptsA }));
  const connections = await Promise.all(connectionsPromises);
  const adaptersB = bindAdapters({
    adapters: adaptersA,
    connections,
    schema,
    runOpts: runOptsA,
  });
  const dbAdapters = getDbAdapters({ adapters: adaptersB, adaptersMap });
  return dbAdapters;
};

// Actual connection
const startConnection = async function ({
  adapter,
  adapter: { connect, check, options },
  schema,
  runOpts,
}) {
  const opts = { options, schema, runOpts };

  const connection = await connect(opts);

  // Check for data model inconsistencies, and potentially fix them
  if (check !== undefined) {
    check({ ...opts, connection });
  }

  emitStartEvent({ adapter, runOpts });

  return connection;
};

// Database adapter-specific start event
const emitStartEvent = async function ({ adapter: { title }, runOpts }) {
  const message = `${title} - Connection initialized`;
  await emitEvent({ type: 'message', phase: 'startup', message, runOpts });
};

// Returns `{ model: adapter }` map
const getDbAdapters = function ({ adapters, adaptersMap }) {
  return mapValues(
    adaptersMap,
    adapter => getDbAdapter({ adapters, adapter }),
  );
};

const getDbAdapter = function ({ adapters, adapter }) {
  return adapters.find(({ type }) => type === adapter);
};

module.exports = {
  startConnections,
};
