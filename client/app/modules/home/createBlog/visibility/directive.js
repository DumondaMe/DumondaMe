'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: false,
            scope: {},
            bindToController: {
                onCloseVisibilityEvent: '&'
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/createBlog/visibility/template.html'
        };
    }],
    name: 'elyCreateBlogVisibility'
};
