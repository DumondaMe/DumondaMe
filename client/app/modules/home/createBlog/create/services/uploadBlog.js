'use strict';

var getParams = function (CreateBlogVisibility, blogText, selectedCategories) {
    var params = {addBlog: {text: blogText, category: selectedCategories}}, visibility = [];
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
        this.upload = function (blogText, selectedCategories, blogImage) {
            var deferred = $q.defer();
            if (CreateBlogCheck.isSendBlogAllowed(blogText, selectedCategories, false) && !uploadBlogIsRunning) {
                uploadBlogIsRunning = true;
                fileUpload.uploadFileAndJson(blogImage, getParams(CreateBlogVisibility, blogText, selectedCategories), 'api/user/blog')
                    .success(function (resp) {
                        uploadBlogIsRunning = false;
                        resp.isAdmin = true;
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
