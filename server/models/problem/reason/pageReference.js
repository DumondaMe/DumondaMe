'use strict';

var db = require('./../../../neo4j');
var moment = require('moment');
var uuid = require('./../../../lib/uuid');
var check = require('./check/reason');

var addPage = function (userId, reasonId, pageId, req) {

    var timeReasonExplanation = Math.floor(moment.utc().valueOf() / 1000),
        reasonExplanationId = uuid.generateUUID();
    return check.checkPageToReasonExist(reasonId, pageId, req).then(function () {
        return db.cypher().match("(reason:Reason {reasonId: {reasonId}}), (page:Page {pageId: {pageId}})")
            .createUnique("(reason)-[:HAS_EXPLANATION]->(explanation:ReasonExplanation {reasonExplanationId: {reasonExplanationId}, " +
                "created: {timeReasonExplanation}})-[:REFERENCES]->(page)")
            .return("explanation.reasonExplanationId AS reasonExplanationId")
            .end({
                userId: userId,
                reasonId: reasonId,
                reasonExplanationId: reasonExplanationId,
                timeReasonExplanation: timeReasonExplanation,
                pageId: pageId
            })
            .send().then(function (resp) {
                if (resp.length === 1) {
                    return {reasonExplanationId: resp[0].reasonExplanationId};
                }
                return null;
            });
    });
};


module.exports = {
    addPage: addPage
};
