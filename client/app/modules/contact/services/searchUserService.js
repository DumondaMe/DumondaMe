'use strict';

module.exports = ['SearchUsers', function (SearchUsers) {

    var observable;

    this.register = function (newObservable) {
        observable = newObservable;
    };

    this.querySuggestion = function (text) {
        if (text && text.trim().length > 0) {
            return SearchUsers.query({
                search: text,
                maxItems: 7,
                isSuggestion: true
            }).$promise;
        }
    };

    this.startUserSearchRequest = function (query) {
        if (query && query.trim().length > 0) {
            observable.requestStarted();
            SearchUsers.query({
                search: query,
                maxItems: 40,
                isSuggestion: false
            }, function (resp) {
                observable.requestFinished(resp);
            }, function () {
                observable.requestFinished();
            });
        }
    };

    this.abortSearch = function () {
        observable.abortSearch();
    };
}];
