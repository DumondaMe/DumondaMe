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
                importStarted: '=',
                importFinish: '=',
                contacts: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/importYahoo/template.html'
        };
    }],
    name: 'elyImportYahoo'
};
