'use strict';

var db = require('./../../../neo4j');
var userInfo = require('./../userInfo');
var unread = require('../../messages/util/unreadMessages');
var pagePreview = require('./../../page/pagePreview');
var cdn = require('../../util/cdn');
var _ = require('underscore');

var addBlogUrl = function (blog, heightPreviewImage) {
    if (heightPreviewImage) {
        blog.url = cdn.getUrl('blog/' + blog.blogId + '/preview.jpg');
        blog.urlFull = cdn.getUrl('blog/' + blog.blogId + '/normal.jpg');
    }
};

var getContacting = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)")
        .where("relContacting.contactAdded >= user.previousLastLogin")
        .with("contacting, relContacting, user")
        .match("(contacting)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contacting)")
        .with("contacting, relContacting, rContact, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("contacting.userId AS userId, contacting.name AS name, relContacting.contactAdded AS contactAdded, " +
            "v.profile AS profileVisible, v.image AS imageVisible")
        .orderBy("contactAdded DESC")
        .limit("3")
        .end({userId: userId});
};

var getNumberOfContacting = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)")
        .where("relContacting.contactAdded >= user.previousLastLogin")
        .return("count(*) AS numberOfContacting")
        .end({userId: userId});
};

var getUserInfos = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})-[type:HAS_PRIVACY]->(:Privacy)")
        .return("type.type AS type")
        .orderBy("type")
        .end({userId: userId});
};

var addProfileUrl = function (element, pinwallElement) {
    if (pinwallElement.hasOwnProperty('contact')) {
        element.name = pinwallElement.contact.name;
        if (pinwallElement.hasOwnProperty('privacy')) {
            element.profileUrl = userInfo.getImageForPreview(
                {
                    userId: pinwallElement.contact.userId,
                    profileVisible: pinwallElement.privacy.profile,
                    imageVisible: pinwallElement.privacy.image
                }, 'thumbnail.jpg');
        } else {
            element.profileUrl = userInfo.getImageForPreview(
                {
                    userId: pinwallElement.contact.userId,
                    profileVisible: pinwallElement.privacyNoContact.profile,
                    imageVisible: pinwallElement.privacyNoContact.image
                }, 'thumbnail.jpg');
        }
    } else {
        element.name = pinwallElement.user.name;
        element.profileUrl = userInfo.getImageForPreview({
            userId: pinwallElement.user.userId, profileVisible: true, imageVisible: true
        }, 'thumbnail.jpg');
    }
};

var getPinwallElements = function (pinwallElements) {
    var result = [];
    _.each(pinwallElements, function (pinwallElement) {
        var element = {};
        if (_.contains(pinwallElement.pinwallType, 'Blog')) {
            element.pinwallType = 'Blog';
            element.blogId = pinwallElement.pinwall.blogId;
            element.title = pinwallElement.pinwall.title;
            element.text = pinwallElement.pinwall.text;
            element.created = pinwallElement.pinwall.created;
            element.isAdmin = pinwallElement.isAdmin;
            addProfileUrl(element, pinwallElement);
            addBlogUrl(element, pinwallElement.pinwall.heightPreviewImage);
        }
        if (_.contains(pinwallElement.pinwallType, 'Recommendation')) {
            element.pinwallType = 'Recommendation';
            element.rating = pinwallElement.pinwall.rating;
            element.comment = pinwallElement.pinwall.comment;
            element.created = pinwallElement.pinwall.created;
            element.label = pinwallElement.pinwallData.label;
            element.pageId = pinwallElement.pinwallData.pageId;
            element.description = pinwallElement.pinwallData.description;
            element.title = pinwallElement.pinwallData.title;
            element.link = pinwallElement.pinwallData.link;
            element.isAdmin = pinwallElement.isAdmin;
            addProfileUrl(element, pinwallElement);
            pagePreview.addPageUrl([element]);
        }
        result.push(element);
    });
    return result;
};

var getPinwall = function (userId, request) {
    var commands = [];

    commands.push(unread.getUnreadMessages(userId).getCommand());
    commands.push(getContacting(userId).getCommand());
    commands.push(getNumberOfContacting(userId).getCommand());
    commands.push(getUserInfos(userId).getCommand());

    return db.cypher().match("(pinwall:PinwallElement), (user:User {userId: {userId}})")
        .where("(user)-[]->(pinwall) OR (user)-[:IS_CONTACT]->(:User)-[]->(pinwall)")
        .optionalMatch("(pinwall)-[:PINWALL_DATA]->(pinwallData)")
        .optionalMatch("(user)-[:IS_CONTACT]->(contact:User)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("(user)-[:IS_CONTACT]->(contact)-[]->(pinwall)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact:User)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("(user)-[:IS_CONTACT]->(contact)-[]->(pinwall) AND isContact.type = relPrivacy.type")
        .with("user, pinwall, pinwallData, contact, isContact, privacy, privacyNoContact, EXISTS((user)-[]->(pinwall)) AS isAdmin")
        .orderBy("pinwall.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .match("(pinwall)")
        .where("((user)-[]->(pinwall) OR (EXISTS((user)-[:IS_CONTACT]->(contact)) AND NOT EXISTS(pinwall.privacy)) " +
            "OR (EXISTS((user)-[:IS_CONTACT]->(contact)) AND pinwall.privacy = isContact.type)) " +
            "AND NOT EXISTS((contact)-[:IS_BLOCKED]->(user))")
        .return("user, pinwall, pinwallData, contact, LABELS(pinwall) AS pinwallType, privacy, privacyNoContact, isAdmin")
        .end({userId: userId, skip: request.skip, maxItems: request.maxItems})
        .send(commands)
        .then(function (resp) {
            userInfo.addImageForThumbnail(resp[0]);
            userInfo.addImageForThumbnail(resp[1]);

            return {
                messages: resp[0],
                contacting: {users: resp[1], numberOfContacting: resp[2][0].numberOfContacting},
                pinwall: getPinwallElements(resp[4]),
                user: {privacyTypes: resp[3], profileUrl: cdn.getUrl('profileImage/' + userId + '/profilePreview.jpg')}
            };
        });
};

module.exports = {
    getPinwall: getPinwall
};
