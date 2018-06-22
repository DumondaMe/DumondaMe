'use strict';

const db = requireDb();
const time = require('elyoos-server-lib').time;

const edit = async function (params) {
    let modified = time.getNowUtcTimestamp();
    await db.cypher().match(`(news:News {newsId: {newsId}})`)
        .set(`news`, {title: params.title, text: params.text, modified: modified})
        .end({newsId: params.newsId}).send();
    return {modified: modified};
};

module.exports = {
    edit
};
