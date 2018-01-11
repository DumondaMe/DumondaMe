'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;

let create = function (userId, params) {

    let feedbackId = uuid.generateUUID(), created = time.getNowUtcTimestamp();
    return db.cypher().match("(user:User {userId: {userId}})")
        .create(`(user)-[:IS_CREATOR]->(feedback:Feedback:Bug {feedbackId: {feedbackId}, title: {title}, status: 'open', screen: {screen},
                             browser: {browser}, operatingSystem: {operatingSystem}, description: {description}, created: {created}})`)
        .return("user")
        .end({
            userId: userId, title: params.title, description: params.description, screen: params.screen , browser: params.browser,
            operatingSystem: params.operatingSystem, created: created, feedbackId: feedbackId
        }).send().then(function (resp) {
            return {feedbackId: feedbackId, created: created, creator: {name: resp[0].user.name}};
        });
};


module.exports = {
    create: create
};
