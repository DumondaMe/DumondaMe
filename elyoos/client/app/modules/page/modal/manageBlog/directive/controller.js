'use strict';

module.exports = ['$scope', 'FileReaderUtil', 'CreateBlogVisibility', 'Topics', 'Languages',
    function ($scope, FileReaderUtil, CreateBlogVisibility, Topics, Languages) {
        var ctrl = this;

        ctrl.visibility = ["Öffentlich"];
        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;
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
                FileReader.onloadend = function () {
                    $scope.$apply(function () {
                        ctrl.data.imageForUploadPreview = FileReader.result;
                        ctrl.data.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob(ctrl.data.imageForUploadPreview);
                        ctrl.dataHasChanged = true;
                    });
                };
                FileReader.readAsDataURL(newImage);
            }
        });
    }];
