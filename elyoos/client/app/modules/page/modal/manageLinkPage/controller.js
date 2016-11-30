'use strict';

module.exports = ['ElyModal', 'Topics', 'PageLinkUrlCheck', 'fileUpload', 'LinkPageCreateMessageService', 'UploadPageService',
    'CheckPageExists', 'RecommendationResponseFormatter', 'Languages',
    function (ElyModal, Topics, PageLinkUrlCheck, fileUpload, LinkPageCreateMessageService, UploadPageService, CheckPageExists,
              RecommendationResponseFormatter, Languages) {
        var ctrl = this;

        if (ctrl.isEditMode) {
            ctrl.data.selectedTopics = Topics.getTopics(ctrl.data.selectedTopics);
            ctrl.data.selectedLanguages = Languages.getLanguages(ctrl.data.selectedLanguages);
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
        }

        ctrl.languages = Languages.languages;

        CheckPageExists.reset();

        ctrl.topics = Topics.topics;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.cancelPreviewImage = function () {
            ctrl.selectImage = false;
        };

        ctrl.setPreviewImage = function (blob, dataUri) {
            ctrl.selectImage = false;
            ctrl.data.dataUri = dataUri;
            ctrl.blob = blob;
            ctrl.changeData();
        };

        ctrl.linkHasChanged = function () {
            ctrl.manageLinkPageForm.link.$setValidity('youtube-link', true);
            if(PageLinkUrlCheck.isYoutubeLink(ctrl.data.link)) {
                ctrl.manageLinkPageForm.link.$setValidity('youtube-link', false);
            } else {
                ctrl.checkPageExists(ctrl.data.link);
            }
        };

        ctrl.checkPageExists = function (query) {
            return CheckPageExists.checkPageExists(query, 'Link').then(function (result) {
                ctrl.searchResult = result.searchResult;
                ctrl.pageExists = result.pageExists;
            });
        };

        ctrl.changeData = function () {
            ctrl.dataHasChanged = !angular.equals(ctrl.dataOnServer, ctrl.data);
        };

        ctrl.closeOverviewPages = function () {
            ctrl.showExistingPages = false;
        };

        ctrl.createLink = function () {
            var message = LinkPageCreateMessageService.getCreateLinkPageMessage(ctrl.data);
            UploadPageService.uploadCreatePage(message, ctrl).then(function (resp) {
                ctrl.data.linkPreviewUrl = resp.data.linkPreviewUrl;
                ctrl.data.hostname = resp.data.hostname;
            });
        };

        ctrl.modifyLink = function () {
            var message = LinkPageCreateMessageService.getModifyLinkPageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };

        ctrl.recommendationFinish = function (recommendation) {
            RecommendationResponseFormatter.format(ctrl.data, recommendation, 'Link');
            ElyModal.hide(ctrl.data);
        };

        ctrl.recommendationAbort = function () {
            ElyModal.cancel();
        };
    }];

