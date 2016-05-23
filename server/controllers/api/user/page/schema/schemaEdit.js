'use strict';

var definitions = require("./schemaDefinitions");

module.exports = {
    name: 'editPage',
    type: 'object',
    additionalProperties: false,
    properties: {
        bookPage: {
            type: 'object',
            additionalProperties: false,
            required: ['pageId', 'category', 'description', 'author'],
            properties: {
                pageId: {'$ref': '#/definitions/id'},
                category: {'$ref': '#/definitions/category'},
                description: {'$ref': '#/definitions/description'},
                author: {type: 'string', format: 'notEmptyString', maxLength: 100},
                publishDate: {type: 'integer'}
            }
        },
        youtubePage: {
            type: 'object',
            additionalProperties: false,
            required: ['pageId', 'category', 'description'],
            properties: {
                pageId: {'$ref': '#/definitions/id'},
                category: {'$ref': '#/definitions/category'},
                description: {'$ref': '#/definitions/description'}
            }
        },
        linkPage: {
            type: 'object',
            additionalProperties: false,
            required: ['pageId', 'category', 'description'],
            properties: {
                pageId: {'$ref': '#/definitions/id'},
                category: {'$ref': '#/definitions/category'},
                description: {'$ref': '#/definitions/description'}
            }
        }
    },
    definitions: definitions
};
