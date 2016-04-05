'use strict';

var countColumnHeight = function (pinwall, $log) {
    var height = 0;
    angular.forEach(pinwall, function (pinwallElement) {
        if (pinwallElement.hasOwnProperty('pinwallHeight')) {
            height += pinwallElement.pinwallHeight;
        } else {
            $log.warn("pinwallHeight missing for element typ " + pinwallElement.pinwallType);
        }
    });
    return height;
};

var getSmallerColumn = function (pinwallFirstColumn, pinwallSecondColumn, $log) {
    if (countColumnHeight(pinwallFirstColumn, $log) <= countColumnHeight(pinwallSecondColumn, $log)) {
        return pinwallFirstColumn;
    }
    return pinwallSecondColumn;
};

module.exports = ['$log',
    function ($log) {
        this.getColumns = function (pinwall) {
            var columns = {pinwallFirstColumn: [], pinwallSecondColumn: []};
            angular.forEach(pinwall, function (pinwallElement) {
                getSmallerColumn(columns.pinwallFirstColumn, columns.pinwallSecondColumn, $log).push(pinwallElement);
            });
            return columns;
        };
    }];
