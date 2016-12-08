'use strict';

var app = angular.module('elyoosApp');

app.controller('FeedbackCreateCtrl', require('./controller'));

app.service('CreateFeedback', require('./services/createFeedback'));
app.service('CreateFeedbackMessage', require('./services/feedbackMessage'));