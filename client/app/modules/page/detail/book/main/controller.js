'use strict';

module.exports = ['ElyModal', 'DeletePageService', 'Topics', 'Languages', 'moment',
    function (ElyModal, DeletePageService, Topics, Languages, moment) {
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
                        selectedLanguages: ctrl.pageDetail.page.language,
                        dataUri: ctrl.pageDetail.page.titleUrl
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.pageDetail.page.description = data.description;
                ctrl.pageDetail.page.author[0].name = data.author;
                ctrl.pageDetail.page.publishDate = data.publishDate;
                ctrl.pageDetail.page.topic = Topics.getCodes(data.selectedTopics);
                ctrl.pageDetail.page.language = Languages.getCodes([data.selectedLanguages]);
                ctrl.pageDetail.page.titleUrl = data.dataUri;
            });
        };

        ctrl.deletePage = function () {
            DeletePageService.deletePage(ctrl.pageDetail.page.pageId);
        };

        ctrl.addRecommendation = function () {
            ElyModal.show('RecommendationAddCtrl', 'app/modules/recommendation/addRecommendation/template.html',
                {pageId: ctrl.pageDetail.page.pageId, title: ctrl.pageDetail.page.title}).then(function (data) {
                ctrl.pageDetail.recommendation = data.recommendation;
                ctrl.pageDetail.recommendation.user.created = moment.unix(ctrl.pageDetail.recommendation.user.created).format('LL');
            });
        };
    }];

