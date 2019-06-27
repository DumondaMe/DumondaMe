'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./../controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                detail: '=',
                numberOfGroups: '='
            },
            templateUrl: 'app/modules/contact/detail/profile/card/template.html'
        };
    }],
    name: 'elyUserDetailProfileCard'
};
