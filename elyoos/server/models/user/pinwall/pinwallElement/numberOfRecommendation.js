'use strict';

let getNumberOfRecommendation = function (pinwallElement) {

    if (pinwallElement.hasOwnProperty('numberOfPinwallDataRecommendations')) {
        return pinwallElement.numberOfPinwallDataRecommendations;
    } else if (pinwallElement.hasOwnProperty('numberOfPinwallRecommendations')) {
        return pinwallElement.numberOfPinwallRecommendations;
    }
    return pinwallElement.totalNumberOfRecommendations;
};


module.exports = {
    getNumberOfRecommendation: getNumberOfRecommendation
};
