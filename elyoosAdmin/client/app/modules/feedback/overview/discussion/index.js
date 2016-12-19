'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('FeedbackDiscussionOverview', require('./services/overviewDiscussion'));

app.service('FeedbackDiscussionScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));
