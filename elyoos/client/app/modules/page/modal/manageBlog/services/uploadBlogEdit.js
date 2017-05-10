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
                resp.isAdmin = true;
                resp.pageId = pageId;
                resp.text = blogText;
                resp.selectedTopics = selectedTopics;
                resp.selectedLanguage = selectedLanguage;
            });
        };
    }];
