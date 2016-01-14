'use strict';

module.exports = {
    directiveCtrl: function () {
        return [ '$mdDialog',
            function ($mdDialog) {
                var ctrl = this;

                ctrl.createProblem = function () {
                    $mdDialog.show({
                        templateUrl: 'app/modules/problem/createProblem/template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        controller: 'CreateProblemController',
                        locals: {element: ctrl.element},
                        bindToController: true,
                        controllerAs: 'ctrl'
                    }).then(function (resp) {

                    });
                };
            }];
    }
};

