'use strict';

module.exports = ['$scope', '$state', 'Languages', 'fileUpload', 'moment', 'PageCategories',
    function ($scope, $state, Languages, fileUpload, moment, PageCategories) {

        var imageDefaultPath = 'app/img/default.jpg';
        $scope.imagePreview = imageDefaultPath;
        $scope.validInputs = false;

        $scope.$on('image.cropper.image.preview', function (event, data, dataToSend) {
            $scope.imagePreview = data;
            $scope.imagePreviewData = dataToSend;
        });

        $scope.$watch('category.selectedCategory', function (newValue) {
            if (newValue) {
                $scope.category.seletedCategoryType = PageCategories.getPageType($scope.category.selectedCategory);
            }
        });

        $scope.createPage = function () {
            var json = $scope.page[$scope.category.seletedCategoryType](), imageToUpload;

            if ($scope.imagePreviewData !== imageDefaultPath) {
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

        $scope.editPage = function () {
            var json = $scope.page[$scope.category.seletedCategoryType](), imageToUpload;

        };
    }];
