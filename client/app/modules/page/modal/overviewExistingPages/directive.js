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
                pages: '=',
                cancel: '=',
                finish: '='
            },
            templateUrl: 'app/modules/page/modal/overviewExistingPages/template.html'
        };
    }],
    name: 'elyExistingPageOverviewDialog'
};
