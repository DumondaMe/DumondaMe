'use strict';

let NodeGeocoder = require('node-geocoder');
let geocodingConfig = require('elyoos-server-lib').geocodingConfig;

let options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: geocodingConfig.getConfig().secret,
    language: 'de',
    formatter: null
};

module.exports = NodeGeocoder(options);
