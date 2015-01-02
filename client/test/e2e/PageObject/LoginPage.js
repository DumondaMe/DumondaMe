'use strict';

module.exports = function () {
    this.nameInput = element(by.model('loginuser.email'));
    this.passwordInput = element(by.model('loginuser.password'));

    this.get = function () {
        browser.get('/login');
    }

    this.submit = function (ptor) {
        ptor.findElement(protractor.By.id('login')).click();
    }
};
