'use strict';

var link = require('./link.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'A',
            scope: {
                elyInfiniteScroll: '=',
                scrollPosition: '='
            },
            link: link.directiveLink()
        };
    }],
    name: 'elyInfiniteScroll'
};
