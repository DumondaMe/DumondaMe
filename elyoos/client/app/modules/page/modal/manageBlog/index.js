'use strict';

var app = angular.module('elyoosApp');

app.service('CreateBlogVisibility', require('./services/createBlogVisibility'));
app.service('CreateBlogCheck', require('./services/createBlogCheck'));
app.service('UploadBlog', require('./services/uploadBlog'));

app.controller('ManageBlogCtrl', require('./controller'));
