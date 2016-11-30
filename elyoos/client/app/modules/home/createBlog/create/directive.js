'use strict';

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
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/createBlog/create/template.html'
        };
    }],
    name: 'elyCreateBlog'
};
