'use strict';

module.exports = ['$modal', '$rootScope', function ($modal, $rootScope) {

    this.show = function (modalParams) {

        var scope;
        modalParams.animation = true;
        modalParams.controllerAs = 'ctrl';
        modalParams.bindToController = true;
        modalParams.backdrop = 'static';

        if (modalParams.hasOwnProperty('scope')) {
            scope = $rootScope.$new();
            angular.extend(scope, modalParams.scope);
            modalParams.scope = scope;
        }

        if (!modalParams.hasOwnProperty('controller')) {
            modalParams.controller = function () {
            };
        }


        return $modal.open(modalParams).result;
    };
}];
