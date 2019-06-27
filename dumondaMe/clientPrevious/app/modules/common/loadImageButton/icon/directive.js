'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/common/loadImageButton/icon/template.html',
            controller: require('./../controller.js'),
            link: require('./../link.js'),
            controllerAs: 'ctrl',
            bindToController: {
                imageForUpload: '=',
                icon: '@',
                label: '@',
                ariaLabel: '@',
                openDialogInit: '@'
            }
        };
    }],
    name: 'elyLoadImageButtonIcon'
};
