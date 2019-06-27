'use strict';

module.exports = ['fileUpload',
    function (fileUpload) {

        this.upload = function (pageId, blogText, selectedTopics, selectedLanguage, blogImage) {
            return fileUpload.uploadFileAndJson(blogImage, {
                editBlog: {
                    pageId: pageId,
                    text: blogText,
                    topic: selectedTopics,
                    language: selectedLanguage.code
                }
            }, 'api/user/blog').then(function (resp) {
                var response = resp.data;
                response.isAdmin = true;
                response.pageId = pageId;
                response.text = blogText;
                response.selectedTopics = selectedTopics;
                response.selectedLanguage = selectedLanguage;
                return response;
            });
        };
    }];
