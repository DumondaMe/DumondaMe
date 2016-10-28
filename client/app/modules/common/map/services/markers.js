'use strict';

module.exports = [function () {
    var service = this, markerCollection = [];

    service.addMarker = function (map, lat, lng) {
        markerCollection.push(L.marker([lat, lng]).addTo(map));
    };

    service.deleteAllMarker = function (map) {
        angular.forEach(markerCollection, function (marker) {
            map.removeLayer(marker);
        });
        markerCollection = [];
    };
}];
