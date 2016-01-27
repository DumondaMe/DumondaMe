'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.isExpanded = false;

        ctrl.closeExpand = function () {
            ctrl.isExpanded = false;
            ctrl.searchClose();
        };

        ctrl.openExpand = function () {
            ctrl.isExpanded = true;
            ctrl.searchOpen();
        };
    }];