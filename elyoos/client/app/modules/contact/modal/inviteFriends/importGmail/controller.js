'use strict';

module.exports = ['$window', 'ImportGmailContacts', 'ImportGmailCodeParser', 'SourceImportModification', 'OAUTH_GMAIL_URL',
    function ($window, ImportGmailContacts, ImportGmailCodeParser, SourceImportModification, OAUTH_GMAIL_URL) {
        var ctrl = this;

        ctrl.openGmail = function () {
            var newWindow = $window.open(OAUTH_GMAIL_URL, 'name',
                'height=600,width=450');
            if (angular.isFunction(newWindow.focus)) {
                newWindow.focus();
            }
            ctrl.importStarted();
            $window.elyChildWindowUrl = function (newUrl) {
                ctrl.gmailContacts = ImportGmailContacts.get({code: ImportGmailCodeParser.parseGoogleUrl(newUrl)}, function () {
                    SourceImportModification.addSourceDescription(ctrl.gmailContacts.addresses, 'Gmail');
                    ctrl.contacts.addresses = ctrl.contacts.addresses.concat(ctrl.gmailContacts.addresses);
                    ctrl.importFinish(null, 'gmail');
                }, function () {
                    ctrl.importFinish();
                });
            };

        };
    }];

