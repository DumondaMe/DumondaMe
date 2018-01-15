'use strict';

let db = requireDb();

let setRecommendedUserOnHomeScreen = function (userId, showUserRecommendationOnHome) {
    return db.cypher().match('(u:User {userId: {userId}})')
        .set('u', {showUserRecommendationOnHome: showUserRecommendationOnHome}).end({userId: userId}).send();
};

let showUserRecommendationOnHome = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})').return('u.showUserRecommendationOnHome AS showUserRecommendationOnHome')
        .end({userId: userId}).send().then(function(resp) {
            if(!resp[0].hasOwnProperty('showUserRecommendationOnHome')) {
                return true;
            }
            return resp[0].showUserRecommendationOnHome;
        });
};

module.exports = {
    setRecommendedUserOnHomeScreen: setRecommendedUserOnHomeScreen,
    showUserRecommendationOnHome: showUserRecommendationOnHome
};