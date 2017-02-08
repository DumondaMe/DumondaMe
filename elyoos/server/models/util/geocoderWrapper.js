'use strict';

let NodeGeocoder = require('node-geocoder');

let options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: 'e0a0c78a5098a52778cc8c5d51f63048',
    language: 'de',
    formatter: null
};

module.exports = NodeGeocoder(options);
