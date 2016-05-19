'use strict';

var definitions = require("./schemaDefinitions");

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
        },
        linkPage: {
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
    definitions: definitions
};
