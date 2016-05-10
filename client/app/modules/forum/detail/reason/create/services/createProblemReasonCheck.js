'use strict';


module.exports = [
    function () {

        this.isSendReasonAllowed = function (title, description) {
            if (description && title) {
                return description.trim() !== '' && title.trim() !== '';
            }
            return false;
        };
    }];
