'use strict';

module.exports = ['$stateParams', 'ForumAnswerDetail',
    function ($stateParams, ForumAnswerDetail) {
        var ctrl = this;

        ctrl.detail = ForumAnswerDetail.get({answerId: $stateParams.answerId});
    }];

