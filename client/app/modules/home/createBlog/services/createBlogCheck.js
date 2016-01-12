'use strict';


module.exports = [
    function () {

        this.isSendBlogAllowed = function (blogText, imageLoading) {
            if (!imageLoading && blogText) {
                return blogText.trim() !== '';
            }
            return false;
        };
    }];
