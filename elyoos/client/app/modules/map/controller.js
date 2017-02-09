'use strict';

module.exports = ['$scope', 'PopularAddressRecommendation', 'WebStorageMapCenter', 'ElyMapMarkerService',
    function ($scope, PopularAddressRecommendation, WebStorageMapCenter, ElyMapMarkerService) {
    var ctrl = this;

    ctrl.commandsMap = {};
    ctrl.initMapParams = WebStorageMapCenter.getMapCenter();

    ctrl.mapChanged = function (radius, center, zoom) {
        ctrl.popularAddresses = PopularAddressRecommendation.get({
            skip: 0,
            maxItems: 30,
            centerLat: center.lat,
            centerLng: center.lng,
            radius: radius
        }, function () {
            WebStorageMapCenter.setNewCenter(center.lat, center.lng, zoom);
            ctrl.commandsMap.clearAllMarkers();
            ElyMapMarkerService.addMarkers(ctrl.popularAddresses.recommendations, ctrl.commandsMap, $scope);
        }, function () {

        });
    };
}];

