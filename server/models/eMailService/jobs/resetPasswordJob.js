"use strict";

var db = require('./../../../neo4j');
var email = require('./../../../lib/eMail/eMail');

var processDefinition = function (data, done) {

    return db.cypher().match("(user:User {email: {email}})")
        .return("user").end({email: data.email}).send()
        .then(function (resp) {
            if (resp.length === 1 && resp[0].user.hasOwnProperty('resetPasswordLinkId')) {
                email.sendEMail("resetPassword", {link: `https://www.elyoos/password/reset/${resp[0].user.resetPasswordLinkId}`},
                    data.email);
            }
            return done();
        });
};

module.exports = {
    processDefinition: processDefinition
};
