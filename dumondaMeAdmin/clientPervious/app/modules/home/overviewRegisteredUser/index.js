'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('OverviewRegisteredUser', require('./services/overviewRegisteredUser'));

app.service('OverviewUserScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));
