'use strict';

const db = requireDb();

const getUsersCommand = function (commitmentId, userId) {
    return db.cypher()
        .match(`(:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(user:User)`)
        .where(`user.userId = {userId} OR user.privacyMode = 'public' OR 
               (user.privacyMode = 'publicEl' AND {isDumondaMeUser}) OR 
               EXISTS((user)-[:IS_CONTACT]->(:User {userId: {userId}}))`)
        .return(`user.userId AS userId, user.name AS name, user.userId = {userId} AS isLoggedInUser`)
        .orderBy(`name`)
        .end({commitmentId, userId, isDumondaMeUser: !!userId});
};

module.exports = {
    getUsersCommand
};
