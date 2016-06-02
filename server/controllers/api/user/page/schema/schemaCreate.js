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
            required: ['topic', 'title', 'description', 'author'],
            properties: {
                topic: {'$ref': '#/definitions/topic'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                author: {type: 'string', format: 'notEmptyString', maxLength: 100},
                publishDate: {type: 'integer'}
            }
        },
        youtubePage: {
            type: 'object',
            additionalProperties: false,
            required: ['topic', 'title', 'description', 'link'],
            properties: {
                topic: {'$ref': '#/definitions/topic'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                link: {'$ref': '#/definitions/link'}
            }
        },
        linkPage: {
            type: 'object',
            additionalProperties: false,
            required: ['topic', 'title', 'description', 'link'],
            properties: {
                topic: {'$ref': '#/definitions/topic'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                link: {'$ref': '#/definitions/link'}
            }
        }
    },
    definitions: definitions
};
