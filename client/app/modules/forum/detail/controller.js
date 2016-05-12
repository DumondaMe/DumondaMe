'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$stateParams', 'ForumQuestionDetail',
            function ($stateParams, ForumQuestionDetail) {
                var ctrl = this;
                ctrl.detail = ForumQuestionDetail.get({questionId: $stateParams.questionId}, function (resp) {

                });
            }];
    }
};

