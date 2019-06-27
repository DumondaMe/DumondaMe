'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                blogDetail: '='
            },
            templateUrl: 'app/modules/page/detail/blog/main/template.html'
        };
    }],
    name: 'elyBlogDetailMain'
};
