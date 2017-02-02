'use strict';

module.exports = ['MapCenter', function (MapCenter) {
    var service = this;

    var setView = function (center, markerCenter, zoom, elyHelper, map) {
        map.setView([center.lat, center.lng], zoom);
        MapCenter.setCenterMarker(markerCenter, center, elyHelper, map);
    };

    service.setView = function (center, defaultCenter, zoom, defaultZoom, markerCenter, elyHelper, map) {
        if (elyHelper.isDefined(center) && elyHelper.isDefined(zoom)) {
            setView(center, markerCenter, zoom, elyHelper, map);
        } else if (elyHelper.isDefined(defaultCenter) && elyHelper.isDefined(defaultZoom)) {
            setView(defaultCenter, markerCenter, defaultZoom, elyHelper, map);
        }
    };
}];
