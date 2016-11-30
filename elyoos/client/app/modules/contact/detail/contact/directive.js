'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                detail: '=',
                showDetail: '=',
                showClose: '=',
                events: '=',
                onDetailClosed: '&'
            },
            templateUrl: 'app/modules/contact/detail/contact/template.html'
        };
    }],
    name: 'elyUserDetailContactsPreview'
};
