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
                pages: '=',
                hasSelect: '=',
                selectChanged: '='
            },
            templateUrl: 'app/modules/page/modal/overviewExistingPages/overview/template.html'
        };
    }],
    name: 'elyExistingPageOverview'
};
