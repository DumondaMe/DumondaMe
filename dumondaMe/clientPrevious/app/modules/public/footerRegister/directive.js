'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/public/footerRegister/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js')
        };
    }],
    name: 'elyPublicFooterRegister'
};
