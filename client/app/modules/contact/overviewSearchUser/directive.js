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
                users: '='
            },
            templateUrl: 'app/modules/contact/overviewSearchUser/template.html'
        };
    }],
    name: 'elyContactSearchUserOverview'
};
