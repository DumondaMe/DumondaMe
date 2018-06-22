"use strict";

let eMailQueue = require('elyoos-server-lib').eMailQueue;

let sendNews = function (newsId) {
    eMailQueue.createImmediatelyJob('sendNews', {newsId: newsId});
};

let sendPreviewNews = function (email, forename, title, text) {
    eMailQueue.createImmediatelyJob('sendPreviewNews', {email: email, forename: forename, title: title, text: text});
};


module.exports = {
    sendNews: sendNews,
    sendPreviewNews: sendPreviewNews
};
