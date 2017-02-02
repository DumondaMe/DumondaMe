'use strict';

module.exports = ['$scope', function ($scope) {
    var ctrl = this, init = false;

    ctrl.commandsMap = {};

    ctrl.mapInit = function () {
        init = true;
        ctrl.commandsMap.addMarkerGroupAndCenter($scope.addresses, {maxZoom: 12});
    };

    $scope.$watchCollection('addresses', function (newAddresses) {
        if(newAddresses && init) {
            ctrl.commandsMap.clearAllMarkers();
            ctrl.commandsMap.addMarkerGroupAndCenter($scope.addresses, {maxZoom: 12});
        }
    });
}];

