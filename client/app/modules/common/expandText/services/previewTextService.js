'use strict';


module.exports = [
    function () {
        this.getPreviewText = function (text, length) {
            var previewText = text;
            if (text) {
                if (text.length > length) {
                    previewText = text.substring(0, length) + "...";
                }
            }
            return previewText;
        };
    }];
