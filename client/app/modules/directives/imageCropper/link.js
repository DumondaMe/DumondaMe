'use strict';

module.exports = {
    directiveLink: function () {
        return function ($scope, element) {
            var $image = $(element.find('img')[0]),
                cropperSettings = {
                    minWidth: 200,
                    minHeight: 200,
                    dashed: false,
                    zoomable: false,
                    rotatable: false
                };

            if ($scope.ratio) {
                cropperSettings.aspectRatio = $scope.ratio;
            }

            $image.cropper(cropperSettings);

            $scope.$on('image.cropper.get.data', function () {
                $scope.imageResultData($image.cropper('getDataURL', 'image/jpeg'));
            });

            $scope.$watch('image', function (newImage) {
                if (newImage) {
                    $image.cropper('reset', true).cropper('replace', newImage);
                }
            });
        };
    }
};
