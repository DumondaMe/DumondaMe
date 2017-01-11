'use strict';

let NodeGeocoder = require('node-geocoder');
let _ = require('lodash');

let options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: 'e0a0c78a5098a52778cc8c5d51f63048',
    language: 'de',
    formatter: null
};

let geoCoder = NodeGeocoder(options);

let geocode = function (place) {
    return geoCoder.geocode(place).then(function (result) {
        let formatedResult = [];
        _.forEach(result.raw.results, function (rawResult) {
            formatedResult.push({formatted: rawResult.formatted, geometry: rawResult.geometry});
        });
        return formatedResult;
    });
};

module.exports = {
    geocode: geocode
};
