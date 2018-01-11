'use strict';

let db = requireDb();

let getKnownUser = function (id, data) {
    let commands = [];
    data.id = id;

    commands.push(db.cypher().match(`(:User {userId: {id}})-[:IS_CONTACT]->(contact:User)-[:IS_CONTACT]->(:User {userId: {userId}})`)
        .return("COUNT(*) AS totalNumberOfContacts").end(data).getCommand());

    return db.cypher().match(`(:User {userId: {id}})-[:IS_CONTACT]->(contact:User)-[:IS_CONTACT]->(:User {userId: {userId}})`)
        .return("contact.name AS name")
        .orderBy("name")
        .skip("{skip}")
        .limit("{maxItems}").end(data).send(commands).then(function (resp) {
            return {contacts: resp[1], totalNumberOfContacts: resp[0][0].totalNumberOfContacts};
        });
};


module.exports = {
    getKnownUser: getKnownUser
};
