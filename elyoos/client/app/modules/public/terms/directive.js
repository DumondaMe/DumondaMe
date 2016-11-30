'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/public/terms/template.html',
            controllerAs: 'ctrl',
            controller: function () {}
        };
    }],
    name: 'elyTerms'
};
