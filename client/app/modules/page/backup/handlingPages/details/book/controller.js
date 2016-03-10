'use strict';

var isDateValid = function (moment, date) {
    return moment(date, 'l', moment.locale(), true).isValid();
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageEditModeService', 'PageLoader', 'moment', 'UploadBookPage', 'EditBookService',
            function ($scope, PageEditModeService, PageLoader, moment, UploadBookPage, EditBookService) {
                var ctrl = this;

                ctrl.imagePreview = 'app/img/default.jpg';
                ctrl.isEditMode = PageEditModeService.isEditMode();
                ctrl.editDataChanged = false;

                ctrl.editDataHasChanged = function (imagePreview, imageData) {
                    if (imagePreview && imageData) {
                        ctrl.imagePreview = imagePreview;
                        ctrl.imagePreviewData = imageData;
                    }
                    ctrl.editDataChanged = PageEditModeService.hasChanged(ctrl, EditBookService.getPreviousValues(),
                        EditBookService.getElementsToCompare());
                };

                ctrl.publishDateChanged = function () {
                    ctrl.editDataChanged = PageEditModeService.hasChanged(ctrl, EditBookService.getPreviousValues(),
                        EditBookService.getElementsToCompare());
                    if (ctrl.publishDate) {
                        $scope.commonForm.inputPublicationDate.$setValidity('custom', isDateValid(moment, ctrl.publishDate));
                    } else if (!ctrl.publishDate || ctrl.publishDate.trim() === '') {
                        $scope.commonForm.inputPublicationDate.$setValidity('custom', true);
                    }
                };

                ctrl.getDateExample = function () {
                    var unixTimestamp = 385974036;
                    return moment.unix(unixTimestamp).format('l');
                };

                ctrl.uploadPage = function () {
                    UploadBookPage.uploadPage(ctrl.description, ctrl.authors, ctrl.publishDate, ctrl.imagePreviewData, ctrl.pageId);
                };

                if (ctrl.isEditMode) {
                    angular.merge(ctrl, EditBookService.getValues());
                }
            }];
    }
};
