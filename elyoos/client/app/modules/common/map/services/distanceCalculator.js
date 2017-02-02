'use strict';


module.exports = [
    function () {
        var service = this;

        var calculateDistance = function (lat1, lon1, lat2, lon2) {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.853159616;
            return dist;
        };

        service.getRadius = function (map) {

            var width = calculateDistance(map.getBounds().getEast(), map.getBounds().getNorth(), map.getBounds().getWest(),
                map.getBounds().getNorth());
            var height = calculateDistance(map.getBounds().getEast(), map.getBounds().getNorth(), map.getBounds().getEast(),
                map.getBounds().getSouth());

            if (width > height) {
                return height / 2;
            }
            return width / 2;
        };
    }];
