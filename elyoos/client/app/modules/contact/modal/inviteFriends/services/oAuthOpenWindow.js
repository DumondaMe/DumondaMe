'use strict';

module.exports = ['$window', '$interval', 'SourceImportModification', function ($window, $interval, SourceImportModification) {

    this.open = function (oAuthUrl, importFinish, importStarted, contacts, importResource, parser, finishDescription, sourceDescription) {
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
                var outlookContacts = importResource.get({code: parser.parseUrl(newUrl)}, function () {
                    SourceImportModification.addSourceDescription(outlookContacts.addresses, sourceDescription);
                    contacts.addresses = contacts.addresses.concat(outlookContacts.addresses);
                    importFinish(null, finishDescription);
                }, function () {
                    importFinish();
                });
            }
        };
        return intervalCheckWindow;
    };
}];
