'use strict';

var getFilterParams = function (filters, Topics, Languages, RecommendationTypes) {
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
        params.recommendationType = RecommendationTypes.getCodes(filters.selectedRecommendationTypes);
    }
    return params;
};

module.exports = ['Topics', 'Languages', 'RecommendationTypes',
    function (Topics, Languages, RecommendationTypes) {
        var service = this, filters = {onlyContact: false}, column = {};

        service.registerColumn = function (id, newColumn) {
            column[id] = newColumn
        };

        service.getFilters = function () {
            return getFilterParams(filters, Topics, Languages, RecommendationTypes);
        };

        service.filtersChanged = function (newFilters) {
            if (!angular.equals(filters, newFilters)) {
                angular.copy(newFilters, filters);
                for (var property in column) {
                    if (column.hasOwnProperty(property)) {
                        column[property].filterChanged(getFilterParams(filters, Topics, Languages, RecommendationTypes));
                    }
                }
            }
        }
    }]
;
