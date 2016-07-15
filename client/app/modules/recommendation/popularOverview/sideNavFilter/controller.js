'use strict';

module.exports = ['Topics', 'Languages', 'RecommendationTypes', 'PopularPageRecommendationFilters', '$timeout',
    function (Topics, Languages, RecommendationTypes, PopularPageRecommendationFilters, $timeout) {
        var ctrl = this;

        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;
        ctrl.recommendationTypes = RecommendationTypes.recommendationTypes;

        ctrl.dataChanged = function () {
            $timeout(function () {
                PopularPageRecommendationFilters.filtersChanged(ctrl.filters);
            }, 300);
        };
    }];
