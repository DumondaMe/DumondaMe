'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                numberOfRecommendations: '=',
                pageId: '='
            },
            templateUrl: 'app/modules/page/detail/similarPage/recommendation/template.html'
        };
    }],
    name: 'elyPageDetailSimilarPageRecommendation'
};
