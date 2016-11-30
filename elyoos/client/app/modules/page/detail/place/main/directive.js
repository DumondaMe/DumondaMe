'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                pageDetail: '='
            },
            templateUrl: 'app/modules/page/detail/place/main/template.html'
        };
    }],
    name: 'elyPageDetailMainPlace'
};
