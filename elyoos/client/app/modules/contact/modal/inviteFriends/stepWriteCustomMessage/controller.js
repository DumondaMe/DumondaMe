'use strict';

module.exports = [function () {
    var ctrl = this;

    ctrl.messageChanged = function () {
        if(ctrl.messageForm.$error.hasOwnProperty('md-maxlength')) {
            ctrl.invalidMessage = true;
        } else {
            ctrl.invalidMessage = false;
        }
    };
}];
