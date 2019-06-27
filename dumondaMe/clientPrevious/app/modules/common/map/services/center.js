'use strict';

module.exports = ['elyHelper', function (elyHelper) {
    var service = this, marker;

    service.setCenterMarker = function (markerCenter, center, map) {
        if (elyHelper.isTrue(markerCenter) && elyHelper.isDefined(center.latitude) && elyHelper.isDefined(center.longitude)) {
            if (elyHelper.isDefined(marker)) {
                map.removeLayer(marker);
            }
            marker = L.marker([center.latitude, center.longitude]).addTo(map);
        }
    };

    service.setCenter = function (center, zoom, markerCenter, map) {
        if (elyHelper.isDefined(center.latitude) && elyHelper.isDefined(center.longitude)) {
            map.panTo([center.latitude, center.longitude]);
            map.setZoom(zoom);
            service.setCenterMarker(markerCenter, center, map);
        }
    };
}];
