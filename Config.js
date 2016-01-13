'use strict';

let config;

function getConfig(env="dev") {
  if (!config) {
    config = require('./config/dev.json');
    console.log(`Loaded ${env} configuration.`);
  }
  return config;
}

export default getConfig;
