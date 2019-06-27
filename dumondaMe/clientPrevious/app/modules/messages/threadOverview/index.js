'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ThreadsModificationUpdate', require('./services/modificationUpdate'));
app.service('ThreadOverviewScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));