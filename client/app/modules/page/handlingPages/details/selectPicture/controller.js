'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UtilFilePreviewPicture',
            function (UtilFilePreviewPicture) {
                var ctrl = this;

                ctrl.imagePreview = ctrl.imagePreviewUrl;

                ctrl.selectTitlePicture = function () {
                    UtilFilePreviewPicture.getPreviewPicture().then(function (picture) {
                        ctrl.imagePreview = picture.preview;
                        ctrl.imagePreviewUrl = picture.preview;
                        ctrl.imageCanvas = picture.blob;
                        if (angular.isFunction(ctrl.imageChanged)) {
                            ctrl.imageChanged(picture.preview, picture.blob);
                        }
                    });
                };
            }];
    }
};
