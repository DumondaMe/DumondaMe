'use strict';

const db = requireDb();

const getOverviewCommand = function (params) {
    return  db.cypher().match(`(news:News)`)
        .return(`news.title AS title, news.text AS text, news.newsId AS newsId, news.created AS created, 
        news.modified AS modified`)
        .orderBy(`news.created DESC`).skip(`{skip}`).limit(`{limit}`)
        .end({skip: params.skip, limit: params.maxItems});
};

const getOverview = async function (params) {
    let resp = await getOverviewCommand(params).send();
    return {news: resp};
};


module.exports = {
    getOverview,
    getOverviewCommand
};
