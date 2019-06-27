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
                onSelected: '=',
                isEditMode: '=',
                actualDescription: '=',
                actualAddress: '='
            },
            templateUrl: 'app/modules/page/modal/manageAddress/directive/template.html'
        };
    }],
    name: 'elyManageAddress'
};
