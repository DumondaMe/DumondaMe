'use strict';


module.exports = [
    function () {
        this.getPreviewText = function (text) {
            var previewText = text;
            if (text) {
                if (text.length > 120) {
                    previewText = text.substring(0, 120) + "...";
                }
            }
            return previewText;
        };
    }];
