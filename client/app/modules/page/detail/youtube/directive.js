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
                pageDetail: '='
            },
            templateUrl: 'app/modules/page/detail/youtube/template.html'
        };
    }],
    name: 'elyPageDetailYoutube'
};
