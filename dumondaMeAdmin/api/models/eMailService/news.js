"use strict";

const db = requireDb();
const email = require('dumonda-me-server-lib').eMail;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const getUsers = async function (newsId) {
    let commands = [];
    commands.push(db.cypher().match(`(news:News {newsId: {newsId}})`)
        .set(`news`, {isSent: true}).end({newsId: newsId}).getCommand());
    let resp = await db.cypher().match(`(user:User)`).return(`user.email AS email, user.forename AS forename`)
        .end().send(commands);
    return resp[1];
};

let sendNews = async function (newsId) {
    let resp = await db.cypher().match(`(news:News {newsId: {newsId}})`)
        .return(`news`).end({newsId: newsId}).send();

    if (resp.length === 1 && !resp[0].news.isSent) {
        let news = resp[0].news;
        let users = await getUsers(newsId);
        for (let user of users) {
            await email.sendEMail("sendNews", {
                title: news.title,
                text: news.text,
                forename: user.forename,
                unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/news/${user.email}`
            }, 'de', user.email);
        }
        return users;
    } else if (resp[0].news.isSent) {
        logger.error(`News already sent for newsId ${newsId}`);
    } else {
        logger.error(`News not sent. Incorrect number of news for newsId ${newsId}`);
    }
};

let sendPreviewNews = async function (emailAddress, forename, title, text) {
    await email.sendEMail("sendNews", {
        title: title,
        text: text,
        forename: forename,
        unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/news/${emailAddress}`
    }, 'de', emailAddress);
};


module.exports = {
    sendNews,
    sendPreviewNews
};
