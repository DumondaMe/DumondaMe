'use strict';

module.exports = ['ElyModal', 'Topics', 'GenericPageCreateMessageService', 'fileUpload', 'CheckPageExists', 'UploadPageService',
    'RecommendationResponseFormatter', 'Languages', 'ArrayHelper',
    function (ElyModal, Topics, GenericPageCreateMessageService, fileUpload, CheckPageExists, UploadPageService, RecommendationResponseFormatter,
              Languages, ArrayHelper) {
        var ctrl = this;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.createPlace = function (place) {
            var message = GenericPageCreateMessageService.getCreateGenericPageMessage(ctrl.data);
            UploadPageService.uploadCreatePage(message, ctrl);
        };
    }];

