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
            bindToController: {
                page: '=',
                hasSelect: '='
            },
            templateUrl: 'app/modules/page/modal/overviewExistingPages/overview/youtube/template.html'
        };
    }],
    name: 'elyExistingPageOverviewYoutube'
};
