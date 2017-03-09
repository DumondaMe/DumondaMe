'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;

const ONE_DAY = 86400;

let getContacting = function (userId) {
    let minTimeShown = time.getNowUtcTimestamp() - ONE_DAY;
    return db.cypher().match(`(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)
                               -[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)`)
        .where(`(relContacting.contactAdded >= user.previousLastLogin OR relContacting.contactAdded >= {minTimeShown}) AND 
               ((relContacting IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (relContacting.type = vr.type AND type(vr) = 'HAS_PRIVACY'))`)
        .return(`contacting.userId AS userId, contacting.name AS name, relContacting.contactAdded AS contactAdded,
                 EXISTS((user)-[:IS_CONTACT]->(contacting)) AS contactOfUser, v.profile AS profileVisible, v.image AS imageVisible`)
        .orderBy("contactAdded DESC")
        .limit("3")
        .end({userId: userId, minTimeShown: minTimeShown});
};

let getNumberOfContacting = function (userId) {
    let minTimeShown = time.getNowUtcTimestamp() - ONE_DAY;
    return db.cypher().match("(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)")
        .where("relContacting.contactAdded >= user.previousLastLogin OR relContacting.contactAdded >= {minTimeShown}")
        .return("count(*) AS numberOfContacting")
        .end({userId: userId, minTimeShown: minTimeShown});
};

module.exports = {
    getContacting: getContacting,
    getNumberOfContacting: getNumberOfContacting
};
