"use strict";

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var email = require('./../../lib/eMail/eMail');
var unreadMessages = require('./../messages/util/unreadMessages');

var emailReceived = function (data, done) {
    var commands = [];
    commands.push(unreadMessages.getTotalNumberOfUnreadMessages(data.userId).getCommand());

    return db.cypher().match("(user:User {userId: {userId}}), (email:EMailNotification {userId: {userId}})")
        .return("user, email").end({userId: data.userId}).send(commands)
        .then(function (resp) {
            if (resp[1].length === 1 && resp[1][0].hasOwnProperty('email') && resp[1][0].email.lastJobId === data.jobId) {
                email.sendEMail("newMessages", {numberOfUnreadMessages: resp[0][0].totalUnreadMessages}, resp[1][0].user.email);
                return db.cypher().match("(email:EMailNotification {userId: {userId}})").delete("email")
                    .end({userId: data.userId}).send().then(function () {
                        done();
                    });
            }
            return done();
        });
};

module.exports = {
    emailReceived: emailReceived
};
