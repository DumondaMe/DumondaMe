"use strict";

let db = requireDb();
let email = require('elyoos-server-lib').eMail;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let processDefinition = function (data, done) {

    return db.cypher().match("(user:UserRegisterRequest {email: {email}})")
        .return("user").end({email: data.email}).send()
        .then(function (resp) {
            if (resp.length === 1 && resp[0].user.hasOwnProperty('linkId')) {
                email.sendEMail("registerUserRequest", {link: `https://www.elyoos.com/register/verify/${resp[0].user.linkId}`},
                    data.email);
            } else {
                logger.error("User register request failed");
            }
            return done();
        });
};

module.exports = {
    processDefinition: processDefinition
};
