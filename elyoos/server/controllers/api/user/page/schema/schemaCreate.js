'use strict';

let definitions = require("./schemaDefinitions");
let language = require("../../../../schema/language");

module.exports = {
    name: 'createPage',
    type: 'object',
    additionalProperties: false,
    properties: {
        bookPage: {
            type: 'object',
            additionalProperties: false,
            required: ['topic', 'title', 'description', 'author', 'language'],
            properties: {
                topic: {'$ref': '#/definitions/topic'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                author: {type: 'string', format: 'notEmptyString', maxLength: 255},
                publishDate: {type: 'integer'},
                language: language.language
            }
        },
        youtubePage: {
            type: 'object',
            additionalProperties: false,
            required: ['topic', 'title', 'description', 'link', 'language'],
            properties: {
                topic: {'$ref': '#/definitions/topic'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                link: {'$ref': '#/definitions/youtubeLink'},
                language: language.languageMultiple
            }
        },
        linkPage: {
            type: 'object',
            additionalProperties: false,
            required: ['topic', 'title', 'description', 'link', 'language'],
            properties: {
                topic: {'$ref': '#/definitions/topic'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                link: {'$ref': '#/definitions/link'},
                language: language.languageMultiple
            }
        },
        genericPage: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'topic', 'description', 'language'],
            properties: {
                topic: {'$ref': '#/definitions/topic'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                language: language.languageMultiple,
                website: {'$ref': '#/definitions/link'}
            }
        }
    },
    definitions: definitions
};
