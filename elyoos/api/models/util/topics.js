'use strict';

const normalizeTopics = function (topics) {
    for (let i = 0; i < topics.length; i++) {
        topics[i] = topics[i].toLowerCase();
        topics[i] = topics[i].replace(/\b\w/g, l => l.toUpperCase());
    }
};

module.exports = {
    normalizeTopics
};
