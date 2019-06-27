'use strict';

module.exports = ['$scope', '$interval', 'ImportOutlookContacts', 'ImportOutlookCodeParser', 'SourceImportModification',
    'OAUTH_OUTLOOK_URL', 'OAuthOpenWindow',
    function ($scope, $interval, ImportOutlookContacts, ImportOutlookCodeParser, SourceImportModification,
              OAUTH_OUTLOOK_URL, OAuthOpenWindow) {
        var ctrl = this, window;

        ctrl.openOutlook = function () {
            if(!ctrl.deactivate) {
                window = OAuthOpenWindow.open(OAUTH_OUTLOOK_URL, ctrl.importFinish, ctrl.importStarted, ctrl.contacts,
                    ImportOutlookContacts, ImportOutlookCodeParser, 'outlook', 'Outlook.com');
            }
        };

        $scope.$on('$destroy', function () {
            if (angular.isDefined(window)) {
                $interval.cancel(window.interval);
                window.window.close();
            }
        });
    }];

