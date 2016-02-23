'use strict';

module.exports = [
    function () {

        var service = this, toolbar;

        service.registerToolbar = function (newToolbar) {
            toolbar = newToolbar;
        };

        service.setTitle = function (title) {
            toolbar.setTitle(title);
        };
    }];
