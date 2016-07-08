'use strict';

module.exports = ['Topics', 'ElyModal', 'DeletePageService', 'Languages',
    function (Topics, ElyModal, DeletePageService, Languages) {
        var ctrl = this;

        ctrl.modifyPage = function () {
            ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html',
                {
                    data: {
                        pageId: ctrl.pageDetail.page.pageId,
                        title: ctrl.pageDetail.page.title,
                        description: ctrl.pageDetail.page.description,
                        selectedTopics: ctrl.pageDetail.page.topic,
                        selectedLanguages: ctrl.pageDetail.page.language
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.pageDetail.page.description = data.description;
                ctrl.pageDetail.page.topic = Topics.getCodes(data.selectedTopics);
                ctrl.pageDetail.page.language = Languages.getCodes(data.selectedLanguages);
            });
        };

        ctrl.deletePage = function () {
            DeletePageService.deletePage(ctrl.pageDetail.page.pageId);
        };
    }];

