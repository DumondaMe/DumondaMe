"use strict";

let db = requireDb();
let email = require('elyoos-server-lib').eMail;
let unreadMessages = require('./../../messages/util/unreadMessages');

let processDefinition = function (data, done) {
    let commands = [];
    commands.push(unreadMessages.getTotalNumberOfUnreadMessages(data.userId).getCommand());

    return db.cypher().match("(user:User {userId: {userId}}), (email:EMailNotification {userId: {userId}})")
        .return("user, email").end({userId: data.userId}).send(commands)
        .then(function (resp) {
            if (resp[1].length === 1 && resp[1][0].hasOwnProperty('email') && resp[1][0].email.lastJobId === data.jobId) {
                if (resp[0][0].totalUnreadMessages > 0) {
                    email.sendEMail("newMessages", {numberOfUnreadMessages: resp[0][0].totalUnreadMessages, forename: resp[1][0].user.forename}, 
                        resp[1][0].user.email);
                }
                return db.cypher().match("(email:EMailNotification {userId: {userId}})").delete("email")
                    .end({userId: data.userId}).send().then(function () {
                        done();
                    });
            }
            return done();
        });
};

module.exports = {
    processDefinition: processDefinition
};
