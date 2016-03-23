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
                cancel: '=',
                finish: '='
            },
            templateUrl: 'app/modules/page/modal/manageBookPage/overviewPages/template.html'
        };
    }],
    name: 'elyPageOverview'
};
