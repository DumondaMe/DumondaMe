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
        return ['$element', 'FileReaderUtil', function ($element, FileReaderUtil) {
            var ctrl = this;
            var $image = $($element.find('img')[0]),
                cropperSettings = {
                    minCropBoxWidth: 10,
                    minCropBoxHeight: 10,
                    guides: false,
                    zoomable: false,
                    scalable: false,
                    rotatable: false,
                    background: false,
                    viewMode: 1,
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

            if (ctrl.ratio) {
                cropperSettings.aspectRatio = ctrl.ratio;
            }
            if (ctrl.minWidth) {
                cropperSettings.minCropBoxWidth = ctrl.minWidth;
            }
            if (ctrl.minHeight) {
                cropperSettings.minCropBoxHeight = ctrl.minHeight;
            }

            $image.cropper(cropperSettings);

            ctrl.commands.getData = function () {
                var dataCanvas = $image.cropper('getCroppedCanvas'), dataUrl;
                if ('toDataURL' in dataCanvas) {
                    dataUrl = dataCanvas.toDataURL();
                    ctrl.imageResultData(FileReaderUtil.dataURItoBlob(dataUrl), dataUrl);
                } else {
                    ctrl.imageResultData();
                }
            };

            ctrl.commands.setImage = function (image) {
                $image.cropper('reset', true).cropper('replace', image);
            };

            ctrl.commands.enable = function () {
                $image.cropper('enable');
            };
            ctrl.commands.disable = function () {
                $image.cropper('disable');
            };
        }];
    }
};
