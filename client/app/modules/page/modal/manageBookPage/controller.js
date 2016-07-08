'use strict';

module.exports = ['ElyModal', 'DateFormatCheckService', 'Topics', 'BookPageCreateMessageService', 'fileUpload', 'moment',
    'CheckPageExists', 'UploadPageService', 'RecommendationResponseFormatter', 'Languages',
    function (ElyModal, DateFormatCheckService, Topics, BookPageCreateMessageService, fileUpload, moment, CheckPageExists,
              UploadPageService, RecommendationResponseFormatter, Languages) {
        var ctrl = this;

        if (ctrl.isEditMode) {
            if (angular.isNumber(ctrl.data.publishDate)) {
                ctrl.data.publishDate = moment.unix(ctrl.data.publishDate).format('l');
            }
            ctrl.data.selectedTopics = Topics.getTopics(ctrl.data.selectedTopics);
            ctrl.data.selectedLanguages = Languages.getLanguages(ctrl.data.selectedLanguages)[0];
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
        }

        ctrl.languages = Languages.languages;

        CheckPageExists.reset();

        ctrl.getDateExample = DateFormatCheckService.getDateExample;
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

        ctrl.titleHasChanged = function () {
            if (ctrl.data.title && ctrl.data.title.length > 10) {
                ctrl.checkPageExists();
            }
        };

        ctrl.titleLostFocus = function () {
            ctrl.checkPageExists();
        };

        ctrl.checkPageExists = function () {
            return CheckPageExists.checkPageExists(ctrl.data.title, 'Book').then(function (result) {
                ctrl.searchResult = result.searchResult;
                ctrl.pageExists = result.pageExists;
            });
        };

        ctrl.changeData = function () {
            ctrl.dataHasChanged = !angular.equals(ctrl.dataOnServer, ctrl.data);
        };

        ctrl.publishDateChanged = function () {
            if (ctrl.data.publishDate && ctrl.data.publishDate.trim() !== "") {
                ctrl.manageBookPageForm.publishDate.$setValidity('ely-date', DateFormatCheckService.isDateValid(ctrl.data.publishDate));
            } else {
                ctrl.manageBookPageForm.publishDate.$setValidity('ely-date', true);
            }
        };

        ctrl.closeOverviewPages = function () {
            ctrl.showExistingPages = false;
        };

        ctrl.createBook = function () {
            var message = BookPageCreateMessageService.getCreateBookPageMessage(ctrl.data);
            UploadPageService.uploadCreatePage(message, ctrl).then(function (resp) {
                ctrl.data.bookPreviewUrl = resp.data.bookPreviewUrl;
            });
        };

        ctrl.modifyBook = function () {
            var message = BookPageCreateMessageService.getModifyBookPageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };

        ctrl.recommendationFinish = function (recommendation) {
            RecommendationResponseFormatter.format(ctrl.data, recommendation, 'Book');
            ElyModal.hide(ctrl.data);
        };

        ctrl.recommendationAbort = function () {
            ElyModal.cancel();
        };
    }];

