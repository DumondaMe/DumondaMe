'use strict';

module.exports = ['PreviewTextService',
    function (PreviewTextService) {
        var ctrl = this;

        ctrl.previewText = PreviewTextService.getPreviewText(ctrl.element.text, 120).text;
    }];

