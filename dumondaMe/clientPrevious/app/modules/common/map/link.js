'use strict';

module.exports = {
    directiveLink: function ($timeout, elyHelper, MapChangeHandler, mapMarker, MapCenter, MapView, MapDistanceCalculator) {
        return function (scope, element) {

            var map = L.map(element[0]), isInit = false;
            var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'rwaldvogel.1mn00565',
                accessToken: 'pk.eyJ1IjoicndhbGR2b2dlbCIsImEiOiJjaXVndnd0eTYwMDRlMnpvZ3Fsbmx1M29xIn0.8p_GwgMy8q_n-CWVYHd3AA'
            });
            tileLayer.addTo(map);
            map.scrollWheelZoom.disable();

            map.on('dragend', function () {
                if (isInit) {
                    $timeout(function () {
                        MapChangeHandler.mapChanged(map, scope.onMapChange);
                    }, 0);
                }
            });

            map.on('zoomend', function () {
                if (isInit) {
                    $timeout(function () {
                        MapChangeHandler.mapChanged(map, scope.onMapChange);
                    }, 0);
                }
            });

            map.on('resize', function () {
                if (isInit) {
                    $timeout(function () {
                        map.invalidateSize();
                    }, 0);
                }
            });

            if (elyHelper.isDefined(scope.commands)) {
                scope.commands.addMarker = function (latitude, longitude, events) {
                    map.invalidateSize();
                    return mapMarker.addMarker(map, latitude, longitude, events);
                };
                scope.commands.addMarkerGroupAndCenter = function (markers, fitBoundOptions) {
                    map.invalidateSize();
                    return mapMarker.addMarkerGroupAndCenter(map, markers, fitBoundOptions);
                };
                scope.commands.setSelectedMarker = function (marker) {
                    map.invalidateSize();
                    return mapMarker.setSelectedMarker(marker);
                };
                scope.commands.setDefaultMarker = function (marker) {
                    map.invalidateSize();
                    return mapMarker.setDefaultMarker(marker);
                };
                scope.commands.clearAllMarkers = function () {
                    map.invalidateSize();
                    mapMarker.deleteAllMarker(map);
                };
            }

            map.whenReady(function () {
                $timeout(function () {
                    map.invalidateSize();
                    isInit = true;
                    if (angular.isFunction(scope.mapInit)) {
                        scope.mapInit(MapDistanceCalculator.getRadius(map), map.getCenter(), map.getZoom());
                    }
                }, 50);
            });

            scope.$watchCollection('center', function (newCenter) {
                if (elyHelper.isDefined(newCenter)) {
                    MapCenter.setCenter(scope.center, scope.zoom, scope.hasMarkerCenter, map);
                }
            });

            scope.$on('$destroy', function () {
                map.remove();
            });
            $timeout(function () {
                MapView.setView(scope.center, scope.defaultCenter, scope.zoom, scope.defaultZoom, scope.hasMarkerCenter, map);
            }, 0);
        };
    }
};
