'use strict';

module.exports = [function () {
    var ctrl = this;

    ctrl.setActualHasEvents = function (hasEvents) {
        ctrl.actualHasEvents = hasEvents;
    };

    ctrl.setPreviousHasEvents = function (hasEvents) {
        ctrl.previousHasEvents = hasEvents;
    };
}];

