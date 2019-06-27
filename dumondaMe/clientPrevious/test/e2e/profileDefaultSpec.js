'use strict';

var LoginPage = require('./PageObject/LoginPage.js');
var HomePage = require('./PageObject/HomePage.js');
var DefaultProfilePage = require('./PageObject/DefaultProfilePage.js');

describe('Default Profile behavior tests', function () {

    var ptor;

    beforeEach(function () {
        ptor = protractor.getInstance();
        ptor.manage().deleteAllCookies();

        var loginPage = new LoginPage(), homePage = new HomePage();
        loginPage.get();
        loginPage.nameInput.sendKeys('user.integrationtest@irgendwo.ch');
        loginPage.passwordInput.sendKeys('1234');
        loginPage.submit(ptor);

        homePage.navToProfileDefault(ptor);
    });

    describe('Default Profile behavior tests', function () {

        function updateUserData(defaultProfilePage, forename, surname, birthday, country, isFemale, street, place) {
            defaultProfilePage.forenameInput.clear();
            defaultProfilePage.forenameInput.sendKeys(forename);
            defaultProfilePage.surnameInput.clear();
            defaultProfilePage.surnameInput.sendKeys(surname);
            defaultProfilePage.birthdayInput.clear();
            defaultProfilePage.birthdayInput.sendKeys(birthday);
            defaultProfilePage.countryInput.clear();
            defaultProfilePage.countryInput.sendKeys(country);
            if (isFemale) {
                defaultProfilePage.selectFemale();
            } else {
                defaultProfilePage.selectMale();
            }

            defaultProfilePage.streetInput.clear();
            if (street) {
                defaultProfilePage.streetInput.sendKeys(street);
            }
            defaultProfilePage.placeInput.clear();
            if (place) {
                defaultProfilePage.placeInput.sendKeys(place);
            }

            defaultProfilePage.submit();
        }

        function checkUserData(defaultProfilePage, forename, surname, birthday, country, isFemale, street, place) {
            expect(defaultProfilePage.forenameInput.getAttribute('value')).toEqual(forename);
            expect(defaultProfilePage.surnameInput.getAttribute('value')).toEqual(surname);
            expect(defaultProfilePage.birthdayInput.getAttribute('value')).toEqual(birthday);
            expect(defaultProfilePage.countryInput.getAttribute('value')).toEqual(country);
            if (isFemale) {
                expect(defaultProfilePage.getFemaleClass()).toMatch('active');
            } else {
                expect(defaultProfilePage.getMaleClass()).toMatch('active');
            }
            if (street) {
                expect(defaultProfilePage.streetInput.getAttribute('value')).toEqual(street);
            }
            if (place) {
                expect(defaultProfilePage.placeInput.getAttribute('value')).toEqual(place);
            }
        }

        function refreshBrowser() {
            ptor.sleep(1000);
            ptor.navigate().refresh();
            ptor.sleep(1000);
        }

        function checkAndUpdateUserData(defaultProfilePage, forename, surname, birthday, country, isFemale, street, place) {

            updateUserData(defaultProfilePage, forename, surname, birthday, country, isFemale, street, place);

            refreshBrowser();

            checkUserData(defaultProfilePage, forename, surname, birthday, country, isFemale, street, place);
        }

        it('Change User data without optional fields', function () {
            var defaultProfilePage = new DefaultProfilePage();

            checkAndUpdateUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);
            checkAndUpdateUserData(defaultProfilePage, 'user2', 'usersurname2', '1983-04-27', 'Deutschland', true);

        });

        it('Change User data with optional fields', function () {
            var defaultProfilePage = new DefaultProfilePage();

            checkAndUpdateUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false, 'im Traumland', 'Irgendwo');
            checkAndUpdateUserData(defaultProfilePage, 'user2', 'usersurname2', '1983-04-27', 'Deutschland', true, 'im Traumland2', 'Irgendwo2');

        });

        it('Wrong country input is not send to server', function () {
            var defaultProfilePage = new DefaultProfilePage();

            checkAndUpdateUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);
            //Empty Forename
            updateUserData(defaultProfilePage, '', 'usersurname2', '1983-04-27', 'Deutschland', true);
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);

            //to long Forename
            updateUserData(defaultProfilePage, 'adfegefegeadfegefegeadfegefege1', 'usersurname2', '1983-04-27', 'Deutschland', true);
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);

            //Empty Surname
            updateUserData(defaultProfilePage, 'user2', '', '1983-04-27', 'Deutschland', true);
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);

            //to long Surname
            updateUserData(defaultProfilePage, 'user2', 'adfegefegeadfegefegeadfegefegeadfegefegeadfegefegew', '1983-04-27', 'Deutschland', true);
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);

            //Empty Birtday
            updateUserData(defaultProfilePage, 'user2', 'usersurname2', '', 'Deutschland', true);
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);

            //Wrong Birtday Format
            updateUserData(defaultProfilePage, 'user2', 'usersurname2', '1982-03-32', 'Deutschland', true);
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);

            //Empty Country
            updateUserData(defaultProfilePage, 'user2', 'usersurname2', '1983-04-27', '', true);
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);

            //to long Country name
            updateUserData(defaultProfilePage, 'user2', 'usersurname2', '1983-04-27', 'adfegefegeadfegefegeadfegefegeadfegefegeadfegefegew', true);
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);

            //to long Street name
            updateUserData(defaultProfilePage, 'user2', 'usersurname2', '1983-04-27', 'Deutschland', true, 'adfegefegeadfegefegeadfegefegeadfegefegeadfegefegeadfegefegeadfegefegeadfegefege3');
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);

            //to long Place name
            updateUserData(defaultProfilePage, 'user2', 'usersurname2', '1983-04-27', 'Deutschland', true, undefined, 'adfegefegeadfegefegeadfegefegeadfegefegeadfegefegeadfegefegeadfegefegeadfegefege3');
            refreshBrowser();
            checkUserData(defaultProfilePage, 'user1', 'usersurname1', '1982-03-26', 'Schweiz', false);
        }, 100000);
    });
});
