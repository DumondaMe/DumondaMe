'use strict';

module.exports = ['$window', '$interval', 'SourceImportModification', 'ArrayHelper',
    function ($window, $interval, SourceImportModification, ArrayHelper) {

        this.open = function (oAuthUrl, importFinish, importStarted, contacts, importResource,
                              parser, finishDescription, sourceDescription) {
            var newWindow = $window.open(oAuthUrl, 'name',
                'height=600,width=450'), intervalCheckWindow;
            if (angular.isFunction(newWindow.focus)) {
                newWindow.focus();
            }
            intervalCheckWindow = $interval(function () {
                if (newWindow === null || newWindow.closed) {
                    $interval.cancel(intervalCheckWindow);
                    intervalCheckWindow = null;
                    importFinish();
                }
            }, 1000);
            importStarted();
            $window.elyChildWindowUrl = function (newUrl) {
                if (angular.isString(newUrl)) {
                    var oAuthContacts = importResource.get({code: parser.parseUrl(newUrl)}, function () {
                        SourceImportModification.addSourceDescription(oAuthContacts.addresses, sourceDescription);
                        contacts.addresses = ArrayHelper.uniqueArray(contacts.addresses.concat(oAuthContacts.addresses), 'email');
                        importFinish(null, finishDescription);
                    }, function () {
                        importFinish();
                    });
                }
            };
            return {interval: intervalCheckWindow, window: newWindow};
        };
    }];
