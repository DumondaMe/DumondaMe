'use strict';

var uploadPage = function ($scope, $state, fileUpload, api) {
    var json = $scope.page[$scope.category.seletedCategoryType](), imageToUpload;

    if ($scope.imagePreviewData) {
        imageToUpload = $scope.imagePreviewData;
    }

    fileUpload.uploadFileAndJson(imageToUpload, json, 'api/user/page/create').
        showSuccess(function (resp) {
            $state.go('page.detail', {
                label: $scope.category.seletedCategoryType,
                pageId: resp.pageId
            });
        }).
        error(function () {

        });
};

module.exports = ['$scope', '$state', 'Languages', 'fileUpload', 'moment', 'PageCategories',
    function ($scope, $state, Languages, fileUpload, moment, PageCategories) {

        var imageDefaultPath = 'app/img/default.jpg';
        $scope.page.imagePreview = imageDefaultPath;
        $scope.commonSection = {};
        $scope.editChanged = false;
        $scope.editChangedTitle = false;

        $scope.$on('image.cropper.image.preview', function (event, data, dataToSend) {
            $scope.page.imagePreview = data;
            $scope.imagePreviewData = dataToSend;
        });

        $scope.$watch('category.selectedCategory', function (newValue) {
            if (newValue) {
                $scope.category.seletedCategoryType = PageCategories.getPageType($scope.category.selectedCategory);
            }
        });

        if ($scope.mode.edit) {
            $scope.$watchCollection('page', function (newValue) {
                if (newValue && $scope.commonSection.toCompare) {
                    if (!angular.equals($scope.commonSection.toCompare, newValue)) {
                        $scope.editChanged = true;
                    } else {
                        $scope.editChanged = false;
                    }
                }
            });

            $scope.$watch('category.title', function (newValue) {
                if (newValue && $scope.commonSection.toCompareTitle) {
                    if ($scope.commonSection.toCompareTitle !== $scope.category.title) {
                        $scope.editChangedTitle = true;
                    } else {
                        $scope.editChangedTitle = false;
                    }
                }
            });
        }

        $scope.createPage = function () {
            uploadPage($scope, $state, fileUpload, 'api/user/page/create');

        };

        $scope.editPage = function () {
            uploadPage($scope, $state, fileUpload, 'api/user/page/edit');
        };
    }];
