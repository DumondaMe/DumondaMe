'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/public/register/successfulRegisterRequest/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js'),
            bindToController: {
                email: '='
            }
            
        };
    }],
    name: 'elySuccessfulRegisterRequest'
};
