'use strict';

module.exports = ['fileUpload', '$q',
    function (fileUpload, $q) {

        this.upload = function (pageId, blogText, selectedTopics, selectedLanguage, blogImage) {
            var deferred = $q.defer();
            fileUpload.uploadFileAndJson(blogImage, {
                    editBlog: {
                        pageId: pageId,
                        text: blogText,
                        topic: selectedTopics,
                        language: selectedLanguage.code
                    }
                }, 'api/user/blog')
                .success(function (resp) {
                    resp.isAdmin = true;
                    resp.pageId = pageId;
                    resp.text = blogText;
                    resp.selectedTopics = selectedTopics;
                    resp.selectedLanguage = selectedLanguage;
                    deferred.resolve(resp);
                }).error(function () {
                deferred.reject({});
            });
            return deferred.promise;
        };
    }];
