'use strict';

let db = requireDb();
let security = require('./security');
let time = require('elyoos-server-lib').time;

let edit = function (userId, params, req) {

    let modified = time.getNowUtcTimestamp();
    return security.checkAllowedToEdit(userId, params.feedbackId, "feedback:Bug", req).then(function () {
        return db.cypher().match("(feedback:Feedback {feedbackId: {feedbackId}})")
            .set("feedback", {
                title: params.title,
                description: params.description,
                screen: params.screen,
                browser: params.browser,
                operatingSystem: params.operatingSystem,
                modified: modified
            })
            .end({feedbackId: params.feedbackId}).send().then(function () {
                return {modified: modified};
            });
    });
};

module.exports = {
    edit: edit
};
