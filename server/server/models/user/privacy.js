'use strict';

var db = require('./../../neo4j');
var logger = requireLogger.getLogger(__filename);

module.exports = {
    getPrivacySettings: function (id) {
        var commands = [], returnCommand;

        returnCommand = "visibility.profile AS profileVisible, visibility.profileData AS profileDataVisible, " +
            "visibility.image AS imageVisible, visibility.contacts AS contactsVisible, r.type AS type";

        commands.push(db.cypher().match("(user:User {userId: {userId}})-[r:HAS_PRIVACY]->(visibility:Privacy)")
            .return(returnCommand)
            .end({
                userId: id
            }).getCommand());
        return db.cypher().match("(user:User {userId: {userId}})-[r:HAS_PRIVACY_NO_CONTACT]->(visibility:Privacy)")
            .return(returnCommand)
            .end({
                userId: id
            }).send(commands)
            .then(function (result) {
                return {normal: result[0], noContact: result[1][0]};
            });
    }
};
