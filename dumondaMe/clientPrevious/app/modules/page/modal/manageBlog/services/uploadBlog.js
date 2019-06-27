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
                    .then(function (resp) {
                        var result = resp.data;
                        uploadBlogIsRunning = false;
                        result.isAdmin = true;
                        result.title = blogTitle;
                        result.topic = selectedTopics;
                        result.language = selectedLanguage;
                        result.pinwallType = "Blog";
                        result.isPublic = CreateBlogVisibility.isPublic();
                        deferred.resolve(result);
                    }, function () {
                        uploadBlogIsRunning = false;
                        deferred.reject({});
                    });
            } else {
                return $q.reject({});
            }
            return deferred.promise;
        };
    }];
