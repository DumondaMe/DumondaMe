'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let edit = function (userId, params, req) {
    let modified = time.getNowUtcTimestamp();
    return db.cypher().match("(discussion:Feedback:Discussion {feedbackId: {discussionId}})<-[:IS_CREATOR]-(:User {userId: {userId}})")
        .set("discussion", {title: params.title, description: params.description, modified: modified})
        .return("discussion")
        .end({userId: userId, discussionId: params.discussionId})
        .send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`Discussion does not exist for discussionId ${params.discussionId}`, logger, req);
            }
            return {modified: modified};
        });
};


module.exports = {
    edit: edit
};
