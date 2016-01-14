'use strict';


module.exports = [
    function () {

        this.isSendProblemAllowed = function (text) {
            if (text) {
                return text.trim() !== '';
            }
            return false;
        };
    }];
