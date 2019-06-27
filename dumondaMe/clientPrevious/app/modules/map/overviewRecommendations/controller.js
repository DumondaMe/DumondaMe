'use strict';

module.exports = [function () {
    var ctrl = this;

    ctrl.mouseOver = function (recommendation) {
        angular.forEach(recommendation.addresses, function (address) {
            ctrl.commandsMap.setSelectedMarker(address.marker);
        });
    };

    ctrl.mouseLeaf = function (recommendation) {
        angular.forEach(recommendation.addresses, function (address) {
            ctrl.commandsMap.setDefaultMarker(address.marker);
        });
    };
}];

