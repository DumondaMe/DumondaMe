'use strict';

module.exports = {
    topics: {
        type: 'array',
        items: {type: 'string', format: 'notEmptyString', maxLength: 60},
        minItems: 1,
        maxItems: 15,
        uniqueItems: true
    }
};
