'use strict';

var invalidateSize = function ($timeout, map) {
    $timeout(function () {
        map.invalidateSize();
    }, 50);
};

module.exports = {
    directiveLink: function ($timeout, elyHelper, MapChangeHandler, mapMarker, MapCenter) {
        return function (scope) {

            var map = L.map('map-id');
            var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'rwaldvogel.1mn00565',
                accessToken: 'pk.eyJ1IjoicndhbGR2b2dlbCIsImEiOiJjaXVndnd0eTYwMDRlMnpvZ3Fsbmx1M29xIn0.8p_GwgMy8q_n-CWVYHd3AA'
            });
            tileLayer.addTo(map);
            map.scrollWheelZoom.disable();
            MapCenter.setCenter(scope.center, scope.defaultCenter, scope.zoom, scope.defaultZoom, scope.hasMarkerCenter, elyHelper, map);

            map.on('dragend', function () {
                MapChangeHandler.mapChanged(map, scope.onMapChange);
            });

            map.on('zoomend', function () {
                MapChangeHandler.mapChanged(map, scope.onMapChange);
            });

            map.on('resize', function () {
                MapChangeHandler.mapChanged(map, scope.onMapChange);
            });

            if (elyHelper.isDefined(scope.commands)) {
                scope.commands.addMarker = function (lat, lng, events) {
                    return mapMarker.addMarker(map, lat, lng, events);
                };
                scope.commands.addMarkerGroupAndCenter = function (markers, fitBoundOptions) {
                    return mapMarker.addMarkerGroupAndCenter(map, markers, fitBoundOptions);
                };
                scope.commands.setSelectedMarker = function (marker) {
                    return mapMarker.setSelectedMarker(marker);
                };
                scope.commands.setDefaultMarker = function (marker) {
                    return mapMarker.setDefaultMarker(marker);
                };
                scope.commands.clearAllMarkers = function () {
                    mapMarker.deleteAllMarker(map);
                };
            }

            invalidateSize($timeout, map);

            scope.$watchCollection('center', function (newCenter) {
                if (elyHelper.isDefined(newCenter)) {
                    MapCenter.setCenter(scope.center, scope.defaultCenter, scope.zoom, scope.defaultZoom, scope.hasMarkerCenter, elyHelper, map);
                }
            });

            scope.$on('invalidateSize', function () {
                invalidateSize($timeout, map);
            });
        };
    }
};
