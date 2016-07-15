'use strict';

module.exports = ['Topics', 'Languages', 'RecommendationTypes', 'PopularPageRecommendationFilters', '$timeout',
    function (Topics, Languages, RecommendationTypes, PopularPageRecommendationFilters, $timeout) {
        var ctrl = this;

        ctrl.filters = PopularPageRecommendationFilters.getFilters();

        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;
        ctrl.recommendationTypes = RecommendationTypes.recommendationTypes;

        ctrl.dataChanged = function () {
            $timeout(function () {
                PopularPageRecommendationFilters.filtersChanged(ctrl.filters);
            }, 300);
        };

        ctrl.resetFilters = function () {
            ctrl.filters = {onlyContact: false};
            $timeout(function () {
                PopularPageRecommendationFilters.filtersChanged(ctrl.filters);
            }, 300);
        };
    }];
