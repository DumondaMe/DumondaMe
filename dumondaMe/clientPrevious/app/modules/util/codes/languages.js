'use strict';

var languages = [{description: 'Deutsch', code: 'de'},
    {description: 'Englisch', code: 'en'},
    {description: 'Französisch', code: 'fr'},
    {description: 'Italienisch', code: 'it'},
    {description: 'Spanisch', code: 'es'}];

module.exports = ['$log',
    function ($log) {
        this.languages = languages;

        this.getCodes = function (languagesToGetCodes) {
            var result = [];
            if (angular.isArray(languagesToGetCodes)) {
                angular.forEach(languagesToGetCodes, function (language) {
                    if (language.hasOwnProperty('code')) {
                        result.push(language.code);
                    } else {
                        $log.warn('property code does not exit!');
                    }
                });
            }
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

        this.getLanguages = function (codes) {
            var result = [];
            if (angular.isArray(codes)) {
                angular.forEach(codes, function (code) {
                    angular.forEach(languages, function (language) {
                        if (language.code === code) {
                            result.push(language);
                        }
                    });
                });
            }
            return result;
        };
    }];
