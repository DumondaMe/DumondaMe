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
                titleRecommendation: '=',
                pageId: '=',
                abortDisabled: '=',
                abort: '=',
                finish: '=',
                isBlog: '@'
            },
            templateUrl: 'app/modules/recommendation/addRecommendation/directive/template.html'
        };
    }],
    name: 'elyAddRecommendation'
};
