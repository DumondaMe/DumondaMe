'use strict';

var geocoder = require('./../util/geocoder');

var search = function (place) {
    return geocoder.geocode(place);
};

module.exports = {
    search: search
};
