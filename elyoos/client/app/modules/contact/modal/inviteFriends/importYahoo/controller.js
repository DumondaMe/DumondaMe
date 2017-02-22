'use strict';

module.exports = ['$window', 'ImportYahooContacts', 'ImportYahooCodeParser', 'SourceImportModification', 'OAUTH_YAHOO_URL',
    function ($window, ImportYahooContacts, ImportYahooCodeParser, SourceImportModification, OAUTH_YAHOO_URL) {
        var ctrl = this;

        ctrl.openYahoo = function () {
            var newWindow = $window.open(OAUTH_YAHOO_URL, 'name',
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

