'use strict';

module.exports = ['elyHelper', function (elyHelper) {
    var service = this, markerCollection = [];

    service.addMarker = function (map, lat, lng, events) {
        var marker = L.marker([lat, lng]);
        if (elyHelper.isDefined(events)) {
            marker.on('mouseover', function () {
                if (elyHelper.isFunction(events.mouseOverMarker)) {
                    events.mouseOverMarker();
                }
            });
            marker.on('mouseout', function () {
                if (elyHelper.isFunction(events.mouseOutMarker)) {
                    events.mouseOutMarker();
                }
            });
        }
        marker.addTo(map);
        markerCollection.push(marker);
    };

    service.deleteAllMarker = function (map) {
        angular.forEach(markerCollection, function (marker) {
            map.removeLayer(marker);
        });
        markerCollection = [];
    };
}];
