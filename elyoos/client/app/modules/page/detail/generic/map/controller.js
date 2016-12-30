'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.commandsMap = {};
        ctrl.init = true;

        ctrl.mapChanged = function () {
            if (ctrl.init) {
                ctrl.init = false;
                ctrl.commandsMap.addMarkerGroupAndCenter(ctrl.addresses, {maxZoom: 12});
            }
        };
    }];

