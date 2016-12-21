'use strict';

var db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

var checkDeleteRecommendationAllowed = function (userId, recommendationId, req) {
    return db.cypher().match("(user:User {userId: {userId}})-[:RECOMMENDS]->(rec:Recommendation {recommendationId: {recommendationId}})")
        .return("user.userId AS userId")
        .end({userId: userId, recommendationId: recommendationId}).send()
        .then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation('User tries to delete other users recommendation ' + recommendationId, logger, req);
            }
        });
};

module.exports = {
    checkDeleteRecommendationAllowed: checkDeleteRecommendationAllowed
};
