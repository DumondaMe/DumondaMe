'use strict';

module.exports = ['$scope', 'FileReaderUtil', 'FileReader', 'CreateBlogVisibility', 'Topics', 'Languages',
    function ($scope, FileReaderUtil, FileReader, CreateBlogVisibility, Topics, Languages) {
        var ctrl = this;

        ctrl.visibility = ["Öffentlich"];
        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;
        ctrl.dataOnServer = angular.copy(ctrl.data);
        CreateBlogVisibility.reset();

        ctrl.setVisibility = function () {
            if (CreateBlogVisibility.isPublic()) {
                ctrl.visibility = ["Öffentlich"];
            } else {
                ctrl.visibility = CreateBlogVisibility.getVisibilityDescription();
            }
        };

        ctrl.dataChanged = function () {
            if (angular.isFunction(ctrl.eventDataChanged)) {
                ctrl.eventDataChanged(!angular.equals(ctrl.dataOnServer, ctrl.data), ctrl.manageBlogForm.$valid);
            }
        };

        $scope.$watch('imageForUpload', function (newImage) {
            if (newImage) {
                ctrl.eventImageLoad(true);
                FileReader.onloadend = function () {
                    $scope.$apply(function () {
                        ctrl.data.imageForUploadPreview = FileReader.result;
                        ctrl.data.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob(ctrl.data.imageForUploadPreview);
                        ctrl.dataHasChanged = true;
                        ctrl.dataChanged();
                        ctrl.eventImageLoad(false);
                    });
                };
                FileReader.readAsDataURL(newImage);
            }
        });
    }];
