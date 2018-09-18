'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('OverviewFeedback', require('./services/overviewFeedback'));

app.service('OverviewFeedbackScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));
