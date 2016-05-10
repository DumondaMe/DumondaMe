'use strict';

var app = angular.module('elyoosApp');

app.controller('CreateForumQuestionController', require('./controller'));

app.service('UploadForumQuestion', require('./services/uploadQuestion'));
app.service('CreateForumQuestionCheck', require('./services/createQuestionCheck'));
