'use strict';

module.exports = ['ImageViewService', 'Link',
    function (ImageViewService, Link) {
        var ctrl = this;

        ctrl.openLink = Link.open;

        ctrl.openImageView = function () {
            ImageViewService.showImage(ctrl.pageDetail.page.imageNormal);
        };
    }];

