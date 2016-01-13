'use strict';

var getParams = function (CreateBlogVisibility, blogText) {
    var params = {addBlog: {text: blogText}}, visibility = [];
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
        this.upload = function (blogText, blogImage) {
            var deferred = $q.defer();
            if (CreateBlogCheck.isSendBlogAllowed(blogText, false) && !uploadBlogIsRunning) {
                uploadBlogIsRunning = true;
                fileUpload.uploadFileAndJson(blogImage, getParams(CreateBlogVisibility, blogText), 'api/user/blog').success(function (resp) {
                    uploadBlogIsRunning = false;
                    resp.isAdmin = true;
                    resp.pinwallType = "Blog";
                    deferred.resolve(resp);
                }).error(function () {
                    uploadBlogIsRunning = false;
                    deferred.reject({});
                });
            } else {
                deferred.reject({});
            }
            return deferred.promise;
        };
    }];
