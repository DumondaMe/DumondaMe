'use strict';

var uploadPage = function ($scope, $state, fileUpload, api, pageId) {
    var json = $scope.page[$scope.category.selectedCategoryType](), imageToUpload;

    if ($scope.imagePreviewData) {
        imageToUpload = $scope.imagePreviewData;
    }

    fileUpload.uploadFileAndJson(imageToUpload, json, api).
        showSuccess(function (resp) {
            if(!pageId) {
                $state.go('page.detail', {
                    label: $scope.category.selectedCategoryType,
                    pageId: resp.pageId
                });
            } else {
                $state.go('page.detail', {
                    label: $scope.category.selectedCategoryType,
                    pageId: pageId
                });
            }
        }).
        error(function () {

        });
};

module.exports = ['$scope', '$state', '$stateParams', 'Languages', 'fileUpload', 'moment', 'PageCategories',
    function ($scope, $state, $stateParams, Languages, fileUpload, moment, PageCategories) {

        var imageDefaultPath = 'app/img/default.jpg';
        $scope.page.imagePreview = imageDefaultPath;
        $scope.commonSection = {};
        $scope.editChanged = false;
        $scope.editChangedTitle = false;

        $scope.$on('image.cropper.image.preview', function (event, data, dataToSend) {
            $scope.page.imagePreview = data.toDataURL("image/jpeg", 1.0);
            $scope.imagePreviewData = dataToSend;
        });

        $scope.$watch('category.selectedCategory', function (newValue) {
            if (newValue) {
                $scope.category.selectedCategoryType = PageCategories.getPageType(newValue);
            }
        });

        $scope.$watch('category.selectedSubCategory', function (newValue) {
            if (newValue) {
                $scope.category.selectedSubCategoryType = PageCategories.getPageType(newValue);
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
            uploadPage($scope, $state, fileUpload, 'api/user/page/create', $stateParams.pageId);

        };

        $scope.editPage = function () {
            uploadPage($scope, $state, fileUpload, 'api/user/page/edit', $stateParams.pageId);
        };
    }];
