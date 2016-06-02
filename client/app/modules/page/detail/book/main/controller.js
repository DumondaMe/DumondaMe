'use strict';

module.exports = ['ElyModal', 'DeletePageService', 'Topics',
    function (ElyModal, DeletePageService, Topics) {
        var ctrl = this;

        ctrl.modifyPage = function () {
            ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html',
                {
                    data: {
                        pageId: ctrl.pageDetail.page.pageId,
                        title: ctrl.pageDetail.page.title,
                        description: ctrl.pageDetail.page.description,
                        author: ctrl.pageDetail.page.author[0].name,
                        publishDate: ctrl.pageDetail.page.publishDate,
                        selectedTopics: ctrl.pageDetail.page.topic,
                        dataUri: ctrl.pageDetail.page.titleUrl
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.pageDetail.page.description = data.description;
                ctrl.pageDetail.page.author[0].name = data.author;
                ctrl.pageDetail.page.publishDate = data.publishDate;
                ctrl.pageDetail.page.topic = Topics.getCodes(data.selectedTopics);
                ctrl.pageDetail.page.titleUrl = data.dataUri;
            });
        };

        ctrl.deletePage = function () {
            DeletePageService.deletePage(ctrl.pageDetail.page.pageId);
        };
    }];

