'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let sendNews = require('./../eMailService/news');

let preview = function (userId, params, req) {

    return db.cypher().match(`(user:User {userId: {userId}})`)
        .return(`user.email AS email, user.forename AS forename`)
        .end({userId: userId}).send().then(function (res) {
            if(res.length === 1) {
                sendNews.sendPreviewNews(res[0].email, res[0].forename, params.title, params.text);
            } else {
                return exceptions.getInvalidOperation(`User not found ${userId}`, logger, req);
            }
        });
};


module.exports = {
    preview: preview
};
