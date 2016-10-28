'use strict';

module.exports = ['PopularPlaceRecommendation', function (PopularPlaceRecommendation) {
    var ctrl = this;

    ctrl.commandsMap = {};

    ctrl.mapChanged = function (radius, center) {
        ctrl.popularPlaces = PopularPlaceRecommendation.get({
            skip: 0,
            maxItems: 30,
            centerLat: center.lat,
            centerLng: center.lng,
            radius: radius
        }, function () {
            ctrl.commandsMap.clearAllMarkers();
            angular.forEach(ctrl.popularPlaces.recommendations, function (recommendation) {
                angular.forEach(recommendation.places, function (place) {
                    ctrl.commandsMap.addMarker(place.latitude, place. longitude);
                });
            });
        }, function () {

        });
    };
}];

