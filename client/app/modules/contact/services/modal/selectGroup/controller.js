'use strict';

module.exports = ['ContactStatisticTypes', '$mdDialog', 'CreateProblemCheck', 'UploadProblem',
    function (ContactStatisticTypes, $mdDialog, CreateProblemCheck, UploadProblem) {
        var ctrl = this;

        ctrl.types = ContactStatisticTypes.getTypes();
        if (ctrl.types.length > 0) {
            ctrl.selectedType = ctrl.types[0];
        }

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.accept = function () {
            $mdDialog.hide(ctrl.selectedType);
        };

    }];

