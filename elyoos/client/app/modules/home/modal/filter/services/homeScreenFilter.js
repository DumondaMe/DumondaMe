'use strict';

var createFilterParams = function (filters, Topics, Languages, RecommendationTypes) {
    var params = {};
    if (filters.hasOwnProperty('onlyContact')) {
        params.onlyContact = filters.onlyContact;
    } else {
        params.onlyContact = false;
    }
    if (filters.hasOwnProperty('selectedTopics')) {
        params.topic = Topics.getCodes(filters.selectedTopics);
    }
    if (filters.hasOwnProperty('selectedLanguages')) {
        params.language = Languages.getCodes(filters.selectedLanguages);
    }
    if (filters.hasOwnProperty('selectedRecommendationTypes')) {
        params.pageType = RecommendationTypes.getCodes(filters.selectedRecommendationTypes);
    }
    return params;
};

module.exports = ['Topics', 'Languages', 'RecommendationTypes', 'WebStorageFilter',
    function (Topics, Languages, RecommendationTypes, WebStorageFilter) {
        var service = this, filters, observers = {};

        service.register = function (id, observer) {
            observers[id] = observer;
        };

        filters = WebStorageFilter.getFilter();

        service.getFilterParams = function () {
            return createFilterParams(filters, Topics, Languages, RecommendationTypes);
        };

        service.getFilters = function () {
            return angular.copy(filters);
        };

        service.filtersChanged = function (newFilters) {
            if (!angular.equals(filters, newFilters)) {
                angular.copy(newFilters, filters);
                WebStorageFilter.setFilter(newFilters);
                for (var property in observers) {
                    if (observers.hasOwnProperty(property)) {
                        observers[property].filterChanged(createFilterParams(filters, Topics, Languages, RecommendationTypes));
                    }
                }
            }
        };
    }]
;
