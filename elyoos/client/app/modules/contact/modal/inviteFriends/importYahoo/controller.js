'use strict';

module.exports = ['$window', 'ImportYahooContacts', 'ImportYahooCodeParser', 'SourceImportModification',
    function ($window, ImportYahooContacts, ImportYahooCodeParser, SourceImportModification) {
        var ctrl = this;

        ctrl.openYahoo = function () {
            var newWindow = $window.open('https://api.login.yahoo.com/oauth2/request_auth?response_type=code&client_id=dj0yJmk9YmxtcnBNTVdkUTUwJmQ9WVdrOVFtRnFNMkpUTm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wMw--&scope=&redirect_uri=https%3A%2F%2Fpreview.elyoos.org%2Fauth', 'name',
                'height=600,width=450');
            if (angular.isFunction(newWindow.focus)) {
                newWindow.focus();
            }
            ctrl.importStarted();
            $window.elyChildWindowUrl = function (newUrl) {
                if (angular.isString(newUrl)) {
                    ctrl.yahooContacts = ImportYahooContacts.get({code: ImportYahooCodeParser.parseYahooUrl(newUrl)}, function () {
                        SourceImportModification.addSourceDescription(ctrl.yahooContacts.addresses, 'Yahoo');
                        ctrl.contacts.addresses = ctrl.contacts.addresses.concat(ctrl.yahooContacts.addresses);
                        ctrl.importFinish(null, 'yahoo');
                    }, function () {
                        ctrl.importFinish();
                    });
                }
            };
        };
    }];

