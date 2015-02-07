'use strict';

module.exports = {
    directiveLink: function () {
        return function ($scope, element) {
            var $image = $(element.find('img')[0]);
            $image.cropper({
                aspectRatio: 1,
                minWidth: 200,
                minHeight: 200,
                dashed: false,
                zoomable: false,
                rotatable: false
            });

            $scope.$watch('getDataToUpload', function (newCommand) {
                if (newCommand) {
                    $scope.imageResultData($image.cropper('getDataURL', 'image/jpeg'));
                }
            });

            $scope.$watch('image', function (newImage) {
                if (newImage) {
                    $image.cropper('reset', true).cropper('replace', newImage);
                }
            });

            $scope.$watch('reset', function (reset) {
                if (reset) {
                    $image.cropper('reset', true);
                }
            });
        };
    }
};
