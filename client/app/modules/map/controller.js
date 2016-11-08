'use strict';

module.exports = ['$scope', 'PopularPlaceRecommendation', 'WebStorageMapCenter', 'ElyMapMarkerService',
    function ($scope, PopularPlaceRecommendation, WebStorageMapCenter, ElyMapMarkerService) {
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
            ElyMapMarkerService.addMarkers(ctrl.popularPlaces.recommendations, ctrl.commandsMap, $scope);
        }, function () {

        });
    };
}];

