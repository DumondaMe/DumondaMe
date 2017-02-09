'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.select = function () {
            ctrl.element.isSelected = !ctrl.element.isSelected;
            ctrl.elyOnChange();
        };
    }];

