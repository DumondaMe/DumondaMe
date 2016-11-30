'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                page: '='
            },
            templateUrl: 'app/modules/home/searchResult/page/youtube/template.html'
        };
    }],
    name: 'elyHomeSearchResultYoutubePage'
};
