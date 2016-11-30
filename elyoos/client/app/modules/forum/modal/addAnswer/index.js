'use strict';

var app = angular.module('elyoosApp');

app.controller('ForumAddAnswerCtrl', require('./controller'));

app.service('ForumUploadAnswer', require('./services/uploadAnswer'));
