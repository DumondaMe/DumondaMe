'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UtilFilePreviewPicture',
            function (UtilFilePreviewPicture) {
                var ctrl = this;
                ctrl.imagePreview = 'app/img/default.jpg';

                ctrl.selectTitlePicture = function () {
                    UtilFilePreviewPicture.getPreviewPicture().then(function (picture) {
                        ctrl.imagePreview = picture.preview;
                        ctrl.imageCanvas = picture.blob;
                    });
                };

                ctrl.commands.getImageBlob = function () {
                    return ctrl.imageCanvas;
                };
            }];
    }
};
