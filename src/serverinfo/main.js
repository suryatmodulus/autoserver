'use strict';

const { pid } = require('process');

const moize = require('moize').default;

const { getHostInfo } = require('./host');
const { getVersionsInfo } = require('./versions');
const { getProcessInfo } = require('./process');

// Retrieve process-specific and host-specific information
const getServerinfo = function ({ config: { name: processName } = {} }) {
  const host = getHostInfo();
  const versions = getVersionsInfo();
  const processInfo = getProcessInfo({ host, processName });

  return { host, versions, process: processInfo };
};

// Speed up memoization because serializing `config` is slow
const mGetServerinfo = moize(getServerinfo, { transformArgs: () => pid });

module.exports = {
  getServerinfo: mGetServerinfo,
};
