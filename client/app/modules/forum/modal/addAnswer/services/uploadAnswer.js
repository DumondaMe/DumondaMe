'use strict';

module.exports = ['ForumQuestionAnswer', function (ForumQuestionAnswer) {

    this.upload = function (pageToReference, questionId, title, description, type) {
        var data;
        if (pageToReference && pageToReference.hasOwnProperty('pageId')) {
            data = {
                page: {
                    questionId: questionId,
                    pageId: pageToReference.pageId,
                    description: description,
                    type: type
                }
            }
        } else {
            data = {
                normal: {
                    questionId: questionId,
                    title: title,
                    description: description,
                    type: type
                }
            }
        }

        return ForumQuestionAnswer.save(data).$promise.then(function (resp) {
            var answer = {answerId: resp.answerId, positiveRating: 0};
            if (pageToReference && pageToReference.hasOwnProperty('pageId')) {
                answer.page = {
                    pageId: pageToReference.pageId,
                    title: pageToReference.title,
                    label: pageToReference.label
                }
            } else {
                answer.title = title;
            }
            return answer;
        });
    };
}];
