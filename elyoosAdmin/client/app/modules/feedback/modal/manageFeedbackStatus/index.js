'use strict';

var app = angular.module('elyoosApp');

app.controller('FeedbackManageStatusCtrl', require('./controller'));

app.factory('FeedbackClose', require('./services/closeFeedback'));
app.factory('FeedbackReopen', require('./services/reopenFeedback'));