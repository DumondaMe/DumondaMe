'use strict';

module.exports = [function () {
    var ctrl = this;
    ctrl.actualScreen = 0;

    ctrl.onSwipeDown = function () {
        if (ctrl.actualScreen > 0) {
            ctrl.actualScreen--;
        }
    };

    ctrl.onSwipeUp = function () {
        if (ctrl.actualScreen < 3) {
            ctrl.actualScreen++;
        }
    };
}];
