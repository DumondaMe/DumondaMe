'use strict';

module.exports = [function () {

    this.sort = function (reasons) {
        reasons.sort(function (a, b) {
            if (a.numberOfRatings > b.numberOfRatings) {
                return -1;
            } else if (a.numberOfRatings === b.numberOfRatings) {
                if (a.created > b.created) {
                    return -1;
                } else {
                    return 1;
                }
            }
            return 1;
        })
    };

}];
