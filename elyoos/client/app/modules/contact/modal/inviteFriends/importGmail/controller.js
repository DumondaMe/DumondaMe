'use strict';

module.exports = ['$scope', '$interval', 'ImportGmailContacts', 'ImportGmailCodeParser', 'SourceImportModification', 'OAUTH_GMAIL_URL', 'OAuthOpenWindow',
    function ($scope, $interval, ImportGmailContacts, ImportGmailCodeParser, SourceImportModification, OAUTH_GMAIL_URL, OAuthOpenWindow) {
        var ctrl = this, intervalCheckWindow;

        ctrl.openGmail = function () {
            if(!ctrl.deactivate) {
                intervalCheckWindow = OAuthOpenWindow.open(OAUTH_GMAIL_URL, ctrl.importFinish, ctrl.importStarted, ctrl.contacts,
                    ImportGmailContacts, ImportGmailCodeParser, 'gmail', 'Gmail');
            }

        };

        $scope.$on('$destroy', function () {
            if (angular.isDefined(intervalCheckWindow)) {
                $interval.cancel(intervalCheckWindow);
            }
        });
    }];

