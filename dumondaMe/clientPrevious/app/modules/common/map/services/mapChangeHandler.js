'use strict';

module.exports = ['MapDistanceCalculator',
    function (MapDistanceCalculator) {
        this.mapChanged = function (map, onMapChange) {
            if (angular.isFunction(onMapChange)) {
                onMapChange(MapDistanceCalculator.getRadius(map), map.getCenter(), map.getZoom());
            }
        };
    }];
