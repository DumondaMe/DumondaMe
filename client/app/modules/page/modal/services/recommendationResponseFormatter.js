'use strict';

module.exports = ['userInfo', 'Topics', function (userInfo, Topics) {

    this.format = function (data, resp, label) {
        var userInfoData = userInfo.getUserInfo();
        data.thisRecommendationByUser = true;
        data.rating = resp.recommendation.user.rating;
        data.created = resp.recommendation.user.created;
        data.pinwallType = "Recommendation";
        data.label = label;
        data.numberOfSamePinwallData = 1;
        data.name = userInfoData.name;
        data.userId = userInfoData.userId;
        data.profileUrl = userInfoData.profileImage;
        data.topic = Topics.getCodes(data.selectedTopics);
    };
}];
