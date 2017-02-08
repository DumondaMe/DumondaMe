'use strict';


module.exports = [function () {

    this.setNewCenter = function (latitude, longitude, zoom) {
        localStorage.setItem("mapCenterLat", latitude);
        localStorage.setItem("mapCenterLng", longitude);
        localStorage.setItem("mapCenterLZoom", zoom);
    };

    this.getMapCenter = function () {
        return {lat: localStorage.getItem("mapCenterLat"), lng: localStorage.getItem("mapCenterLng"), zoom: localStorage.getItem("mapCenterLZoom")};
    };
}];
