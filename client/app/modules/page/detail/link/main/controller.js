'use strict';

module.exports = ['Categories', 'ElyModal', 'DeletePageService', 'Link',
    function (Categories, ElyModal, DeletePageService, Link) {
        var ctrl = this;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;
        
        ctrl.openLink = Link.open;

        ctrl.modifyPage = function () {
            ElyModal.show('ManageLinkPageCtrl', 'app/modules/page/modal/manageLinkPage/template.html',
                {
                    data: {
                        pageId: ctrl.pageDetail.page.pageId,
                        title: ctrl.pageDetail.page.title,
                        description: ctrl.pageDetail.page.description,
                        selectedCategories: ctrl.pageDetail.page.category,
                        dataUri: ctrl.pageDetail.page.imageUrl
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.pageDetail.page.description = data.description;
                ctrl.pageDetail.page.category = Categories.getCodes(data.selectedCategories);
                ctrl.pageDetail.page.imageUrl = data.dataUri;
            });
        };

        ctrl.deletePage = function () {
            DeletePageService.deletePage(ctrl.pageDetail.page.pageId);
        };
    }];

