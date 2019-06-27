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
                elyOnClick: '=',
                icon: '@',
                label: '@',
                selectedLabel: '=',
                description: '@'
            },
            templateUrl: 'app/modules/navigation/createPage/stepSelectType/element/template.html'
        };
    }],
    name: 'elyNavCreatePageElement'
};
