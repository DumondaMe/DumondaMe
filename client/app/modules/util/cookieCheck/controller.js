'use strict';

module.exports = ['$cookieStore',
    function ($cookieStore) {
        var ctrl = this;

        ctrl.areCookiesEnabled = false;

        $cookieStore.put("TestCookie", "TestCookieText");
        ctrl.cookieValue = $cookieStore.get("TestCookie");

        if (ctrl.cookieValue) {
            $cookieStore.remove("TestCookie");
            ctrl.areCookiesEnabled = true;
        }
    }];


