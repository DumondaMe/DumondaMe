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
                page: '='
            },
            templateUrl: 'app/modules/page/detail/similarPage/youtube/template.html'
        };
    }],
    name: 'elyPageDetailSimilarPageYoutube'
};
