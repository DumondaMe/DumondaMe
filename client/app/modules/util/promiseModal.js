'use strict';

module.exports = ['$modal', '$q', function ($modal, $q) {

    this.getModal = function (modalParams) {
        var confirm, deferred, parentShow;
        if (modalParams.scope) {
            modalParams.scope.confirm = function (res) {
                deferred.resolve(res);
                confirm.hide();
            };
        }

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
