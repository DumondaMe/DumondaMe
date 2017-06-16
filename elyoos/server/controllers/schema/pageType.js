'use strict';

let type = ['Book', 'Youtube', 'Link', 'Blog', 'Generic'];

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
