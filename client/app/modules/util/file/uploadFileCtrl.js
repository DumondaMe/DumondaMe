'use strict';

function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]),
        array = [], i;
    for (i = 0; i < binary.length; i = i + 1) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

module.exports = ['$scope', '$timeout', 'fileUpload', function ($scope, $timeout, fileUpload) {

    $scope.imageForUploadPreview = '';

    $scope.imageResultData = function (data) {
        fileUpload.uploadFileToUrl(dataURItoBlob(data), '/api/user/settings/uploadProfileImage');
    };

    $scope.$watch('imageForUpload', function (newImage) {
        var fileReader = new FileReader();
        if (newImage) {
            fileReader.onloadend = function () {
                $scope.$apply(function ($scope) {
                    $scope.imageForUploadPreview = fileReader.result;
                });
            };
            fileReader.readAsDataURL(newImage);
        }
    });

    $scope.startUpload = function () {
        if ($scope.updateImageResult) {
            $scope.updateImageResult += 1;
        } else {
            $scope.updateImageResult = 1;
        }
    };
}];
