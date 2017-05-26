"use strict";

let db = requireDb();
let email = require('elyoos-server-lib').eMail;
let domain = require('elyoos-server-lib').domain;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let getUsers = function (newsId) {
    let commands = [];
    commands.push(db.cypher().match(`(news:News {newsId: {newsId}})`)
        .set(`news`, {isSent: true}).end({newsId: newsId}).getCommand());
    return db.cypher().match(`(user:User)`).return(`user.email AS email, user.forename AS forename`)
        .end().send(commands).then(function (resp) {
            return resp[1];
        });
};

let processDefinition = function (data, done) {

    return db.cypher().match(`(news:News {newsId: {newsId}})`)
        .return(`news`).end({newsId: data.newsId}).send().then(function (resp) {

            if (resp.length === 1 && !resp[0].news.isSent) {
                let news = resp[0].news;
                return getUsers(data.newsId).then(function (users) {
                    users.forEach(function (user) {
                        email.sendEMail("sendNews", {
                            title: news.title,
                            text: news.text,
                            forename: user.forename,
                            unsubscribeLink: `${domain.getDomain()}unsubscribe/news/${user.email}`
                        }, user.email);
                    });
                });
            } else if (resp[0].news.isSent) {
                logger.error(`News already sent for newsId ${data.newsId}`);
            } else {
                logger.error(`News not sent. Incorrect number of news for newsId ${data.newsId}`);
            }
        }).finally(function () {
            done();
        });
};

module.exports = {
    processDefinition: processDefinition
};
