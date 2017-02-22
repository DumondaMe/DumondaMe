'use strict';

module.exports = ['$window', 'ImportOutlookContacts', 'ImportOutlookCodeParser', 'SourceImportModification', 'OAUTH_OUTLOOK_URL',
    function ($window, ImportOutlookContacts, ImportOutlookCodeParser, SourceImportModification, OAUTH_OUTLOOK_URL) {
        var ctrl = this;

        ctrl.openOutlook = function () {
            var newWindow = $window.open(OAUTH_OUTLOOK_URL, 'name',
                'height=600,width=450');
            if (angular.isFunction(newWindow.focus)) {
                newWindow.focus();
            }
            ctrl.importStarted();
            $window.elyChildWindowUrl = function (newUrl) {
                if (angular.isString(newUrl)) {
                    ctrl.outlookContacts = ImportOutlookContacts.get({code: ImportOutlookCodeParser.parseOutlookUrl(newUrl)}, function () {
                        SourceImportModification.addSourceDescription(ctrl.outlookContacts.addresses, 'Outlook.com');
                        ctrl.contacts.addresses = ctrl.contacts.addresses.concat(ctrl.outlookContacts.addresses);
                        ctrl.importFinish(null, 'outlook');
                    }, function () {
                        ctrl.importFinish();
                    });
                }
            };

        };
    }];

