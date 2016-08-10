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
                pageDetail: '=',
                showInfo: '@'
            },
            templateUrl: 'app/modules/page/detail/info/template.html'
        };
    }],
    name: 'elyPageDetailInfo'
};
