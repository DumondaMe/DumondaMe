'use strict';

var languages = [{description: 'Deutsch', code: 'de'},
    {description: 'Englisch', code: 'en'},
    {description: 'Franz\u00f6sisch', code: 'fr'},
    {description: 'Italienisch', code: 'it'},
    {description: 'Spanisch', code: 'es'}];

module.exports = [
    function () {
        this.languages = languages;

        this.getCode = function (description) {
            var result = false;
            angular.forEach(languages, function (language) {
                if (language.description === description) {
                    result = language.code;
                }
            });
            return result;
        };

        this.getLanguage = function (code) {
            var result = languages[0].description;
            angular.forEach(languages, function (language) {
                if (language.code === code) {
                    result = language.description;
                }
            });
            return result;
        };
    }];
