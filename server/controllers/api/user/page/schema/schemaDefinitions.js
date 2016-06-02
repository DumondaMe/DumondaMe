'use strict';

var topic = require("../../../../schema/topic");

module.exports = {
    id: {type: 'string', format: 'notEmptyString', maxLength: 30},
    topic: topic.topicMultiple,
    title: {type: 'string', format: 'notEmptyString', maxLength: 160},
    description: {type: 'string', format: 'notEmptyString', maxLength: 3000},
    link: {type: 'string', format: 'url', maxLength: 1000}
};
