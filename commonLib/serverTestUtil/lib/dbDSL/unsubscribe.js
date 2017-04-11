'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');


let unsubscribeInvitation = function (email) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .create(`(:UnsubscribeInvitation {email: {email}})`)
        .end({email: email}).getCommand());
};

module.exports = {
    unsubscribeInvitation: unsubscribeInvitation
};