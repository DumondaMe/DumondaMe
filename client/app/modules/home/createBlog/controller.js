'use strict';

module.exports = [
    function () {
        var ctrl = this;
        ctrl.mainView = true;
        ctrl.createBlogCommands = {};

        ctrl.openVisibility = function () {
            ctrl.mainView = false;
        };

        ctrl.closeVisibility = function () {
            ctrl.mainView = true;
            ctrl.createBlogCommands.activateVisibility();
        };
    }];

