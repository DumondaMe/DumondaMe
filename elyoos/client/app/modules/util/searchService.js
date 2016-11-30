'use strict';

module.exports = [function () {

    var observable, serviceSuggestion, serviceSearch;

    this.register = function (newObservable, newServiceSuggestion, newServiceSearch) {
        observable = newObservable;
        serviceSuggestion = newServiceSuggestion;
        serviceSearch = newServiceSearch;
    };

    this.querySuggestion = function (text) {
        if (text && text.trim().length > 0) {
            return serviceSuggestion({
                search: text,
                maxItems: 7,
                isSuggestion: true
            }).$promise;
        }
    };

    this.startSearchRequest = function (query) {
        if (query && query.trim().length > 0) {
            observable.requestStarted();
            serviceSearch({
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
