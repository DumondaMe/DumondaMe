'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./../controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                recommendation: '=',
                lastRecommendation: '='
            },
            templateUrl: 'app/modules/recommendation/recommendationPreview/mobile/template.html'
        };
    }],
    name: 'elyRecommendationPreviewMobile'
};
