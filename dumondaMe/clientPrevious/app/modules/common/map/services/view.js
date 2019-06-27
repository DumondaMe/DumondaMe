'use strict';

module.exports = ['MapCenter', 'elyHelper', function (MapCenter, elyHelper) {
    var service = this;

    var setView = function (center, markerCenter, zoom, map) {
        if (elyHelper.isDefined(center.latitude) && elyHelper.isDefined(center.longitude)) {
            MapCenter.setCenterMarker(markerCenter, center, map);
            map.setView([center.latitude, center.longitude], zoom);
        }
    };

    service.setView = function (center, defaultCenter, zoom, defaultZoom, markerCenter, map) {
        if (elyHelper.isDefined(center) && elyHelper.isDefined(zoom)) {
            setView(center, markerCenter, zoom, map);
        } else if (elyHelper.isDefined(defaultCenter) && elyHelper.isDefined(defaultZoom)) {
            setView(defaultCenter, markerCenter, defaultZoom, map);
        }
    };
}];
