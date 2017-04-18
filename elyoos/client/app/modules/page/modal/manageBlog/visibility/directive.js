'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: false,
            scope: {},
            bindToController: {
                onCloseVisibilityEvent: '&'
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/modal/manageBlog/visibility/template.html'
        };
    }],
    name: 'elyManageBlogVisibility'
};
