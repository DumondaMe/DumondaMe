'use strict';

module.exports = {
    name: 'createPage',
    type: 'object',
    additionalProperties: false,
    properties: {
        bookPage: {
            type: 'object',
            additionalProperties: false,
            required: ['category', 'title', 'description', 'author'],
            properties: {
                category: {'$ref': '#/definitions/category'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                author: {type: 'string', format: 'notEmptyString', maxLength: 100},
                publishDate: {type: 'integer'}
            }
        },
        youtubePage: {
            type: 'object',
            additionalProperties: false,
            required: ['category', 'title', 'description', 'link'],
            properties: {
                category: {'$ref': '#/definitions/category'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                link: {'$ref': '#/definitions/link'}
            }
        }
    },
    definitions: {
        id: {type: 'string', format: 'notEmptyString', maxLength: 30},
        category: {
            type: 'array',
            minItems: 1,
            items: {enum: ['health', 'environmental', 'spiritual', 'personalDevelopment', 'socialDevelopment', 'education']},
            uniqueItems: true
        },
        title: {type: 'string', format: 'notEmptyString', maxLength: 255},
        description: {type: 'string', format: 'notEmptyString', maxLength: 10000},
        link: {type: 'string', format: 'url', maxLength: 1000}
    }
};
