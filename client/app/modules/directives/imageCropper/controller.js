'use strict';

var previousHeight, previousWidth;

var checkRatio = function (ctrl, $image) {
    var size, ratio;
    if (ctrl.minRatio && ctrl.maxRatio && previousHeight && previousWidth) {
        size = $image.cropper('getCropBoxData');
        if (previousHeight !== size.height || previousWidth !== size.width) {
            ratio = size.height / size.width;
            if (ratio < ctrl.minRatio || ratio > ctrl.maxRatio) {
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
    directiveCtrl: function () {
        return ['$element', function ($element) {
            var ctrl = this;
            var $image = $($element.find('img')[0]),
                cropperSettings = {
                    minCropBoxWidth: 200,
                    minCropBoxHeight: 200,
                    guides: false,
                    zoomable: false,
                    rotatable: false,
                    built: function () {
                        var size = $image.cropper('getImageData'), cropWidth;
                        if (this.originalSize) {
                            this.originalSize(size.naturalWidth, size.naturalHeight);
                        }
                        if (this.minRatio && this.maxRatio) {
                            cropWidth = size.height / this.maxRatio;
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
                        checkRatio(ctrl, $image);
                    }
                };

            if (this.ratio) {
                cropperSettings.aspectRatio = this.ratio;
            }
            if (this.minWidth) {
                cropperSettings.minCropBoxWidth = this.minWidth;
            }
            if (this.minHeight) {
                cropperSettings.minCropBoxHeight = this.minHeight;
            }

            $image.cropper(cropperSettings);

            this.commands.getData = function () {
                ctrl.imageResultData($image.cropper('getCroppedCanvas'));
            };

            this.commands.setImage = function (image) {
                $image.cropper('reset', true).cropper('replace', image);
            };

            /*$scope.$on('image.cropper.set.ratio', function (event, ratio) {
                $image.cropper('setAspectRatio', ratio);
            });

            $scope.$watch('image', function (newImage) {
                if (newImage) {
                    $image.cropper('reset', true).cropper('replace', newImage);
                }
            });*/
        }];
    }
};
