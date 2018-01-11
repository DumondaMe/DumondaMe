"use strict";

let db = requireDb();
let eMailQueue = require('elyoos-server-lib').eMailQueue;

let sendRegisterUserVerification = function (email, linkId) {
    return db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})").return("user").end({linkId: linkId}).send()
        .then(function (resp) {
            if (resp.length === 1) {
                eMailQueue.createImmediatelyJob('registerUserRequest', {email: email, linkId: linkId});
            }
        });
};

module.exports = {
    sendRegisterUserVerification: sendRegisterUserVerification
};
