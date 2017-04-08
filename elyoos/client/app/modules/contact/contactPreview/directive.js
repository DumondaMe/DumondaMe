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
                statistics: '=',
                statistic: '='
            },
            templateUrl: 'app/modules/contact/contactPreview/template.html'
        };
    }],
    name: 'elyContactPreview'
};
