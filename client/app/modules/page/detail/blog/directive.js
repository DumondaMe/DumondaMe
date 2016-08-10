'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function () {
            },
            controllerAs: 'ctrl',
            bindToController: {
                blogDetail: '='
            },
            templateUrl: 'app/modules/page/detail/blog/template.html'
        };
    }],
    name: 'elyBlogDetail'
};
