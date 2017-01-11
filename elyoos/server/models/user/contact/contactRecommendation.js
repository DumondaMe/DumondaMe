'use strict';

let userInfo = require('./../userInfo');
let recommendedUser = require('./../pinwall/recommendedUser');
let recommendedUserSetting = require('./../setting/recommendedUser');

let getContactRecommendation = function (userId) {

    let commands = [];

    return recommendedUserSetting.showUserRecommendationOnHome(userId).then(function (showUserRecommendation) {
        commands.push(recommendedUser.getRecommendedByContactUsers(userId, 20).getCommand());
        return recommendedUser.getRecommendedUsers(userId, 20).send(commands).then(function (resp) {
            userInfo.addImageForThumbnail(resp[0]);
            userInfo.addImageForThumbnail(resp[1]);
            return {recommendedUser: resp[0].concat(resp[1]), showUserRecommendation: showUserRecommendation};
        });
    });
};


module.exports = {
    getContactRecommendation: getContactRecommendation
};
