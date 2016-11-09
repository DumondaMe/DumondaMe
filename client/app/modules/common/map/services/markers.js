'use strict';

var selectedIcon = L.icon({
    iconUrl: 'app/lib/map/images/marker-icon-selected.png',
    iconRetinaUrl: 'app/lib/map/images/marker-icon-selected-2x.png',
    shadowUrl: 'app/lib/map/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

var defaultIcon = L.icon({
    iconUrl: 'app/lib/map/images/marker-icon.png',
    iconRetinaUrl: 'app/lib/map/images/marker-icon-2x.png',
    shadowUrl: 'app/lib/map/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

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
        return marker;
    };

    service.setSelectedMarker = function (marker) {
        marker.setIcon(selectedIcon);
    };

    service.setDefaultMarker = function (marker) {
        marker.setIcon(defaultIcon);
    };

    service.deleteAllMarker = function (map) {
        angular.forEach(markerCollection, function (marker) {
            map.removeLayer(marker);
        });
        markerCollection = [];
    };
}];
