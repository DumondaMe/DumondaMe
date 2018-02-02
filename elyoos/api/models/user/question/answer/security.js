'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;

const isAdmin = async function (userId, textId) {

    let response = await db.cypher().match(`(answer:Text {textId: {textId}})
                 <-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .return(`answer`)
        .end({textId: textId, userId: userId}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not admin of answer ${textId}`);
    }
};

module.exports = {
    isAdmin
};
