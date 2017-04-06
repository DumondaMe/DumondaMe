'use strict';

let userInfo = require('./../userInfo');
let recommendedUser = require('./../pinwall/recommendedUser');
let recommendedUserSetting = require('./../setting/recommendedUser');

let getContactRecommendation = function (userId, data) {

    let commands = [];

    return recommendedUserSetting.showUserRecommendationOnHome(userId).then(function (showUserRecommendation) {
        commands.push(recommendedUser.getInvitedUsers(userId, 20, data.skipInvitedUser).getCommand());
        commands.push(recommendedUser.getRecommendedByContactUsers(userId, 20, data.skipRecommendedByContact).getCommand());
        return recommendedUser.getRecommendedUsers(userId, 20, data.skipRecommended)
            .send(commands).then(function (resp) {
                userInfo.addImageForThumbnail(resp[0]);
                userInfo.addImageForThumbnail(resp[1]);
                userInfo.addImageForThumbnail(resp[2]);
                return {
                    recommendedUser: resp[0].concat(resp[1], resp[2]),
                    showUserRecommendation: showUserRecommendation,
                    skipInvitedUser: resp[0].length + data.skipInvitedUser,
                    skipRecommendedByContact: resp[1].length + data.skipRecommendedByContact,
                    skipRecommended: resp[2].length + data.skipRecommended
                };
            });
    });
};


module.exports = {
    getContactRecommendation: getContactRecommendation
};
