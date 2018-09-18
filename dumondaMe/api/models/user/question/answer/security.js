'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;

const isAdmin = async function (userId, answerId) {

    let response = await db.cypher().match(`(answer:Answer {answerId: {answerId}})
                 <-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .return(`answer`)
        .end({answerId: answerId, userId: userId}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not admin of answer ${answerId}`);
    }
};

module.exports = {
    isAdmin
};
