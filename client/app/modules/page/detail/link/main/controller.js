'use strict';

module.exports = ['Topics', 'ElyModal', 'DeletePageService', 'Link',
    function (Topics, ElyModal, DeletePageService, Link) {
        var ctrl = this;
        
        ctrl.openLink = Link.open;

        ctrl.modifyPage = function () {
            ElyModal.show('ManageLinkPageCtrl', 'app/modules/page/modal/manageLinkPage/template.html',
                {
                    data: {
                        pageId: ctrl.pageDetail.page.pageId,
                        title: ctrl.pageDetail.page.title,
                        description: ctrl.pageDetail.page.description,
                        selectedTopics: ctrl.pageDetail.page.topic,
                        dataUri: ctrl.pageDetail.page.imageUrl
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.pageDetail.page.description = data.description;
                ctrl.pageDetail.page.topic = Topics.getCodes(data.selectedTopics);
                ctrl.pageDetail.page.imageUrl = data.dataUri;
            });
        };

        ctrl.deletePage = function () {
            DeletePageService.deletePage(ctrl.pageDetail.page.pageId);
        };
    }];

