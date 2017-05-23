'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;

let edit = function (params) {

    let modified = time.getNowUtcTimestamp();
    return db.cypher().match(`(news:News {newsId: {newsId}})`)
        .set(`news`, {title: params.title, text: params.text, modified: modified})
        .end({ newsId: params.newsId}).send().then(function () {
            return {modified: modified};
        });
};


module.exports = {
    edit: edit
};
