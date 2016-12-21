'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;

let create = function (userId, params) {
    let created = time.getNowUtcTimestamp();
    let feedbackId = uuid.generateUUID();
    return db.cypher().match("(user:User {userId: {userId}})")
        .create(`(:Feedback:Discussion {status:'open', feedbackId: {feedbackId}, created: {created}, 
                        title: {title}, description: {description}})<-[:IS_CREATOR]-(user)`)
        .return("user.name AS name, user.userId AS userId")
        .end({created: created, feedbackId: feedbackId, userId: userId, title: params.title, description: params.description})
        .send().then(function (resp) {
            return {created: created, feedbackId: feedbackId, creator: {name: resp[0].name, userId: resp[0].userId}};
        });
};


module.exports = {
    create: create
};
