'use strict';

var controller = require('./contactPreviewCtrl');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                enableSelect: '@',
                contact: '=',
                statistic: '=',
                privacySettings: '=',
                numberOfContacts: '='
            },
            templateUrl: 'app/modules/contact/contactPreview/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyContactPreview'
};
