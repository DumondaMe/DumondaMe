'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function () {
            },
            controllerAs: 'ctrl',
            bindToController: {},
            templateUrl: 'app/modules/recommendation/recommendationPreviewNoResult/template.html'
        };
    }],
    name: 'elyRecommendationPreviewNoResult'
};
