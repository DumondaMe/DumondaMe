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
                pageDetail: '='
            },
            templateUrl: 'app/modules/page/detail/place/template.html'
        };
    }],
    name: 'elyPageDetailPlace'
};
