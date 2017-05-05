'use strict';

var countColumnHeight = function (pinwall, initHeight, $log) {
    var height = initHeight;
    angular.forEach(pinwall, function (pinwallElement) {
        if (pinwallElement.hasOwnProperty('pinwallHeight')) {
            height += pinwallElement.pinwallHeight;
        } else {
            $log.warn("pinwallHeight missing for element typ " + pinwallElement.pinwallType);
        }
    });
    return height;
};

var getSmallerColumn = function (pinwallFirstColumn, firstColumnInitHeight, pinwallSecondColumn, $log) {
    if (countColumnHeight(pinwallFirstColumn, firstColumnInitHeight, $log) <=
        countColumnHeight(pinwallSecondColumn, 0, $log)) {
        return pinwallFirstColumn;
    }
    return pinwallSecondColumn;
};

var getFirstColumnHeight = function (numberOfRecommendation) {
    //Initial height of welcome user dialog
    var height = 242;
    //Handling height of user recommendation
    if (numberOfRecommendation > 0) {

        if (numberOfRecommendation >= 5) {
            height = height + 405;
        } else {
            height = height + 140 + (numberOfRecommendation * 40);
        }
    }
    return height;
};

module.exports = ['$log', 'ShowBlogService',
    function ($log, ShowBlogService) {
        this.getColumns = function (pinwall, numberOfRecommendation) {
            var columns = {pinwallFirstColumn: [], pinwallSecondColumn: []};
            angular.forEach(pinwall, function (pinwallElement) {
                if (ShowBlogService.showElement(pinwall, pinwallElement)) {
                    getSmallerColumn(columns.pinwallFirstColumn, getFirstColumnHeight(numberOfRecommendation),
                        columns.pinwallSecondColumn, $log).push(pinwallElement);
                }
            });
            return columns;
        };
    }];
