'use strict';


module.exports = ['$modal',
    function ($modal) {

        this.getPreviewPicture = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/modules/util/file/previewPicture/template.html',
                controller: 'UtilFilePreviewPictureCtrl',
                controllerAs: 'ctrl',
                bindToController: true,
                backdrop: 'static',
                windowClass: 'center-modal'
            });

            return modalInstance.result;
        }
    }];
