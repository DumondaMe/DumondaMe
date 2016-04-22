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
                page: '='
            },
            templateUrl: 'app/modules/page/modal/overviewExistingPages/youtube/template.html'
        };
    }],
    name: 'elyExistingPageOverviewYoutube'
};
