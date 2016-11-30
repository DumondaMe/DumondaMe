'use strict';

module.exports = function () {
    this.forenameInput = element(by.model('userDataToChange.forename'));
    this.surnameInput = element(by.model('userDataToChange.surname'));
    this.birthdayInput = element(by.model('userDataToChange.birthday'));
    this.streetInput = element(by.model('userDataToChange.street'));
    this.placeInput = element(by.model('userDataToChange.place'));
    this.countryInput = element(by.model('userDataToChange.country'));

    this.submit = function () {
        element(by.css('#submit-change-profile')).click();
    };

    this.selectMale = function () {
        element.all(by.css('#inputGender label')).get(1).click();
    };

    this.selectFemale = function () {
        element.all(by.css('#inputGender label')).get(0).click();
    };

    this.getMaleClass = function () {
        return element.all(by.css('#inputGender label')).get(1).getAttribute('class');
    };

    this.getFemaleClass = function () {
        return element.all(by.css('#inputGender label')).get(0).getAttribute('class');
    };


};
