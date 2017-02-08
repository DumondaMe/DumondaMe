'use strict';

let geoCoder = require('./geocoderWrapper');
let _ = require('lodash');

let geocode = function (place) {
    return geoCoder.geocode(place).then(function (result) {
        let formatedResult = [];
        _.forEach(result.raw.results, function (rawResult) {
            formatedResult.push({address: rawResult.formatted, latitude: rawResult.geometry.lat, longitude: rawResult.geometry.lng});
        });
        return formatedResult;
    });
};

module.exports = {
    geocode: geocode
};
