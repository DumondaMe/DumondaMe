'use strict';

module.exports = ['PopularPlaceRecommendation', 'WebStorageMapCenter', function (PopularPlaceRecommendation, WebStorageMapCenter) {
    var ctrl = this;

    ctrl.commandsMap = {};
    ctrl.initMapParams = WebStorageMapCenter.getMapCenter();

    ctrl.mapChanged = function (radius, center, zoom) {
        ctrl.popularPlaces = PopularPlaceRecommendation.get({
            skip: 0,
            maxItems: 30,
            centerLat: center.lat,
            centerLng: center.lng,
            radius: radius
        }, function () {
            WebStorageMapCenter.setNewCenter(center.lat, center.lng, zoom);
            ctrl.commandsMap.clearAllMarkers();
            angular.forEach(ctrl.popularPlaces.recommendations, function (recommendation) {
                angular.forEach(recommendation.places, function (place) {
                    ctrl.commandsMap.addMarker(place.latitude, place.longitude);
                });
            });
        }, function () {

        });
    };
}];

