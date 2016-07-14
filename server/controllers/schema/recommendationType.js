'use strict';

var type = ['Book', 'Youtube', 'Link', 'Blog'];

module.exports = {
    type: {
        enum: type
    },
    typeMultiple: {
        type: 'array',
        minItems: 1,
        items: {enum: type},
        uniqueItems: true
    }
};
