'use strict';

let db = requireDb();

let getInvitedUsers = function (userId, limit, skip = 0) {
    return db.cypher().match(`(inviteUser:User)<-[:HAS_INVITED]->(user:User {userId: {userId}})`)
        .where(`NOT (user)-[:IS_CONTACT]->(inviteUser) AND NOT (user)-[:IS_BLOCKED]-(inviteUser)`)
        .optionalMatch("(user)<-[relInviteUser:IS_CONTACT]-(inviteUser)-[privacyRel:HAS_PRIVACY]->(privacy:Privacy)")
        .where("privacyRel.type = relInviteUser.type")
        .optionalMatch("(inviteUser)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("NOT EXISTS((user)<-[:IS_CONTACT]-(inviteUser))")
        .with("user, inviteUser, relInviteUser, privacyNoContact, privacy")
        .where(`(NOT EXISTS((user)<-[:IS_CONTACT]-(inviteUser)) AND privacyNoContact.profile = true) OR 
                (relInviteUser.contactAdded < user.previousLastLogin AND privacy.profile = true)`)
        .return(`inviteUser.userId AS userId, inviteUser.name AS name, true AS invitedUser,
                 privacy.profile AS profileVisible, privacy.image AS imageVisible, privacyNoContact.profile AS profileVisibleNoContact, 
                 privacyNoContact.image AS imageVisibleNoContact`)
        .orderBy("name")
        .skip("{skip}")
        .limit("{limit}")
        .end({userId: userId, limit: limit, skip: skip});
};

let getRecommendedByContactUsers = function (userId, limit, skip = 0) {
    return db.cypher().match(`(user:User {userId: {userId}})-[:IS_CONTACT]->(contact:User)-[:IS_CONTACT]->(contactedUser:User)`)
        .where(`contactedUser.userId <> user.userId AND NOT (user)-[:IS_CONTACT]->(contactedUser) 
                AND NOT (contactedUser)<-[:HAS_INVITED]->(user) AND NOT (user)-[:IS_BLOCKED]-(contactedUser)`)
        .optionalMatch("(user)<-[relContactedUser:IS_CONTACT]-(contactedUser)-[privacyRel:HAS_PRIVACY]->(privacy:Privacy)")
        .where("privacyRel.type = relContactedUser.type")
        .optionalMatch("(contactedUser:User)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("NOT EXISTS((user)<-[:IS_CONTACT]-(contactedUser))")
        .with(`user, contactedUser, privacyNoContact, relContactedUser, privacy, count(contact) AS numberOfSameContacts,
               toInt(distance(point(user),point(contactedUser))) AS distanceBetweenUser`)
        .where(`(NOT EXISTS((user)<-[:IS_CONTACT]-(contactedUser)) AND privacyNoContact.profile = true) OR 
                (relContactedUser.contactAdded < user.previousLastLogin AND privacy.profile = true)`)
        .return(`SIZE((contactedUser)<-[:IS_CONTACT]-(:User)) AS numberOfContacting, contactedUser.userId AS userId, 
                 contactedUser.name AS name, privacy.profile AS profileVisible, privacy.image AS imageVisible, 
                 privacyNoContact.profile AS profileVisibleNoContact, privacyNoContact.image AS imageVisibleNoContact, 
                 numberOfSameContacts`)
        .orderBy("numberOfSameContacts DESC, distanceBetweenUser, numberOfContacting DESC, name")
        .skip("{skip}")
        .limit("{limit}")
        .end({userId: userId, limit: limit, skip: skip});
};

let getRecommendedUsers = function (userId, limit, skip = 0) {
    return db.cypher().match(`(recommendedUser:User), (user:User {userId: {userId}})`)
        .where(`NOT (user)-[:IS_CONTACT]->()-[:IS_CONTACT]->(recommendedUser) AND NOT (user)-[:IS_CONTACT]->(recommendedUser) AND 
                recommendedUser.userId <> user.userId AND NOT (recommendedUser)<-[:HAS_INVITED]->(user)
                AND NOT (user)-[:IS_BLOCKED]-(recommendedUser)`)
        .optionalMatch("(user)<-[relContactedUser:IS_CONTACT]-(recommendedUser)-[privacyRel:HAS_PRIVACY]->(privacy:Privacy)")
        .where("privacyRel.type = relContactedUser.type")
        .optionalMatch("(recommendedUser:User)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("NOT EXISTS((user)<-[:IS_CONTACT]-(recommendedUser))")
        .with(`user, recommendedUser, privacyNoContact, relContactedUser, privacy,
               toInt(distance(point(user),point(recommendedUser))) AS distanceBetweenUser`)
        .where(`(NOT EXISTS((user)<-[:IS_CONTACT]-(recommendedUser)) AND privacyNoContact.profile = true) OR 
                (relContactedUser.contactAdded < user.previousLastLogin AND privacy.profile = true)`)
        .return(`SIZE((:User)-[:IS_CONTACT]->(recommendedUser)) AS numberOfContacting, recommendedUser.userId AS userId, recommendedUser.name AS name, 
                 privacy.profile AS profileVisible, privacy.image AS imageVisible, privacyNoContact.profile AS profileVisibleNoContact, 
                 privacyNoContact.image AS imageVisibleNoContact`)
        .orderBy("numberOfContacting DESC, distanceBetweenUser, name")
        .skip("{skip}")
        .limit("{limit}")
        .end({userId: userId, limit: limit, skip: skip});
};

module.exports = {
    getInvitedUsers: getInvitedUsers,
    getRecommendedByContactUsers: getRecommendedByContactUsers,
    getRecommendedUsers: getRecommendedUsers
};
