'use strict';

module.exports = [function () {
    var service = this;

    service.addMarkers = function (recommendations, commandsMap, $scope) {
        angular.forEach(recommendations, function (recommendation) {
            recommendation.events = {
                mouseOverMarker: function () {
                    $scope.$apply(function () {
                        recommendation.selected = true;
                    });
                }, mouseOutMarker: function () {
                    $scope.$apply(function () {
                        recommendation.selected = false;
                    });
                }
            };
            angular.forEach(recommendation.places, function (place) {
                commandsMap.addMarker(place.latitude, place.longitude, recommendation.events);
            });
        });
    };

}];
