'use strict';

module.exports = ['$window', 'Link',
    function ($window, Link) {
        var ctrl = this;

        ctrl.openLink = Link.open;

    }];

