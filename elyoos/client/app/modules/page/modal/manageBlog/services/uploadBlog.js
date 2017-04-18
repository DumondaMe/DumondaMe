'use strict';

var getParams = function (CreateBlogVisibility, blogText, blogTitle, selectedTopics, selectedLanguage) {
    var params = {addBlog: {text: blogText, title: blogTitle, topic: selectedTopics, language: selectedLanguage.code}};
    if (!CreateBlogVisibility.isPublic()) {
        params.addBlog.visibility = CreateBlogVisibility.getPrivacyTypesSelected();
    }
    return params;
};

module.exports = ['CreateBlogVisibility', 'CreateBlogCheck', 'fileUpload', '$q',
    function (CreateBlogVisibility, CreateBlogCheck, fileUpload, $q) {

        var uploadBlogIsRunning = false;
        this.upload = function (blogText, blogTitle, selectedTopics, selectedLanguage, blogImage) {
            var deferred = $q.defer();
            if (CreateBlogCheck.isSendBlogAllowed(blogText, blogTitle, selectedTopics, selectedLanguage, false) && !uploadBlogIsRunning) {
                uploadBlogIsRunning = true;
                fileUpload.uploadFileAndJson(blogImage, getParams(CreateBlogVisibility, blogText, blogTitle, selectedTopics, selectedLanguage),
                    'api/user/blog')
                    .success(function (resp) {
                        uploadBlogIsRunning = false;
                        resp.isAdmin = true;
                        resp.title = blogTitle;
                        resp.topic = selectedTopics;
                        resp.language = selectedLanguage;
                        resp.pinwallType = "Blog";
                        resp.isPublic = CreateBlogVisibility.isPublic();
                        deferred.resolve(resp);
                    }).error(function () {
                    uploadBlogIsRunning = false;
                    deferred.reject({});
                });
            } else {
                return $q.reject({});
            }
            return deferred.promise;
        };
    }];
