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
                finish: '='
            },
            templateUrl: 'app/modules/recommendation/addRecommendation/template.html'
        };
    }],
    name: 'elyAddRecommendation'
};
