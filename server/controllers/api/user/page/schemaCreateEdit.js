'use strict';

module.exports = {
    name: 'createEditPage',
    type: 'object',
    additionalProperties: false,
    properties: {
        bookPage: {
            type: 'object',
            additionalProperties: false,
            required: ['language', 'title', 'description', 'author'],
            properties: {
                language: {'$ref': '#/definitions/language'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                author: {type: 'string', format: 'notEmptyString', maxLength: 100},
                publishDate: {type: 'integer'}
            }
        },
        videoPage: {
            type: 'object',
            additionalProperties: false,
            required: ['language', 'title','description', 'link', 'subCategory'],
            properties: {
                language: {'$ref': '#/definitions/language'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                link: {'$ref': '#/definitions/link'},
                subCategory: {enum: ['Youtube']}
            }
        }
    },
    definitions: {
        id: {type: 'string', format: 'notEmptyString', maxLength: 30},
        language: {enum: ['de', 'en', 'fr', 'it', 'es']},
        title: {type: 'string', format: 'notEmptyString', maxLength: 255},
        description: {type: 'string', format: 'notEmptyString', maxLength: 10000},
        link: {type: 'string', format: 'url', maxLength: 1000}
    }
};
