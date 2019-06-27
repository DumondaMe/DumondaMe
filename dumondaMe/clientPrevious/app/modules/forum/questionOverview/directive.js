'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {commands: '='},
            templateUrl: 'app/modules/forum/questionOverview/template.html'
        };
    }],
    name: 'elyForumQuestionOverview'
};
