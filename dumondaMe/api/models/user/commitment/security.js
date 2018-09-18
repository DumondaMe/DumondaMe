'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;

const isAdmin = async function (userId, commitmentId) {
    let response = await db.cypher().match(`(commitment:Commitment {commitmentId: {commitmentId}})
                 <-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .return(`commitment`)
        .end({commitmentId, userId}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not admin of commitment ${commitmentId}`);
    }
};

module.exports = {
    isAdmin
};
