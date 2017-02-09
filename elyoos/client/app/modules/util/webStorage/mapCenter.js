'use strict';


module.exports = [function () {

    this.setNewCenter = function (latitude, longitude, zoom) {
        localStorage.setItem("mapCenterLat", latitude);
        localStorage.setItem("mapCenterLng", longitude);
        localStorage.setItem("mapCenterLZoom", zoom);
    };

    this.getMapCenter = function () {
        return {
            latitude: localStorage.getItem("mapCenterLat"),
            longitude: localStorage.getItem("mapCenterLng"),
            zoom: localStorage.getItem("mapCenterLZoom")
        };
    };
}];
