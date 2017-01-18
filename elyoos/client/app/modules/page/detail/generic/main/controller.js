'use strict';

module.exports = ['ImageViewService',
    function (ImageViewService) {
        var ctrl = this;

        ctrl.openImageView = function () {
            ImageViewService.showImage(ctrl.pageDetail.page.imageNormal);
        };
    }];

