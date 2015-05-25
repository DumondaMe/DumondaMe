'use strict';

var previousHeight, previousWidth;

var checkRatio = function ($scope, $image) {
    var size, ratio;
    if ($scope.minRatio && $scope.maxRatio && previousHeight && previousWidth) {
        size = $image.cropper('getCropBoxData');
        if (previousHeight !== size.height || previousWidth !== size.width) {
            ratio = size.height / size.width;
            if (ratio < $scope.minRatio || ratio > $scope.maxRatio) {
                $image.cropper('setCropBoxData', {
                    left: size.left,
                    top: size.top,
                    width: previousWidth,
                    height: previousHeight
                });
                return;
            }
            previousHeight = size.height;
            previousWidth = size.width;
        }
    }
};

module.exports = {
    directiveLink: function () {
        return function ($scope, element) {
            var $image = $(element.find('img')[0]),
                cropperSettings = {
                    minCropBoxWidth: 200,
                    minCropBoxHeight: 200,
                    guides: false,
                    zoomable: false,
                    rotatable: false,
                    built: function () {
                        var size = $image.cropper('getImageData'), cropWidth;
                        if ($scope.originalSize) {
                            $scope.originalSize(size.naturalWidth, size.naturalHeight);
                        }
                        if ($scope.minRatio && $scope.maxRatio) {
                            cropWidth = size.height / $scope.maxRatio;
                            $image.cropper('setCropBoxData', {
                                left: (size.width - cropWidth) / 2,
                                top: 0,
                                width: cropWidth,
                                height: size.height
                            });
                            previousHeight = size.height;
                            previousWidth = cropWidth;
                        }
                    },
                    crop: function () {
                        checkRatio($scope, $image);
                    }
                };

            if ($scope.ratio) {
                cropperSettings.aspectRatio = $scope.ratio;
            }
            if ($scope.minWidth) {
                cropperSettings.minCropBoxWidth = $scope.minWidth;
            }
            if ($scope.minHeight) {
                cropperSettings.minCropBoxHeight = $scope.minHeight;
            }

            $image.cropper(cropperSettings);

            $scope.$on('image.cropper.get.data', function () {
                $scope.imageResultData($image.cropper('getCroppedCanvas'));
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
