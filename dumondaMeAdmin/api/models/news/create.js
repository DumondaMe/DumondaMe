'use strict';

const db = requireDb();
const sendNews = require('./../eMailService/news');
const time = require('dumonda-me-server-lib').time;
const uuid = require('dumonda-me-server-lib').uuid;

let create = async function (params) {

    let newsId = uuid.generateUUID(), created = time.getNowUtcTimestamp();
    await db.cypher().create(`(news:News {newsId: {newsId}, title: {title}, text: {text}, created: {created}})`)
        .end({title: params.title, text: params.text, created: created, newsId: newsId}).send();
    await sendNews.sendNews(newsId);
    return {newsId: newsId, created: created};
};


module.exports = {
    create
};
