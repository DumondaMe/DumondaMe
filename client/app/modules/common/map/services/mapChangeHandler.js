'use strict';

var getRadius = function (width, height) {
    if (width > height) {
        return height / 2;
    }
    return width / 2;
};

module.exports = ['MapDistanceCalculator',
    function (MapDistanceCalculator) {
        this.mapChanged = function (map, onMapChange) {
            if (angular.isFunction(onMapChange)) {
                var width = MapDistanceCalculator.calculateDistance(map.getBounds().getEast(), map.getBounds().getNorth(), map.getBounds().getWest(),
                    map.getBounds().getNorth());
                var height = MapDistanceCalculator.calculateDistance(map.getBounds().getEast(), map.getBounds().getNorth(), map.getBounds().getEast(),
                    map.getBounds().getSouth());

                onMapChange(getRadius(width, height), map.getCenter(), map.getZoom());
            }
        };
    }];
