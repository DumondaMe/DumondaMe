'use strict';


module.exports = ['CreateForumQuestionCheck', 'ForumQuestion', '$q', 'Topics',
    function (CreateForumQuestionCheck, ForumQuestion, $q, Topics) {

        var uploadQuestionIsRunning = false;
        this.upload = function (text, selectedTopics, selectedLanguage) {
            var deferred = $q.defer();
            if (CreateForumQuestionCheck.isSendQuestionAllowed(text, selectedTopics, selectedLanguage) && !uploadQuestionIsRunning) {
                uploadQuestionIsRunning = true;
                ForumQuestion.save({
                    description: text,
                    language: selectedLanguage[0].code,
                    topic: Topics.getCodes(selectedTopics)
                }, function (resp) {
                    uploadQuestionIsRunning = false;
                    deferred.resolve({
                        questionId: resp.questionId,
                        isAdmin: true,
                        description: text,
                        language: selectedLanguage[0].code,
                        topic: Topics.getCodes(selectedTopics),
                        activityRating: 0
                    });
                }, function () {
                    uploadQuestionIsRunning = false;
                    deferred.reject({});
                });
            } else {
                deferred.reject({});
            }
            return deferred.promise;
        };
    }];
