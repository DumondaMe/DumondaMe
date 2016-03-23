'use strict';

module.exports = ['ElyModal', 'DateFormatCheckService', 'Categories', 'BookPageCreateMessageService', 'fileUpload', 'errorToast', 'moment',
    'CheckPageExists',
    function (ElyModal, DateFormatCheckService, Categories, BookPageCreateMessageService, fileUpload, errorToast, moment, CheckPageExists) {
        var ctrl = this;

        if (ctrl.isEditMode) {
            if (angular.isNumber(ctrl.data.publishDate)) {
                ctrl.data.publishDate = moment.unix(ctrl.data.publishDate).format('l');
            }
            ctrl.data.selectedCategories = Categories.getCategories(ctrl.data.selectedCategories);
            ctrl.dataOnServer = angular.copy(ctrl.data);
            ctrl.dataHasChanged = false;
        } else {
            ctrl.data = {};
        }

        ctrl.selectImage = false;
        ctrl.recommendPage = false;
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
            ctrl.uploadStarted = true;

            fileUpload.uploadFileAndJson(ctrl.blob, message, 'api/user/page/create')
                .success(function (resp) {
                    ctrl.uploadStarted = false;
                    ctrl.pageId = resp.pageId;
                    ctrl.recommendPage = true;
                })
                .error(function () {
                    ctrl.uploadStarted = false;
                    errorToast.showError('Seite konnte nicht hochgeladen werden!');
                });
        };

        ctrl.modifyBook = function () {
            var message = BookPageCreateMessageService.getModifyBookPageMessage(ctrl.data);
            ctrl.uploadStarted = true;

            fileUpload.uploadFileAndJson(ctrl.blob, message, 'api/user/page/edit')
                .success(function () {
                    ElyModal.hide(ctrl.data);
                })
                .error(function () {
                    ctrl.uploadStarted = false;
                    errorToast.showError('Seite konnte nicht verändert werden!');
                });
        };

        ctrl.recommendationFinish = function () {
            ElyModal.hide();
        };
    }];

