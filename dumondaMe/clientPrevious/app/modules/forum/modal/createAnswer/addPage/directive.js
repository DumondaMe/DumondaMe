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
                cancel: '=',
                finish: '='
            },
            templateUrl: 'app/modules/forum/modal/createAnswer/addPage/template.html'
        };
    }],
    name: 'elyForumAddPage'
};