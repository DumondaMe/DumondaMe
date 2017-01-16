'use strict';

module.exports = ['Topics', 'ElyModal', 'DeletePageService', 'Languages',
    function (Topics, ElyModal, DeletePageService, Languages) {
        var ctrl = this;

        ctrl.editPage = function () {
            ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html',
                {
                    data: {
                        pageId: ctrl.pageDetail.page.pageId,
                        title: ctrl.pageDetail.page.title,
                        description: ctrl.pageDetail.page.description,
                        selectedTopics: ctrl.pageDetail.page.topic,
                        selectedLanguages: ctrl.pageDetail.page.language,
                        link: ctrl.pageDetail.page.link,
                        youtubeLinkFormatted: ctrl.pageDetail.page.linkEmbed
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.pageDetail.page.description = data.description;
                ctrl.pageDetail.page.link = data.link;
                ctrl.pageDetail.page.linkEmbed = data.linkEmbed;
                ctrl.pageDetail.page.linkHistory = data.linkHistory;
                ctrl.pageDetail.page.linkHistoryDate = data.linkHistoryDate;
                ctrl.pageDetail.page.topic = Topics.getCodes(data.selectedTopics);
                ctrl.pageDetail.page.language = Languages.getCodes(data.selectedLanguages);
            });
        };

        ctrl.deletePage = function () {
            DeletePageService.deletePage(ctrl.pageDetail.page.pageId);
        };
    }];

