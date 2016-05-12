'use strict';

module.exports = {
    directiveCtrl: function () {
        return [ 'ElyModal',
            function (ElyModal) {
                var ctrl = this;

                ctrl.createQuestion = function () {
                    ElyModal.show('CreateForumQuestionController', 'app/modules/forum/modal/createQuestion/template.html',
                        {element: ctrl.element})
                        .then(function (resp) {

                        });
                };
            }];
    }
};

