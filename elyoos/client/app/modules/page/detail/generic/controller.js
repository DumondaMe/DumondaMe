'use strict';

module.exports = ['ElyModal', 'DeletePageService',
    function (ElyModal, DeletePageService) {
        var ctrl = this;

        ctrl.editPage = function () {

        };

        ctrl.deletePage = function () {
            DeletePageService.deletePage(ctrl.pageDetail.page.pageId);
        };
    }];

