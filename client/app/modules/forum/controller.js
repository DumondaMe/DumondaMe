'use strict';

module.exports = {
    directiveCtrl: function () {
        return [ '$mdDialog',
            function ($mdDialog) {
                var ctrl = this;

                ctrl.createQuestion = function () {
                    $mdDialog.show({
                        templateUrl: 'app/modules/forum/createQuestion/template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        controller: 'CreateForumQuestionController',
                        locals: {element: ctrl.element},
                        bindToController: true,
                        controllerAs: 'ctrl'
                    }).then(function (resp) {

                    });
                };
            }];
    }
};

