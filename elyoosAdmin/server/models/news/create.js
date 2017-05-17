'use strict';

let db = requireDb();
let sendNews = require('./../eMailService/news');
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;

let create = function (params) {

    let newsId = uuid.generateUUID(), created = time.getNowUtcTimestamp();
    return db.cypher().create(`(news:News {newsId: {newsId}, title: {title}, text: {text}, created: {created}})`)
        .end({
            title: params.title, text: params.text,
            created: created, newsId: newsId
        }).send().then(function () {
            sendNews.sendNews(newsId);
            return {newsId: newsId, created: created};
        });
};


module.exports = {
    create: create
};
