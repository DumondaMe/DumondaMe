'use strict';

module.exports = function () {
    return function (arrayLength) {
        var arr, i;
        if (arrayLength) {
            arrayLength = Math.ceil(arrayLength);
            arr = new Array(arrayLength);
            for (i = 0; i < arrayLength; i = i + 1) {
                arr[i] = i;
            }
            return arr;
        }
    };

};
