'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ForumQuestionDetail', require('./services/questionDetail'));
app.service('ForumAnswerDetail', require('./services/answerDetail'));
app.service('ForumQuestionDetailCollection', require('./services/detailCollection'));