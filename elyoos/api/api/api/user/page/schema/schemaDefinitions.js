'use strict';

let topic = require("../../../../schema/topic");

module.exports = {
    id: {type: 'string', format: 'notEmptyString', maxLength: 30},
    topic: topic.topicMultiple,
    title: {type: 'string', format: 'notEmptyString', maxLength: 160},
    description: {type: 'string', format: 'notEmptyString', maxLength: 3000},
    youtubeLink: {type: 'string', format: 'youtubeLink', maxLength: 1000},
    link: {type: 'string', format: 'notEmptyString', maxLength: 1000},
    keywords: {
        type: 'array',
        items: {type: 'string', format: 'notEmptyString', maxLength: 50},
        minItems: 1,
        maxItems: 30,
        uniqueItems: true
    }
};
