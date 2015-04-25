'use strict';

module.exports = ['$modal', '$q', '$rootScope', function ($modal, $q, $rootScope) {

    this.getModal = function (modalParams) {
        var confirm, deferred, parentShow;
        if (!modalParams.scope) {
            modalParams.scope = $rootScope.$new(false);
        }

        modalParams.scope.confirm = function (res) {
            deferred.resolve(res);
            confirm.hide();
        };
        modalParams.scope.abort = function (res) {
            deferred.reject(res);
            confirm.hide();
        };

        modalParams.show = false;
        modalParams.html = true;
        confirm = $modal(modalParams);
        parentShow = confirm.show;

        confirm.show = function () {
            deferred = $q.defer();
            confirm.$promise.then(parentShow);
            return deferred.promise;
        };

        return confirm;
    };
}];
