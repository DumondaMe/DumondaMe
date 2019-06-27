'use strict';

var LoginPage = require('./PageObject/LoginPage.js');
var HomePage = require('./PageObject/HomePage.js');

describe('Login behavior tests', function () {

    var ptor;

    beforeEach(function () {
        ptor = protractor.getInstance();
        ptor.manage().deleteAllCookies();
    });

    it('should automatically redirect to login when the user is not logged in', function () {
        var homePage = new HomePage();
        homePage.get();
        expect(browser.getLocationAbsUrl()).toMatch("/login");
    });

    it('Try to successfully Login and Logout again', function () {
        var homePage = new HomePage(), loginPage = new LoginPage();
        loginPage.get();
        loginPage.nameInput.sendKeys('user.integrationtest@irgendwo.ch');
        loginPage.passwordInput.sendKeys('1234');
        loginPage.submit(ptor);

        expect(browser.getLocationAbsUrl()).toMatch("");

        homePage.logout(ptor);
        expect(browser.getLocationAbsUrl()).toMatch("/logout");
    });
});
