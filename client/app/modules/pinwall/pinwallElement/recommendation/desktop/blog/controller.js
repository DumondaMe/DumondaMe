'use strict';


var checkHasDetail = function (text, image) {
    return (angular.isString(text) && text.length > 120) || angular.isString(image);
};

module.exports = ['PreviewTextService', 'ElyModal',
    function (PreviewTextService, ElyModal) {
        var ctrl = this, hasDetail;

        ctrl.previewText = PreviewTextService.getPreviewText(ctrl.element.text, 120).text;

        hasDetail = checkHasDetail(ctrl.element.text, ctrl.element.url);

        ctrl.openDetail = function () {
            if (hasDetail) {
                ElyModal.show('HomePinwallBlogDetail', 'app/modules/pinwall/pinwallElement/blog/detail/detail.html', {element: ctrl.element});
            }
        };

    }];

