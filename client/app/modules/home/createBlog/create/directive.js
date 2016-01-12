'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                onOpenVisibilityEvent: '&',
                commands: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/createBlog/create/template.html'
        };
    }],
    name: 'elyCreateBlog'
};
