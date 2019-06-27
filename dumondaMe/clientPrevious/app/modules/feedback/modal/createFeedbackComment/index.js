'use strict';

var app = angular.module('elyoosApp');

app.controller('FeedbackCreateCommentCtrl', require('./controller'));

app.service('CreateFeedbackComment', require('./services/createFeedbackComment'));
app.service('CreateFeedbackCommentMessage', require('./services/feedbackMessage'));