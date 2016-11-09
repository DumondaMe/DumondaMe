'use strict';

module.exports = [function () {
    var ctrl = this;

    ctrl.mouseOver = function (recommendation) {
        angular.forEach(recommendation.places, function (place) {
            ctrl.commandsMap.setSelectedMarker(place.marker);
        });
    };

    ctrl.mouseLeaf = function (recommendation) {
        angular.forEach(recommendation.places, function (place) {
            ctrl.commandsMap.setDefaultMarker(place.marker);
        });
    };
}];

