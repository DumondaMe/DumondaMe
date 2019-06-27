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
            templateUrl: 'app/modules/page/modal/overviewExistingPages/overview/book/template.html'
        };
    }],
    name: 'elyExistingPageOverviewBook'
};
