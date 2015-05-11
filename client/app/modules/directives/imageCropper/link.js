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
                    rotatable: false,
                    built: function () {
                        var size = $image.cropper('getImageData');
                        $scope.originalSize(size.naturalWidth, size.naturalHeight);
                    }
                };

            if ($scope.ratio) {
                cropperSettings.aspectRatio = $scope.ratio;
            }
            if ($scope.minWidth) {
                cropperSettings.minWidth = $scope.minWidth;
            }
            if ($scope.minHeight) {
                cropperSettings.minHeight = $scope.minHeight;
            }

            $image.cropper(cropperSettings);

            $scope.$on('image.cropper.get.data', function () {
                $scope.imageResultData($image.cropper('getDataURL', 'image/jpeg'));
            });

            $scope.$on('image.cropper.set.ratio', function (event, ratio) {
                $image.cropper('setAspectRatio', ratio);
            });

            $scope.$watch('image', function (newImage) {
                if (newImage) {
                    $image.cropper('reset', true).cropper('replace', newImage);
                }
            });
        };
    }
};
