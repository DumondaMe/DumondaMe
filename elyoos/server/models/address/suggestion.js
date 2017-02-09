'use strict';

let geocoder = require('./../util/geocoder');

let search = function (place) {
    return geocoder.geocode(place);
};

module.exports = {
    search: search
};
