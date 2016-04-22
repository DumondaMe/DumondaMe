'use strict';

module.exports = ['Categories', 'ElyModal', 'DeletePageService',
    function (Categories, ElyModal, DeletePageService) {
        var ctrl = this;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;

        ctrl.modifyPage = function () {
            ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html',
                {
                    data: {
                        pageId: ctrl.pageDetail.page.pageId,
                        title: ctrl.pageDetail.page.title,
                        description: ctrl.pageDetail.page.description,
                        author: ctrl.pageDetail.page.author[0].name,
                        publishDate: ctrl.pageDetail.page.publishDate,
                        selectedCategories: ctrl.pageDetail.page.category,
                        dataUri: ctrl.pageDetail.page.titleUrl
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.pageDetail.page.description = data.description;
                ctrl.pageDetail.page.author[0].name = data.author;
                ctrl.pageDetail.page.publishDate = data.publishDate;
                ctrl.pageDetail.page.category = Categories.getCodes(data.selectedCategories);
                ctrl.pageDetail.page.titleUrl = data.dataUri;
            });
        };

        ctrl.deletePage = function () {
            DeletePageService.deletePage(ctrl.pageDetail.page.pageId);
        };
    }];

