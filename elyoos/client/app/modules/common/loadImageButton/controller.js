'use strict';


module.exports = [function () {
    var ctrl = this;

    if (ctrl.openDialogInit === 'true') {
        angular.element(document.querySelector('#upload-photo'))[0].click();
    }
}];
