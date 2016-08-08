"use strict";

var db = require('./../../neo4j');
var eMailQueue = require('./../../lib/eMail/eMailQueue');

var sendRegisterUserVerification = function (email, linkId) {
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
