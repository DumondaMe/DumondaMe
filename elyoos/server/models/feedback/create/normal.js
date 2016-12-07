'use strict';

let db = requireDb();
let time = requireLib('time');
let uuid = requireLib('uuid');

let getFeedbackType = function (params) {
    if (params.group === 'Bug' || params.group === 'Idea') {
        return params.group;
    }
    throw `invalid feedback typ ${params.group}`;
};

let create = function (userId, params) {

    let feedbackId = uuid.generateUUID();
    return db.cypher().match("(user:User {userId: {userId}})")
        .create(`(user)-[:IS_CREATOR]->(feedback:Feedback:${getFeedbackType(params)} {feedbackId: {feedbackId}, title: {title}, 
                             description: {description}, created: {created}})`)
        .end({
            userId: userId, title: params.title, description: params.description,
            created: time.getNowUtcTimestamp(), feedbackId: feedbackId
        }).send().then(function () {
            return {feedbackId: feedbackId};
        });
};


module.exports = {
    create: create
};
