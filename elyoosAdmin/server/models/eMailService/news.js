"use strict";

let eMailQueue = require('elyoos-server-lib').eMailQueue;

let sendNews = function (newsId) {
    eMailQueue.createImmediatelyJob('sendNews', {newsId: newsId});
};

module.exports = {
    sendNews: sendNews
};
