'use strict';

module.exports = ['ElyModal', 'DateFormatCheckService', 'Categories', 'BookPageCreateMessageService', 'fileUpload', 'errorToast', 'moment',
    'CheckPageExists', 'UploadPageService',
    function (ElyModal, DateFormatCheckService, Categories, BookPageCreateMessageService, fileUpload, errorToast, moment, CheckPageExists,
              UploadPageService) {
        var ctrl = this;

        if (ctrl.isEditMode) {
            if (angular.isNumber(ctrl.data.publishDate)) {
                ctrl.data.publishDate = moment.unix(ctrl.data.publishDate).format('l');
            }
            ctrl.data.selectedCategories = Categories.getCategories(ctrl.data.selectedCategories);
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
        }

        CheckPageExists.reset();

        ctrl.getDateExample = DateFormatCheckService.getDateExample;
        ctrl.categories = Categories.categories;

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
            UploadPageService.uploadCreatePage(message, ctrl);
        };

        ctrl.modifyBook = function () {
            var message = BookPageCreateMessageService.getModifyBookPageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };

        ctrl.recommendationFinish = function () {
            ElyModal.hide();
        };
    }];

