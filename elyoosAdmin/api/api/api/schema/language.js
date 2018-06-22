'use strict';

let language = ['de', //German
        'en', //English
        'fr', //French
        'it', //Italian
        'es']; //Spanish

module.exports = {
    language: {
        enum: language
    },
    languageMultiple: {
        type: 'array',
        minItems: 1,
        items: {enum: language},
        uniqueItems: true
    }
};
