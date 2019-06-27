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
                statistic: '=',
                selectedStatistic: '=',
                showOnlyContact: '=',
                deactivateBlockContact: '=',
                scrollRequestName: '@'
            },
            templateUrl: 'app/modules/contact/contactPreview/template.html'
        };
    }],
    name: 'elyContactPreview'
};
