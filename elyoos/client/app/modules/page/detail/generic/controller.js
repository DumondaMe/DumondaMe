'use strict';

module.exports = ['ElyModal', 'DeletePageService', 'Topics', 'Languages',
    function (ElyModal, DeletePageService, Topics, Languages) {
        var ctrl = this;

        ctrl.editPage = function () {
            ElyModal.show('ManageGenericPageCtrl', 'app/modules/page/modal/manageGenericPage/template.html',
                {
                    data: {
                        pageId: ctrl.pageDetail.page.pageId,
                        title: ctrl.pageDetail.page.title,
                        description: ctrl.pageDetail.page.description,
                        selectedTopics: ctrl.pageDetail.page.topic,
                        selectedLanguages: ctrl.pageDetail.page.language,
                        dataUri: ctrl.pageDetail.page.imageNormal,
                        website: ctrl.pageDetail.page.website
                    },
                    isEditMode: true
                }).then(function (genericPage) {
                ctrl.pageDetail.page.description = genericPage.description;
                ctrl.pageDetail.page.title = genericPage.title;
                ctrl.pageDetail.page.topic = Topics.getCodes(genericPage.selectedTopics);
                ctrl.pageDetail.page.language = Languages.getCodes(genericPage.selectedLanguages);
                ctrl.pageDetail.page.imageNormal = genericPage.dataUri;
                ctrl.pageDetail.page.imagePreview = genericPage.dataUri;
                ctrl.pageDetail.page.website = genericPage.website;
            });
        };

        ctrl.deletePage = function () {
            DeletePageService.deletePage(ctrl.pageDetail.page.pageId);
        };
    }];

