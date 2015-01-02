'use strict';

module.exports = function () {
    return function (items, start, numberOfItems) {
        var filtered = [], i;
        for (i = 0; i < items.length; i = i + 1) {
            if (i >= start && i < numberOfItems + start) {
                filtered.push(items[i]);
            }
        }
        return filtered;
    };
};
