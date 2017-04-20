'use strict';

module.exports = [function () {

    this.parseAutoComplete = function (resp, search) {
        var result = [];
        if (resp && resp.data && angular.isArray(resp.data.features)) {
            resp.data.features.forEach(function (feature) {
                var data = {
                    address: feature.properties.label,
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0]
                }, indexOfSearch = data.address.toLowerCase().indexOf(search.toLowerCase());
                if (indexOfSearch !== -1) {
                    data.address = [data.address.slice(0, indexOfSearch), "<b>",
                        data.address.slice(indexOfSearch)].join('');
                    indexOfSearch = data.address.toLowerCase().indexOf(search.toLowerCase());
                    data.address = [data.address.slice(0, indexOfSearch + search.length), "</b>",
                        data.address.slice(indexOfSearch + search.length)].join('');
                }
                result.push(data);
            });
        }
        return result;
    };
}];
