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
                showWithoutLabel: '@',
                profileForm: '=',
                submitModel: '=',
                maxLength: '@',
                minLength: '@',
                elyRequired: '@',
                customErrorDescription: '@'
            },
            templateUrl: 'app/modules/common/formTextInput/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyFormTextInput'
};
