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
                title: '=',
                pageId: '=',
                abortDisabled: '=',
                abort: '=',
                finish: '='
            },
            templateUrl: 'app/modules/recommendation/addRecommendation/directive/template.html'
        };
    }],
    name: 'elyAddRecommendation'
};
