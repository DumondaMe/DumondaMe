'use strict';

var link = require('./link.js');

module.exports = {
    directive: [ function () {
        return {
            scope: {elyInfiniteScroll: '&'},
            link: link.directiveLink()
        };
    }],
    name: 'elyInfiniteScroll'
};
