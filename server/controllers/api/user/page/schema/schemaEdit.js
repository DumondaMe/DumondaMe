'use strict';

var definitions = require("./schemaDefinitions");
var language = require("../../../../schema/language");

module.exports = {
    name: 'editPage',
    type: 'object',
    additionalProperties: false,
    properties: {
        bookPage: {
            type: 'object',
            additionalProperties: false,
            required: ['pageId', 'topic', 'description', 'author', 'language'],
            properties: {
                pageId: {'$ref': '#/definitions/id'},
                topic: {'$ref': '#/definitions/topic'},
                description: {'$ref': '#/definitions/description'},
                author: {type: 'string', format: 'notEmptyString', maxLength: 100},
                publishDate: {type: 'integer'},
                language: language.language
            }
        },
        youtubePage: {
            type: 'object',
            additionalProperties: false,
            required: ['pageId', 'topic', 'description', 'language'],
            properties: {
                pageId: {'$ref': '#/definitions/id'},
                topic: {'$ref': '#/definitions/topic'},
                description: {'$ref': '#/definitions/description'},
                language: language.languageMultiple
            }
        },
        linkPage: {
            type: 'object',
            additionalProperties: false,
            required: ['pageId', 'topic', 'description', 'language'],
            properties: {
                pageId: {'$ref': '#/definitions/id'},
                topic: {'$ref': '#/definitions/topic'},
                description: {'$ref': '#/definitions/description'},
                language: language.languageMultiple
            }
        }
    },
    definitions: definitions
};
