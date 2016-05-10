'use strict';


module.exports = ['CreateForumQuestionCheck', 'ForumQuestion', '$q', 'Categories',
    function (CreateForumQuestionCheck, ForumQuestion, $q, Categories) {

        var uploadQuestionIsRunning = false;
        this.upload = function (text, selectedCategories, selectedLanguage) {
            var deferred = $q.defer();
            if (CreateForumQuestionCheck.isSendQuestionAllowed(text, selectedCategories, selectedLanguage) && !uploadQuestionIsRunning) {
                uploadQuestionIsRunning = true;
                ForumQuestion.save({
                    description: text,
                    language: selectedLanguage[0].code,
                    category: Categories.getCodes(selectedCategories)
                }, function (resp) {
                    uploadQuestionIsRunning = false;
                    resp.isAdmin = true;
                    deferred.resolve(resp);
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
