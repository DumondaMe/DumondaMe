'use strict';

let db = requireDb();
let userInfo = require('../../user/userInfo');

let getMatchQuery = function (onlyContacts) {
    let matchQuery = "(page:Page {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(otherUser:User)";
    if (onlyContacts) {
        matchQuery = matchQuery.concat("<-[IS_CONTACT]-(user:User {userId: {userId}})");
    } else {
        matchQuery = matchQuery.concat(", (user:User {userId: {userId}})");
    }

    return db.cypher().match(matchQuery);
};

let getTotalNumberOfComments = function (userId, pageId, onlyContacts) {
    return getMatchQuery(onlyContacts)
        .where("otherUser.userId <> {userId}")
        .return("count(*) AS totalNumberOfComments")
        .end({userId: userId, pageId: pageId}).getCommand();
};

let getComments = function (userId, requestParams) {

    let matchQuery = getMatchQuery(requestParams.onlyContacts), commands = [];

    commands.push(getTotalNumberOfComments(userId, requestParams.pageId, requestParams.onlyContacts));

    return matchQuery
        .with("page, rec, user, otherUser")
        .where("otherUser.userId <> {userId}")
        .with("page, rec, user, otherUser")
        .match("(otherUser)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(otherUser)")
        .with("page, rec, otherUser, rContact, vr, privacy")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("otherUser.userId AS userId, otherUser.name AS name, rec.comment AS comment, rec.created AS created," +
            "privacy.profile AS profileVisible, privacy.image AS imageVisible")
        .orderBy("rec.created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({
            pageId: requestParams.pageId, userId: userId, skip: requestParams.skip, limit: requestParams.maxItems
        }).send(commands).then(function (resp) {
            userInfo.addImageForThumbnail(resp[1]);
            return {totalNumberOfComments: resp[0][0].totalNumberOfComments, comments: resp[1]};
        });
};

module.exports = {
    getComments: getComments
};
