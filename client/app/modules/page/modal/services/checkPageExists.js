'use strict';

module.exports = ['SearchPage', '$q', function (SearchPage, $q) {

    var previousSearch;

    this.reset = function () {
        previousSearch = null;
    };

    this.checkPageExists = function (search, filter) {
        var searchResult, deferred = $q.defer();
        if (angular.isString(search) && search.trim() !== '' && previousSearch !== search) {
            previousSearch = search;
            searchResult = SearchPage.get({search: search, filterType: filter, isSuggestion: false, skip: 0, maxItems: 10});
            return searchResult.$promise.then(function (result) {
                if (result.pages && result.pages.length > 0) {
                    return {searchResult: result, pageExists: true};
                }
                return {searchResult: null, pageExists: false};
            });
        }
        deferred.reject();
        return deferred.promise;
    };
}];
