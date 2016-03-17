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
                title: '='
            },
            templateUrl: 'app/modules/page/detail/recommendation/template.html'
        };
    }],
    name: 'elyPageDetailRecommendation'
};
