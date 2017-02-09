'use strict';

module.exports = ['$scope', '$mdMedia', 'PopularAddressRecommendation', 'WebStorageMapCenter', 'ElyMapMarkerService', '$mdSidenav',
    function ($scope, $mdMedia, PopularAddressRecommendation, WebStorageMapCenter, ElyMapMarkerService, $mdSidenav) {
    var ctrl = this;

    ctrl.commandsMap = {};
    ctrl.$mdMedia = $mdMedia;
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

    ctrl.toggleMapList = function () {
        $mdSidenav("mapList").toggle();
    };
}];

