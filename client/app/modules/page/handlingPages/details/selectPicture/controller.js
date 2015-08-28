'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UtilFilePreviewPicture',
            function (UtilFilePreviewPicture) {
                var ctrl = this;
                this.imagePreview = 'app/img/default.jpg';

                this.selectTitlePicture = function () {
                    UtilFilePreviewPicture.getPreviewPicture().then(function (picture) {
                        ctrl.imagePreview = picture.preview;
                        ctrl.imageCanvas = picture.blob;
                    });
                };
            }];
    }
};
