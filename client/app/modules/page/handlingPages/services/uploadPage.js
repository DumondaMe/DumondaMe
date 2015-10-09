'use strict';

var goToPageDetail = function (pageId, $state, categoryType) {
    $state.go('page.detail', {
        label: categoryType,
        pageId: pageId
    });
};

var getPageId = function (pageId, resp) {
    if (!pageId) {
        return resp.pageId;
    }
    return pageId;
};

var getApi = function (isEditMode) {
    if (isEditMode) {
        return 'api/user/page/edit';
    }
    return 'api/user/page/create';
};

/**
 * Returns if the upload is in edit mode. When a page Id is present the upload will be as edit mode
 * @param pageId
 * @returns {boolean}
 */
var isEditMode = function (pageId) {
    return pageId !== undefined && pageId !== null;
};

var recommendPage = function (ElyModal, $state, pageId, categoryType) {
    ElyModal.show({
        templateUrl: 'app/modules/recommendation/modalAddRecommendation.html',
        controller: 'ModalAddRecommendationCtrl',
        resolve: {
            pageId: function () {
                return pageId;
            }
        }
    }).then(function () {
        goToPageDetail(pageId, $state, categoryType);
    });
};

module.exports = ['$state', 'errorToast', 'fileUpload', 'ElyModal',
    function ($state, errorToast, fileUpload, ElyModal) {

        var ctrl = this;

        ctrl.uploadPage = function (json, pageId, categoryType, imageToUpload) {
            var api, editMode = isEditMode(pageId);
            api = getApi(editMode);

            fileUpload.uploadFileAndJson(imageToUpload, json, api)
                .success(function (resp) {
                    pageId = getPageId(pageId, resp);
                    if (editMode) {
                        goToPageDetail(pageId, $state, categoryType);
                    } else {
                        recommendPage(ElyModal, $state, pageId, categoryType);
                    }
                })
                .error(function () {
                    errorToast.showError('Fehler! Seite konnte nicht hochgeladen werden');
                });
        };

    }];
