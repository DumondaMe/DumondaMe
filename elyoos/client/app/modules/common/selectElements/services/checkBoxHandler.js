'use strict';

module.exports = [function () {

    var service = this;

    service.toggle = function (item, list) {
        var idx = service.getIndex(item, list);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
    };

    service.getIndex = function (item, list) {
        var index = -1;
        angular.forEach(list, function (listItem, itemIndex) {
            if (listItem.description === item.description) {
                index = itemIndex;
            }
        });
        return index;
    };

    service.exists = function (item, list) {
        var exist = false;
        angular.forEach(list, function (listItem) {
            if (listItem.description === item.description) {
                exist = true;
            }
        });
        return exist;
    };
}];
