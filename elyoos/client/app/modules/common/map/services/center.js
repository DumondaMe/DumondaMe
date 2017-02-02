'use strict';

module.exports = [function () {
    var service = this, marker;

    service.setCenterMarker = function (markerCenter, center, elyHelper, map) {
        if (elyHelper.isTrue(markerCenter) && elyHelper.isDefined(center.lat) && elyHelper.isDefined(center.lng)) {
            if (elyHelper.isDefined(marker)) {
                map.removeLayer(marker);
            }
            marker = L.marker([center.lat, center.lng]).addTo(map);
        }
    };

    service.setCenter = function (center, zoom, markerCenter, elyHelper, map) {
        map.panTo([center.lat, center.lng]);
        map.setZoom(zoom);
        service.setCenterMarker(markerCenter, center, elyHelper, map);
    }
}];
