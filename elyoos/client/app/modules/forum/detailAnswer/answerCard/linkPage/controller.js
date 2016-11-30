'use strict';

module.exports = ['Link',
    function (Link) {
        var ctrl = this;

        ctrl.openHostName = function () {
            Link.open(ctrl.answer.page.hostname);
        };

        ctrl.openLink = function () {
            Link.open(ctrl.answer.page.link);
        };
    }];

