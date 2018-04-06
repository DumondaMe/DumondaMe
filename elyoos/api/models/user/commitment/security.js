'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;

const isAdmin = async function (userId, answerId) {
    let response = await db.cypher().match(`(commitment:Commitment {answerId: {answerId}})
                 <-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .return(`commitment`)
        .end({answerId: answerId, userId: userId}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not admin of commitment ${answerId}`);
    }
};

module.exports = {
    isAdmin
};
