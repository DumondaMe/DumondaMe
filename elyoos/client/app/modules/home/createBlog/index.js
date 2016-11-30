'use strict';

var app = angular.module('elyoosApp');

app.service('CreateBlogVisibility', require('./services/createBlogVisibility'));
app.service('CreateBlogCheck', require('./services/createBlogCheck'));

app.controller('HomePinwallCreateBlog', require('./controller'));
