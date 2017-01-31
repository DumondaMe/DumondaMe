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
                onBack: '&',
                onSelected: '='
            },
            templateUrl: 'app/modules/page/modal/managePlace/directive/template.html'
        };
    }],
    name: 'elyManagePlace'
};
