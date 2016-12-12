'use strict';

var app = angular.module('elyoosApp');

app.controller('FeedbackManageCtrl', require('./controller'));

app.service('CreateFeedback', require('./services/createFeedback'));
app.service('EditFeedback', require('./services/editFeedback'));
app.service('CreateFeedbackMessage', require('./services/feedbackMessage'));