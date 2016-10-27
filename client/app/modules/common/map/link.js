'use strict';

var actualCenterMarker;

var setView = function (center, markerCenter, zoom, elyHelper, map) {
    map.setView([center.lat, center.lng], zoom);
    if (elyHelper.isTrue(markerCenter)) {
        if (elyHelper.isDefined(actualCenterMarker)) {
            map.removeLayer(actualCenterMarker);
        }
        actualCenterMarker = L.marker([center.lat, center.lng]).addTo(map);
    }
};

var setCenter = function (scope, elyHelper, map) {
    if (elyHelper.isDefined(scope.center) && elyHelper.isDefined(scope.zoom)) {
        setView(scope.center, scope.markerCenter, scope.zoom, elyHelper, map);
    } else if (elyHelper.isDefined(scope.defaultCenter) && elyHelper.isDefined(scope.defaultZoom)) {
        setView(scope.defaultCenter, scope.markerCenter, scope.defaultZoom, elyHelper, map);
    }
};

module.exports = {
    directiveLink: function ($timeout, elyHelper) {
        return function (scope) {

            var map = L.map('map-id');

            map.scrollWheelZoom.disable();

            setCenter(scope, elyHelper, map);

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'rwaldvogel.1mn00565',
                accessToken: 'pk.eyJ1IjoicndhbGR2b2dlbCIsImEiOiJjaXVndnd0eTYwMDRlMnpvZ3Fsbmx1M29xIn0.8p_GwgMy8q_n-CWVYHd3AA'
            }).addTo(map);

            $timeout(function () {
                map.invalidateSize();
            });

            scope.$watchCollection('center', function (newCenter) {
                if (elyHelper.isDefined(newCenter)) {
                    setCenter(scope, elyHelper, map);
                }
            });

            scope.$on('invalidateSize', function () {
                map.invalidateSize();
            });
        };
    }
};
