'use strict';

module.exports = ['$scope', '$interval',  'ImportYahooContacts', 'ImportYahooCodeParser', 'SourceImportModification', 'OAUTH_YAHOO_URL', 'OAuthOpenWindow',
    function ($scope, $interval, ImportYahooContacts, ImportYahooCodeParser, SourceImportModification, OAUTH_YAHOO_URL, OAuthOpenWindow) {
        var ctrl = this, intervalCheckWindow;

        ctrl.openYahoo = function () {
            intervalCheckWindow = OAuthOpenWindow.open(OAUTH_YAHOO_URL, ctrl.importFinish, ctrl.importStarted, ctrl.contacts,
                ImportYahooContacts, ImportYahooCodeParser, 'yahoo', 'Yahoo');
        };

        $scope.$on('$destroy', function () {
            if (angular.isDefined(intervalCheckWindow)) {
                $interval.cancel(intervalCheckWindow);
            }
        });
    }];

