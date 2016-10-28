'use strict';


module.exports = [function () {

    this.setNewCenter = function (lat, lng, zoom) {
        localStorage.setItem("mapCenterLat", lat);
        localStorage.setItem("mapCenterLng", lng);
        localStorage.setItem("mapCenterLZoom", zoom);
    };

    this.getMapCenter = function () {
        return {lat: localStorage.getItem("mapCenterLat"), lng: localStorage.getItem("mapCenterLng"), zoom: localStorage.getItem("mapCenterLZoom")};
    };
}];
