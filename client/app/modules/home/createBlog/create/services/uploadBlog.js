'use strict';

var getParams = function (CreateBlogVisibility, blogText, selectedTopics) {
    var params = {addBlog: {text: blogText, topic: selectedTopics}}, visibility = [];
    if (!CreateBlogVisibility.isPublic()) {
        angular.forEach(CreateBlogVisibility.getPrivacyTypesSelected(), function (type) {
            visibility.push(type.type);
        });
        params.addBlog.visibility = visibility;
    }
    return params;
};

module.exports = ['CreateBlogVisibility', 'CreateBlogCheck', 'fileUpload', '$q',
    function (CreateBlogVisibility, CreateBlogCheck, fileUpload, $q) {

        var uploadBlogIsRunning = false;
        this.upload = function (blogText, selectedTopics, blogImage) {
            var deferred = $q.defer();
            if (CreateBlogCheck.isSendBlogAllowed(blogText, selectedTopics, false) && !uploadBlogIsRunning) {
                uploadBlogIsRunning = true;
                fileUpload.uploadFileAndJson(blogImage, getParams(CreateBlogVisibility, blogText, selectedTopics), 'api/user/blog')
                    .success(function (resp) {
                        uploadBlogIsRunning = false;
                        resp.isAdmin = true;
                        resp.topic = selectedTopics;
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
