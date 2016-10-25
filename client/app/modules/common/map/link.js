'use strict';

var centerMarker;

var setCenter = function (scope, elyHelper, map) {
    if (elyHelper.isDefined(scope.center) && elyHelper.isDefined(scope.zoom)) {
        map.setView([scope.center.lat, scope.center.lng], scope.zoom);
        if (elyHelper.isTrue(scope.markerCenter)) {
            if (elyHelper.isDefined(centerMarker)) {
                map.removeLayer(centerMarker);
            }
            centerMarker = L.marker([scope.center.lat, scope.center.lng]).addTo(map);
        }
    }
};

module.exports = {
    directiveLink: function ($timeout, elyHelper) {
        return function (scope) {

            var map = L.map('map-id');

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

            scope.$watchCollection('center', function () {
                setCenter(scope, elyHelper, map);
            });

            scope.$on('invalidateSize', function () {
                map.invalidateSize();
            });
        };
    }
};
