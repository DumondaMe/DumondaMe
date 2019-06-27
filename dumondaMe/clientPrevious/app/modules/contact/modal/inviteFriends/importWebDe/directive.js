'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function () {},
            controllerAs: 'ctrl',
            bindToController: {
                openBasicAuth: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/importWebDe/template.html'
        };
    }],
    name: 'elyImportWebDe'
};
