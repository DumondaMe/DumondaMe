'use strict';

module.exports = [function () {

    this.getCount = function (count) {
        var result = count.toString();
        if(count >= 1000) {
            result = Math.floor(count / 1000).toString() + "k";
        }
        if(count >= 1000000) {
            result = Math.floor(count / 1000000).toString() + "m";
        }
        return result;
    };
}];
