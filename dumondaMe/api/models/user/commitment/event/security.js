'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;

const isAdmin = async function (userId, eventId) {
    let response = await db.cypher().match(`(event:Event {eventId: {eventId}})
                 <-[:EVENT]-(:Commitment)<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .return(`event`)
        .end({eventId, userId}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not admin of event ${eventId}`);
    }
};

module.exports = {
    isAdmin
};
