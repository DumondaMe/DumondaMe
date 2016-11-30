'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                recommendation: '=',
                pageId: '=',
                titleRecommendation: '=',
                pageTypeDescription: '@',
                category: '@'
            },
            templateUrl: 'app/modules/page/detail/recommendation/template.html'
        };
    }],
    name: 'elyPageDetailRecommendation'
};
