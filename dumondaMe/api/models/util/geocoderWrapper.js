'use strict';

let NodeGeocoder = require('node-geocoder');

let options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODING_SECRET,
    language: 'de',
    formatter: null
};

module.exports = NodeGeocoder(options);
