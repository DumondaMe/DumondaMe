'use strict';

var NodeGeocoder = require('node-geocoder');
var _ = require('lodash');

var options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: 'e0a0c78a5098a52778cc8c5d51f63048',
    language: 'de',
    formatter: null
};

var geoCoder = NodeGeocoder(options);

var geocode = function (place) {
    return geoCoder.geocode(place).then(function (result) {
        var formatedResult = [];
        _.forEach(result.raw.results, function (rawResult) {
            formatedResult.push({formatted: rawResult.formatted, geometry: rawResult.geometry});
        });
        return formatedResult;
    });
};

module.exports = {
    geocode: geocode
};
