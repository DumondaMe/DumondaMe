'use strict';

module.exports = ['$scope', '$interval',  'ImportYahooContacts', 'ImportYahooCodeParser', 'SourceImportModification', 'OAUTH_YAHOO_URL', 'OAuthOpenWindow',
    function ($scope, $interval, ImportYahooContacts, ImportYahooCodeParser, SourceImportModification, OAUTH_YAHOO_URL, OAuthOpenWindow) {
        var ctrl = this, window;

        ctrl.openYahoo = function () {
            if(!ctrl.deactivate) {
                window = OAuthOpenWindow.open(OAUTH_YAHOO_URL, ctrl.importFinish, ctrl.importStarted, ctrl.contacts,
                    ImportYahooContacts, ImportYahooCodeParser, 'yahoo', 'Yahoo');
            }
        };

        $scope.$on('$destroy', function () {
            if (angular.isDefined(window)) {
                $interval.cancel(window.interval);
                window.window.close();
            }
        });
    }];

