'use strict';

var app = angular.module('elyoosApp');

app.controller('FeedbackManageCtrl', require('./controller'));

app.service('FeedbackCreateBug', require('./services/createBug'));
app.service('FeedbackCreateIdea', require('./services/createIdea'));
app.service('FeedbackCreateDiscussionIdea', require('./services/createDiscussionIdea'));

app.service('FeedbackEditBug', require('./services/editBug'));
app.service('FeedbackEditIdea', require('./services/editIdea'));

app.service('CreateFeedbackMessage', require('./services/feedbackMessage'));
app.service('FeedbackServiceManager', require('./services/feedbackServiceManager'));