'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./../contact/controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                detail: '=',
                showDetail: '=',
                showClose: '=',
                events: '=',
                onDetailClosed: '&'
            },
            templateUrl: 'app/modules/contact/detail/contacting/template.html'
        };
    }],
    name: 'elyUserDetailContactingPreview'
};
