'use strict';

module.exports = ['$cookies',
    function ($cookies) {
        var ctrl = this;

        ctrl.areCookiesEnabled = false;

        ctrl.cookies = $cookies.getAll();
        if (ctrl.cookies && ctrl.cookies['XSRF-TOKEN']) {
            ctrl.areCookiesEnabled = true;
        }
    }];


