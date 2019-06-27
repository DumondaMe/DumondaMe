'use strict';


module.exports = [
    function () {

        this.isSendMessageAllowed = function (messageText) {
            if (messageText) {
                return messageText.trim() !== '' && messageText.length <= 1000;
            }
            return false;
        };
    }];
