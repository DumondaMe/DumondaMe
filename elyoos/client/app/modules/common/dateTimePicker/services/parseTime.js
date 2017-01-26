'use strict';


module.exports = [
    function () {
        this.parseTime = function (time) {
            var result = {}, temp;
            if(angular.isString(time)) {
                temp = time.split(':');
                if (temp.length === 2) {
                    result.hour = parseInt(temp[0]);
                    result.minute = parseInt(temp[1]);
                }
            }
            return result;
        };
    }];
