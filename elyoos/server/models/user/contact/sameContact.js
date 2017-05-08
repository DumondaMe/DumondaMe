'use strict';

let db = requireDb();

let getSameContact = function (id, data) {

    data.id = id;
    return db.cypher().match(`(:User {userId: {id}})-[:IS_CONTACT]->(user:User)<-[:IS_CONTACT]-(:User {userId: {userId}})`)
        .return("user.name AS name")
        .orderBy("name")
        .skip("{skip}")
        .limit("{maxItems}").end(data).send().then(function (resp) {
            return {users: resp};
        });
};


module.exports = {
    getSameContact: getSameContact
};
