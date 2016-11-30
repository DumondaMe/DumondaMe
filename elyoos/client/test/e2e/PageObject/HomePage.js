'use strict';

module.exports = function () {
    this.get = function () {
        browser.get('/');
    };

    this.logout = function (ptor) {
        ptor.findElement(protractor.By.css(".navigation-element a[href='/logout']")).click();
    };

    this.navToProfileDefault = function (ptor) {
        ptor.findElement(protractor.By.css(".navigation-element a[href='/profile/default']")).click();
    };
};
