'use strict';

module.exports = ['dateFormatter', 'ImageViewService', 'UserDetailNavigation',
    function (dateFormatter, ImageViewService, UserDetailNavigation) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.format;

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.blogDetail.page.userId, ctrl.blogDetail.page.isAdmin);
        };

        ctrl.openImageView = function () {
            ImageViewService.showImage(ctrl.blogDetail.page.url);
        };
    }];

