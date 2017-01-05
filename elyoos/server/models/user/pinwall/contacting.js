'use strict';

let db = requireDb();

let getContacting = function (userId) {
    return db.cypher().match(`(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)
                               -[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)`)
        .where(`relContacting.contactAdded >= user.previousLastLogin AND 
               ((relContacting IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (relContacting.type = vr.type AND type(vr) = 'HAS_PRIVACY'))`)
        .return(`contacting.userId AS userId, contacting.name AS name, relContacting.contactAdded AS contactAdded,
                 EXISTS((user)-[:IS_CONTACT]->(contacting)) AS contactOfUser, v.profile AS profileVisible, v.image AS imageVisible`)
        .orderBy("contactAdded DESC")
        .limit("3")
        .end({userId: userId});
};

let getNumberOfContacting = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)")
        .where("relContacting.contactAdded >= user.previousLastLogin")
        .return("count(*) AS numberOfContacting")
        .end({userId: userId});
};

module.exports = {
    getContacting: getContacting,
    getNumberOfContacting: getNumberOfContacting
};
