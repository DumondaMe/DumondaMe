'use strict';

module.exports = ['userInfo', 'Topics', function (userInfo, Topics) {

    this.format = function (data, resp, label) {
        var userInfoData = userInfo.getUserInfo();
        data.thisRecommendationByUser = true;
        data.recommendedByUser = true;
        data.userRecommendationId = resp.recommendation.user.recommendationId;
        data.totalNumberOfRecommendations = 1;
        data.created = resp.recommendation.user.created;
        data.pinwallType = "Recommendation";
        data.label = label;
        data.name = userInfoData.name;
        data.userId = userInfoData.userId;
        data.profileUrl = userInfoData.profileImage;
        data.topic = Topics.getCodes(data.selectedTopics);
    };
}];
