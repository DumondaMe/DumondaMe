'use strict';

let db = requireDb();

let getOverview = function (params) {

    return db.cypher().match(`(news:News)`)
        .return(`news.title AS title, news.text AS text, news.newsId AS newsId, news.created AS created, 
        news.modified AS modified`)
        .orderBy(`news.created DESC`).skip(`{skip}`).limit(`{limit}`).end({
            skip: params.skip, limit: params.maxItems
        }).send().then(function (resp) {
            return {news: resp};
        });
};


module.exports = {
    getOverview: getOverview
};
