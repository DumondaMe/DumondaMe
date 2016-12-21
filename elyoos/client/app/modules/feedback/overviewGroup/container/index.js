'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('FeedbackOverviewGroupResponseHandler', require('./services/scrollRequestResponseHandler'));
app.service('FeedbackOverviewResourceHandler', require('./services/resourceHandler'));