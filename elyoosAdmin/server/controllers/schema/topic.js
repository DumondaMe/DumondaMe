'use strict';

let topic = ['health',
    'environmental',
    'spiritual',
    'personalDevelopment',
    'socialDevelopment',
    'education',
    'politics',
    'economy'];

module.exports = {
    topic: {
        enum: topic
    },
    topicMultiple: {
        type: 'array',
        minItems: 1,
        items: {enum: topic},
        uniqueItems: true
    }
};
