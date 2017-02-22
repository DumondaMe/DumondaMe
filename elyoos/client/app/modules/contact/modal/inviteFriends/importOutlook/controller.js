'use strict';

module.exports = ['$window', 'ImportOutlookContacts', 'ImportOutlookCodeParser', 'SourceImportModification',
    function ($window, ImportOutlookContacts, ImportOutlookCodeParser, SourceImportModification) {
        var ctrl = this;

        ctrl.openOutlook = function () {
            var newWindow = $window.open('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&client_id=fd3fdc4c-3601-42ec-a23b-2ba31eb4dc8b&scope=openid%20https://outlook.office.com/contacts.read&redirect_uri=http%3A%2F%2Flocalhost:8080%2Fauth', 'name',
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

