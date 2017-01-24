'use strict';

let cdn = require('elyoos-server-lib').cdn;

let setProfileUrl = function (element, pinwallElement) {
    let privacy = pinwallElement.privacy || pinwallElement.privacyNoContact;
    if(privacy.profile && privacy.image && !pinwallElement.writerBlockedUser) {
        element.url = cdn.getUrl(`profileImage/${pinwallElement.writer.userId}/thumbnail.jpg`);
    } else {
        element.url = cdn.getUrl(`profileImage/default/thumbnail.jpg`);
    }
};

let getRecommendationElement = function (pinwallElement) {

    let element = {};
    element.label = 'Blog';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.topic = pinwallElement.recommendationElement.topic;
    element.writerName = pinwallElement.writer.name;
    setProfileUrl(element, pinwallElement);
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
