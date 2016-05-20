'use strict';

module.exports = {
    category: {
        type: 'array',
        minItems: 1,
        items: {enum: ['health', 'environmental', 'spiritual', 'personalDevelopment', 'socialDevelopment', 'education', 'politics', 'economy']},
        uniqueItems: true
    }
};
