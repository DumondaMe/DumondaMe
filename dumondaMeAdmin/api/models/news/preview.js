'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const sendNews = require('./../eMailService/news');

const preview = async function (userId, params, req) {

    let res = await db.cypher().match(`(user:User {userId: {userId}})`)
        .return(`user.email AS email, user.forename AS forename`)
        .end({userId: userId}).send();
    if (res.length === 1) {
        await sendNews.sendPreviewNews(res[0].email, res[0].forename, params.title, params.text);
    } else {
        return exceptions.getInvalidOperation(`User not found ${userId}`, logger, req);
    }
};


module.exports = {
    preview
};
