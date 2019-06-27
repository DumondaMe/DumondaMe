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
                pageId: '='
            },
            templateUrl: 'app/modules/page/detail/similarPage/template.html'
        };
    }],
    name: 'elyPageDetailSimilarPage'
};
