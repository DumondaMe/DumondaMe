'use strict';

module.exports = ['ElyModal', function (ElyModal) {

    var service = this;

    service.showImage = function (url) {
        ElyModal.show('ImageViewCtrl', 'app/modules/util/modal/imageView/template.html', {url: url}, true, service.closeImage);
    };

    service.closeImage = function () {
        ElyModal.hide();
    };
}];
