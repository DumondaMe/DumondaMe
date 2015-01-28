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
    $scope.imageForUploadResult = '';

    $scope.$watch('imageForUpload', function (newImage) {
        var fileReader = new FileReader();
        if (newImage) {
            fileReader.onload = function (reader) {
                $scope.$apply(function ($scope) {
                    $scope.imageForUploadPreview = reader.target.result;
                });
            };
            fileReader.readAsDataURL(newImage);
        }
    });

    $scope.startUpload = function () {
        fileUpload.uploadFileToUrl(dataURItoBlob($scope.imageForUploadResult), '/api/user/settings/uploadProfileImage');
    };
}];
