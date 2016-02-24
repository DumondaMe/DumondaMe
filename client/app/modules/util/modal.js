'use strict';

module.exports = ['$mdDialog', '$rootScope', function ($mdDialog, $rootScope) {

    var preventStateChange = false;

    this.show = function (controller, template, locals) {

        var modalParams = {
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false,
            bindToController: true,
            controllerAs: 'ctrl',
            controller: controller,
            templateUrl: template,
            locals: locals
        };

        preventStateChange = true;
        return $mdDialog.show(modalParams).then(function (resp) {
            preventStateChange = false;
            return resp;
        });
    };

    this.hide = function (resp) {
        preventStateChange = false;
        $mdDialog.hide(resp);
    };

    this.cancel = function() {
        preventStateChange = false;
        $mdDialog.cancel();
    };

    $rootScope.$on('$stateChangeStart',
        function (event) {
            if(preventStateChange) {
                event.preventDefault();
            }
        });
}];
