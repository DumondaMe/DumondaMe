'use strict';

var getPreviewText = function (text) {
    var previewText = text;
    if (text) {
        if (text.length > 120) {
            previewText = text.substring(0, 120) + "...";
        }
    }
    return previewText;
};

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter', function (dateFormatter) {
            var ctrl = this;

            ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

            ctrl.previewText = getPreviewText(ctrl.element.text);
        }];
    }
};

