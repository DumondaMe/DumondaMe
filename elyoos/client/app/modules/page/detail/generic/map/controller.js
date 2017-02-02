'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.commandsMap = {};

        ctrl.mapInit = function () {
            ctrl.commandsMap.addMarkerGroupAndCenter(ctrl.addresses, {maxZoom: 12});
        };
    }];

