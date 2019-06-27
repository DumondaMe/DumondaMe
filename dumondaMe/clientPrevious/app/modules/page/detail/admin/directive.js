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
                pageDetail: '=',
                editPage: '=',
                deletePage: '='
            },
            templateUrl: 'app/modules/page/detail/admin/template.html'
        };
    }],
    name: 'elyPageDetailAdmin'
};
