'use strict';

module.exports = [function () {
    var service = this, marker;

    var setView = function (center, markerCenter, zoom, elyHelper, map) {
        map.setView([center.lat, center.lng], zoom);
        if (elyHelper.isTrue(markerCenter)) {
            if (elyHelper.isDefined(marker)) {
                map.removeLayer(marker);
            }
            marker = L.marker([center.lat, center.lng]).addTo(map);
        }
    };

    service.setCenter = function (center, defaultCenter, zoom, defaultZoom, markerCenter, elyHelper, map) {
        if (elyHelper.isDefined(center) && elyHelper.isDefined(zoom)) {
            setView(center, markerCenter, zoom, elyHelper, map);
        } else if (elyHelper.isDefined(defaultCenter) && elyHelper.isDefined(defaultZoom)) {
            setView(defaultCenter, markerCenter, defaultZoom, elyHelper, map);
        }
    };
}];
