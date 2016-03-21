'use strict';


module.exports = [
    function () {
        this.getPreviewText = function (text, length) {
            var previewText = text, cropped = false;
            if (text) {
                if (text.length > length) {
                    previewText = text.substring(0, length) + "...";
                    cropped = true;
                }
            }
            return {
                text: previewText,
                cropped: cropped
            };
        };
    }];
