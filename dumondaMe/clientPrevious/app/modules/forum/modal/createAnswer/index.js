'use strict';

var app = angular.module('elyoosApp');

app.controller('CreateForumAnswerController', require('./controller'));

app.service('ForumUploadAnswer', require('./services/uploadAnswer'));