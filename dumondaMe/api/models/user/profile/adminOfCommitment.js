'use strict';

const db = requireDb();

const PAGE_SIZE = 20;

let getAdminOfCommitmentsCommand = function (userDetailId, page) {
    page = page * PAGE_SIZE;
    return db.cypher()
        .match(`(:User {userId: {userDetailId}})-[:IS_ADMIN]->(c:Commitment)`)
        .return(`c.title AS title, c.commitmentId AS commitmentId, c.modified AS modified`)
        .end({userDetailId, page})
};


module.exports = {
    getAdminOfCommitmentsCommand
};
