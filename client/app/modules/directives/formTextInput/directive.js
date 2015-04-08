'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: '@',
                inputName: '@',
                inputPlaceholder: '@',
                profileForm: '=',
                submitModel: '=',
                maxLength: '@',
                minLength: '@',
                required: '@',
                customErrorDescription: '@'
            },
            templateUrl: 'app/modules/directives/formTextInput/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyFormTextInput'
};
