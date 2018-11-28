'use strict';

let db = require('./neo4j');
let logger = require('./logging').getLogger(__filename);

let searchUserWithEmail = async function (email) {
    let resp = await db.cypher().match('(u:User {emailNormalized: {email}})')
        .optionalMatch(`(u)-[:INTERESTED]->(topic:Topic)`)
        .optionalMatch(`(u)-[:INTERESTED]->(region:Region)`)
        .return(`u.password AS password, u.emailNormalized AS email, u.userId AS id, u.dumondaMeAdmin AS dumondaMeAdmin,
                 u.language AS lang, u.languages AS languages, u.infoState AS infoState,
                 ANY (label IN labels(u) WHERE label = 'SuperUser') AS superUser,
                 collect(DISTINCT topic.topicId) AS topics, 
                 collect(DISTINCT region.regionId) AS regions`)
        .end({email: email}).send();
    if (resp.length === 1) {
        return resp[0];
    }
    if (resp.length > 1) {
        logger.error('More then one user with email address ' + email);
    }
};

let UserLibrary = function () {
    return {
        serialize: function (user, done) {
            done(null, {
                id: user.id, dumondaMeAdmin: user.dumondaMeAdmin, superUser: user.superUser, lang: user.language,
                languages: user.languages, email: user.email, infoState: user.infoState, topics: user.topics,
                regions: user.regions,
            });
        },
        deserialize: function (sessionUser, done) {
            done(null, sessionUser);
        },
        searchUserWithEmail
    };
};

module.exports = UserLibrary;
